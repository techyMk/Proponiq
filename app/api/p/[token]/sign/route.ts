import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { sendEmail, appUrl } from "@/lib/email";
import { proposalSignedEmail, signatureReceiptEmail } from "@/lib/email-templates";

export const runtime = "nodejs";

const schema = z.object({
  signerName: z.string().trim().min(2).max(120),
  signerEmail: z.string().trim().email("Please enter a valid email").max(160),
  consent: z.literal(true, {
    errorMap: () => ({ message: "You must agree before signing" }),
  }),
});

export async function POST(req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const proposal = await db.proposal.findUnique({
    where: { shareToken: token },
    include: {
      signatures: { take: 1 },
      user: { select: { name: true, email: true } },
    },
  });

  if (!proposal || !proposal.isPublic) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (proposal.signatures.length > 0) {
    return NextResponse.json(
      { error: "Already signed" },
      { status: 409 }
    );
  }

  const userAgent = req.headers.get("user-agent") ?? null;
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    null;

  const [signature] = await db.$transaction([
    db.proposalSignature.create({
      data: {
        proposalId: proposal.id,
        signerName: parsed.data.signerName.trim(),
        signerEmail: parsed.data.signerEmail.trim().toLowerCase(),
        userAgent,
        ip,
      },
    }),
    db.proposal.update({
      where: { id: proposal.id },
      data: { status: "SIGNED" },
    }),
  ]);

  // Fire-and-log email notifications
  const senderName = proposal.user.name ?? "Proponiq user";
  const shareUrl = `${appUrl()}/p/${token}`;
  const ownerEmail = proposal.user.email;

  try {
    if (ownerEmail) {
      await sendEmail({
        to: ownerEmail,
        subject: `🎉 ${proposal.clientName} signed your proposal`,
        html: proposalSignedEmail({
          ownerName: proposal.user.name ?? "there",
          signerName: signature.signerName,
          signerEmail: signature.signerEmail ?? "",
          clientName: proposal.clientName,
          proposalTitle: proposal.title,
          proposalUrl: `${appUrl()}/proposals/${proposal.id}`,
          amount: proposal.amount,
        }),
      });
    }
    if (signature.signerEmail) {
      await sendEmail({
        to: signature.signerEmail,
        subject: `Confirmation: you signed "${proposal.title}"`,
        html: signatureReceiptEmail({
          signerName: signature.signerName,
          proposalTitle: proposal.title,
          senderName,
          shareUrl,
          signedAt: signature.signedAt,
        }),
        replyTo: ownerEmail ?? undefined,
      });
    }
  } catch (err) {
    console.error("[sign] email notifications failed", err);
    // Don't fail the signature if email fails
  }

  return NextResponse.json(signature, { status: 201 });
}
