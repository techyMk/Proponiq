import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmail, appUrl } from "@/lib/email";
import { proposalViewedEmail } from "@/lib/email-templates";

export const runtime = "nodejs";

export async function POST(req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;

  const proposal = await db.proposal.findUnique({
    where: { shareToken: token },
    include: {
      _count: { select: { views: true } },
      user: { select: { name: true, email: true } },
    },
  });
  if (!proposal || !proposal.isPublic) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const userAgent = req.headers.get("user-agent") ?? null;
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    null;

  await db.$transaction([
    db.proposalView.create({
      data: { proposalId: proposal.id, userAgent, ip },
    }),
    db.proposal.update({
      where: { id: proposal.id },
      data: {
        status: proposal.status === "SENT" ? "VIEWED" : proposal.status,
      },
    }),
  ]);

  // Notify the owner the first time their proposal is viewed
  const isFirstView = proposal._count.views === 0;
  if (isFirstView && proposal.user.email) {
    try {
      await sendEmail({
        to: proposal.user.email,
        subject: `${proposal.clientName} just opened your proposal`,
        html: proposalViewedEmail({
          ownerName: proposal.user.name ?? "there",
          clientName: proposal.clientName,
          proposalTitle: proposal.title,
          proposalUrl: `${appUrl()}/proposals/${proposal.id}`,
        }),
      });
    } catch (err) {
      console.error("[track] failed to send view notification", err);
    }
  }

  return NextResponse.json({ ok: true });
}
