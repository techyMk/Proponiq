import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { ProposalCard } from "@/components/app/proposal-card";

export const dynamic = "force-dynamic";

export default async function ProposalsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const proposals = await db.proposal.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { views: true } } },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
            Proposals
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {proposals.length} total · ordered by latest activity
          </p>
        </div>
        <Button asChild variant="primary">
          <Link href="/proposals/new">
            <Plus className="size-4" />
            New proposal
          </Link>
        </Button>
      </div>

      {proposals.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-foreground/15 p-12 text-center text-sm text-muted-foreground">
          You haven&apos;t created any proposals yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {proposals.map((p) => (
            <ProposalCard key={p.id} p={p} viewCount={p._count.views} />
          ))}
        </div>
      )}
    </div>
  );
}
