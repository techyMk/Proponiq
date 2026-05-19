import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, FileText, Eye, CheckCircle2, Sparkles } from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { ProposalCard } from "@/components/app/proposal-card";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [proposals, agg] = await Promise.all([
    db.proposal.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      take: 24,
      include: { _count: { select: { views: true } } },
    }),
    db.proposal.groupBy({
      by: ["status"],
      where: { userId: session.user.id },
      _count: { _all: true },
    }),
  ]);

  const counts = Object.fromEntries(agg.map((a) => [a.status, a._count._all]));
  const total = proposals.length;

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
            Welcome back{session.user.name ? `, ${session.user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Here&apos;s a snapshot of your proposal pipeline.
          </p>
        </div>
        <Button asChild variant="primary" className="hidden sm:inline-flex">
          <Link href="/proposals/new">
            <Plus className="size-4" />
            New proposal
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Total" value={total} icon={FileText} />
        <StatCard label="Sent" value={counts.SENT ?? 0} icon={Sparkles} />
        <StatCard label="Viewed" value={counts.VIEWED ?? 0} icon={Eye} />
        <StatCard label="Signed" value={counts.SIGNED ?? 0} icon={CheckCircle2} tint="mint" />
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold">Recent proposals</h2>
          <Link
            href="/proposals"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            View all →
          </Link>
        </div>

        {proposals.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {proposals.map((p) => (
              <ProposalCard key={p.id} p={p} viewCount={p._count.views} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  tint,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  tint?: "mint";
}) {
  return (
    <div className="rounded-2xl border border-foreground/10 bg-card p-4 md:p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span
          className={`inline-flex size-7 items-center justify-center rounded-lg ${
            tint === "mint" ? "bg-mint/15 text-mint" : "bg-foreground/[0.05] text-foreground/70"
          }`}
        >
          <Icon className="size-3.5" />
        </span>
      </div>
      <div className="mt-2 font-display text-2xl md:text-3xl font-semibold tracking-tight">
        {value}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="relative rounded-2xl border border-dashed border-foreground/15 bg-card/40 p-10 md:p-16 text-center overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-50"
      >
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 size-[300px] rounded-full bg-mint/15 blur-[100px]" />
      </div>
      <div className="relative mx-auto inline-flex size-14 items-center justify-center rounded-2xl bg-mint/10 border border-mint/20 text-mint mb-4">
        <Sparkles className="size-6" />
      </div>
      <h3 className="font-display text-lg font-semibold">No proposals yet</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
        Draft your first proposal with AI in under 60 seconds — answer a few
        questions and we&apos;ll write the rest.
      </p>
      <Button asChild variant="primary" className="mt-6">
        <Link href="/proposals/new">
          <Plus className="size-4" />
          Create your first proposal
        </Link>
      </Button>
    </div>
  );
}
