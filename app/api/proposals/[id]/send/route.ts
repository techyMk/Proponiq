import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { sendEmail, appUrl, emailEnabled } from "@/lib/email";
import { proposalSentEmail } from "@/lib/email-templates";

export const runtime = "nodejs";

const schema = z.object({
  to: z.string().email().max(160),
  subject: z.string().min(2).max(200).optional(),
  message: z.string().max(2000).optional(),
});

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!emailEnabled) {
    return NextResponse.json(
      { error: "Email is not configured. Set RESEND_API_KEY in .env." },
      { status: 503 }
    );
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;

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
    where: { id },
    include: { user: { select: { name: true, email: true } } },
  });
  if (!proposal) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (proposal.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Make sure the share link is live
  await db.proposal.update({
    where: { id },
    data: {
      isPublic: true,
      status: proposal.status === "DRAFT" ? "SENT" : proposal.status,
      clientEmail: parsed.data.to,
    },
  });

  const shareUrl = `${appUrl()}/p/${proposal.shareToken}`;
  const senderName = proposal.user.name ?? "Proponiq user";
  const subject = parsed.data.subject ?? `Your proposal — ${proposal.title}`;
  const html = proposalSentEmail({
    senderName,
    clientName: proposal.clientName,
    proposalTitle: proposal.title,
    message: parsed.data.message,
    shareUrl,
  });

  await sendEmail({
    to: parsed.data.to,
    subject,
    html,
    replyTo: proposal.user.email ?? undefined,
  });

  return NextResponse.json({ ok: true, shareUrl });
}
