import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ProposalEditor } from "@/components/app/proposal-editor";

export const dynamic = "force-dynamic";

export default async function EditProposalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const { id } = await params;

  const [proposal, owner] = await Promise.all([
    db.proposal.findUnique({
      where: { id },
      include: {
        _count: { select: { views: true } },
        signatures: { orderBy: { signedAt: "asc" }, take: 1 },
      },
    }),
    db.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true },
    }),
  ]);
  if (!proposal) notFound();
  if (proposal.userId !== session.user.id) redirect("/dashboard");

  const signature = proposal.signatures[0] ?? null;

  return (
    <ProposalEditor
      proposal={{
        id: proposal.id,
        title: proposal.title,
        clientName: proposal.clientName,
        clientEmail: proposal.clientEmail,
        status: proposal.status,
        amount: proposal.amount,
        currency: proposal.currency,
        content: proposal.content as object,
        shareToken: proposal.shareToken,
        isPublic: proposal.isPublic,
        viewCount: proposal._count.views,
        updatedAt: proposal.updatedAt.toISOString(),
        signature: signature
          ? {
              signerName: signature.signerName,
              signerEmail: signature.signerEmail,
              signedAt: signature.signedAt.toISOString(),
            }
          : null,
      }}
      ownerName={owner?.name ?? null}
      ownerEmail={owner?.email ?? null}
    />
  );
}
