"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Sparkles, CreditCard, Loader2, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

type Plan = "FREE" | "PRO" | "AGENCY";

const PLAN_LABEL: Record<Plan, string> = {
  FREE: "Starter (Free)",
  PRO: "Pro",
  AGENCY: "Agency",
};

export function BillingCard({
  plan,
  hasSubscription,
  periodEnd,
  proposalsUsedThisMonth,
}: {
  plan: Plan;
  hasSubscription: boolean;
  periodEnd: string | null;
  proposalsUsedThisMonth: number;
}) {
  const router = useRouter();
  const search = useSearchParams();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const status = search.get("billing");
    if (status === "success") {
      toast.success("Subscription activated. Welcome to Pro!");
      router.replace("/settings");
    } else if (status === "cancelled") {
      toast.info("Checkout cancelled. No charge was made.");
      router.replace("/settings");
    }
  }, [search, router]);

  async function startCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "PRO", interval: "monthly" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      window.location.href = data.url;
    } catch (err) {
      const m = err instanceof Error ? err.message : "Something went wrong";
      toast.error(m);
      setLoading(false);
    }
  }

  async function openPortal() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not open portal");
      window.location.href = data.url;
    } catch (err) {
      const m = err instanceof Error ? err.message : "Something went wrong";
      toast.error(m);
      setLoading(false);
    }
  }

  const isFree = plan === "FREE";
  const limit = 5;
  const overLimit = isFree && proposalsUsedThisMonth >= limit;

  return (
    <section className="rounded-2xl border border-foreground/10 bg-card p-6 space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-semibold">Plan & billing</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            You&apos;re on the {PLAN_LABEL[plan]} plan.
          </p>
        </div>
        <span
          className={`inline-block px-2.5 py-1 rounded-full text-[11px] border ${
            isFree
              ? "bg-foreground/[0.05] text-muted-foreground border-foreground/10"
              : "bg-mint/15 text-mint border-mint/30"
          }`}
        >
          {isFree ? "Free" : "Active"}
        </span>
      </div>

      {isFree && (
        <div className="rounded-xl border border-foreground/10 bg-foreground/[0.02] p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Proposals this month</span>
            <span className="font-medium">
              {proposalsUsedThisMonth} / {limit}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-foreground/[0.06] overflow-hidden">
            <div
              className={`h-full rounded-full ${overLimit ? "bg-red-400" : "bg-mint"}`}
              style={{
                width: `${Math.min(100, (proposalsUsedThisMonth / limit) * 100)}%`,
              }}
            />
          </div>
          {overLimit && (
            <p className="text-xs text-red-400">
              You&apos;ve hit the free-plan limit for this month. Upgrade for
              unlimited proposals.
            </p>
          )}
        </div>
      )}

      {!isFree && periodEnd && (
        <p className="text-xs text-muted-foreground">
          Renews on{" "}
          <span className="text-foreground font-medium">
            {new Date(periodEnd).toLocaleDateString(undefined, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          .
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        {isFree ? (
          <Button onClick={startCheckout} variant="primary" disabled={loading} className="group">
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Loading…
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Upgrade to Pro
                <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </Button>
        ) : (
          hasSubscription && (
            <Button onClick={openPortal} variant="secondary" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Opening…
                </>
              ) : (
                <>
                  <CreditCard className="size-4" />
                  Manage subscription
                </>
              )}
            </Button>
          )
        )}
      </div>

      {isFree && (
        <ul className="pt-4 border-t border-foreground/10 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
          {[
            "Unlimited proposals",
            "AI proposal drafting",
            "Smart follow-ups",
            "Stripe payment links",
          ].map((p) => (
            <li key={p} className="flex items-center gap-2">
              <Check className="size-3 text-mint" /> {p}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
