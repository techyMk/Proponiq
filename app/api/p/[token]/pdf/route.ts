import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { renderProposalPdf, pdfHeaders } from "@/lib/pdf/render";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET(_req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;

  const proposal = await db.proposal.findUnique({
    where: { shareToken: token },
    include: {
      user: { select: { name: true } },
      signatures: { orderBy: { signedAt: "asc" }, take: 1 },
    },
  });

  if (!proposal || !proposal.isPublic) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const signature = proposal.signatures[0] ?? null;
  const buffer = await renderProposalPdf({
    title: proposal.title,
    clientName: proposal.clientName,
    amount: proposal.amount,
    content: proposal.content as never,
    authorName: proposal.user.name ?? null,
    signature: signature
      ? {
          signerName: signature.signerName,
          signerEmail: signature.signerEmail,
          signedAt: signature.signedAt.toISOString(),
        }
      : null,
  });

  return new Response(new Uint8Array(buffer), {
    headers: pdfHeaders(`${proposal.title}-${proposal.clientName}`),
  });
}
