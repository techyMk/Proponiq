import Link from "next/link";
import { Eye, Calendar, MoreHorizontal } from "lucide-react";
import type { Proposal, ProposalStatus } from "@prisma/client";
import { cn } from "@/lib/utils";

const statusStyles: Record<ProposalStatus, string> = {
  DRAFT: "bg-foreground/[0.06] text-muted-foreground border-foreground/10",
  SENT: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  VIEWED: "bg-amber-400/10 text-amber-400 border-amber-400/30",
  SIGNED: "bg-mint/15 text-mint border-mint/30",
  ARCHIVED: "bg-foreground/[0.04] text-muted-foreground/60 border-foreground/10",
};

export function ProposalCard({
  p,
  viewCount,
}: {
  p: Pick<
    Proposal,
    "id" | "title" | "clientName" | "status" | "updatedAt" | "amount" | "currency"
  >;
  viewCount?: number;
}) {
  const date = new Date(p.updatedAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  return (
    <Link
      href={`/proposals/${p.id}`}
      className="group relative rounded-2xl border border-foreground/10 bg-card p-5 transition-all hover:border-mint/30 hover:shadow-glow-sm hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-base font-semibold tracking-tight truncate">
            {p.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {p.clientName}
          </p>
        </div>
        <MoreHorizontal className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition shrink-0" />
      </div>

      <div className="mt-5 flex items-center justify-between">
        <span
          className={cn(
            "inline-block px-2 py-0.5 rounded-full border text-[10px] font-medium",
            statusStyles[p.status]
          )}
        >
          {p.status[0] + p.status.slice(1).toLowerCase()}
        </span>
        {p.amount && (
          <span className="text-xs font-medium">
            {p.amount}
            {p.currency ? ` ${p.currency}` : ""}
          </span>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-foreground/5 flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Calendar className="size-3" />
          {date}
        </span>
        {viewCount != null && (
          <span className="inline-flex items-center gap-1">
            <Eye className="size-3" />
            {viewCount} {viewCount === 1 ? "view" : "views"}
          </span>
        )}
      </div>
    </Link>
  );
}
