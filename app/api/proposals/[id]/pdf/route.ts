import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { renderProposalPdf, pdfHeaders } from "@/lib/pdf/render";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;

  const proposal = await db.proposal.findUnique({
    where: { id },
    include: {
      user: { select: { name: true } },
      signatures: { orderBy: { signedAt: "asc" }, take: 1 },
    },
  });
  if (!proposal) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (proposal.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
