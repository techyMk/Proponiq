"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Section, SectionHeader } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type PlanKey = "FREE" | "PRO" | "AGENCY";

type Plan = {
  key: PlanKey;
  name: string;
  description: string;
  monthly: number;
  yearly: number;
  features: string[];
  cta: string;
  featured?: boolean;
};

const plans: Plan[] = [
  {
    key: "FREE",
    name: "Starter",
    description: "Everything a solo freelancer needs to send pro-grade proposals.",
    monthly: 0,
    yearly: 0,
    features: [
      "Up to 5 proposals / month",
      "10 premium templates",
      "Branded PDF export",
      "E-signature (1 user)",
      "Email tracking",
    ],
    cta: "Start free",
  },
  {
    key: "PRO",
    name: "Pro",
    description: "For serious independents who close deals every week.",
    monthly: 24,
    yearly: 19,
    features: [
      "Unlimited proposals",
      "AI proposal generation",
      "60+ premium templates",
      "Advanced analytics & tracking",
      "Smart follow-ups",
      "Stripe payment links",
      "Priority support",
    ],
    cta: "Start 14-day trial",
    featured: true,
  },
  {
    key: "AGENCY",
    name: "Agency",
    description: "Multi-seat workspaces, CRM sync and team-level analytics.",
    monthly: 79,
    yearly: 64,
    features: [
      "Everything in Pro",
      "Up to 10 seats",
      "Team brand voice + AI memory",
      "CRM integrations (HubSpot, Pipedrive)",
      "White-label proposals",
      "Approval workflows",
      "Dedicated success manager",
    ],
    cta: "Talk to sales",
  },
];

export function Pricing() {
  const [yearly, setYearly] = React.useState(true);

  return (
    <Section id="pricing" className="relative">
      <SectionHeader
        eyebrow="Simple, honest pricing"
        title={
          <>
            Plans that pay for themselves{" "}
            <span className="text-gradient">in a single proposal.</span>
          </>
        }
        description="Try every Pro feature free for 14 days. No credit card. Cancel anytime."
      />

      <div className="flex items-center justify-center mb-12">
        <div className="inline-flex items-center gap-1 p-1 rounded-full border border-foreground/10 bg-card">
          <button
            onClick={() => setYearly(false)}
            className={`relative px-4 py-1.5 text-xs rounded-full transition ${
              !yearly ? "bg-mint text-navy" : "text-muted-foreground"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setYearly(true)}
            className={`relative px-4 py-1.5 text-xs rounded-full transition ${
              yearly ? "bg-mint text-navy" : "text-muted-foreground"
            }`}
          >
            Yearly
            <span className="ml-1.5 inline-block px-1.5 py-0.5 rounded-full bg-navy/20 text-[9px]">
              -20%
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 items-stretch">
        {plans.map((plan, i) => (
          <PricingCard key={plan.name} plan={plan} yearly={yearly} delay={i * 0.08} />
        ))}
      </div>

      <p className="mt-10 text-center text-xs text-muted-foreground">
        All plans include unlimited clients, secure cloud storage and end-to-end
        encryption.
      </p>
    </Section>
  );
}

function PricingCard({
  plan,
  yearly,
  delay,
}: {
  plan: Plan;
  yearly: boolean;
  delay: number;
}) {
  const price = yearly ? plan.yearly : plan.monthly;
  const [loading, setLoading] = React.useState(false);

  async function onCta() {
    if (plan.key === "FREE") {
      window.location.href = "/login";
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: plan.key,
          interval: yearly ? "yearly" : "monthly",
        }),
      });

      if (res.status === 401) {
        // not signed in — send to login then back to pricing
        window.location.href = "/login?from=/#pricing";
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        // 503 → billing not configured: fall back to sign-up
        if (res.status === 503) {
          toast.message("Billing is in setup — sending you to sign up instead.");
          window.location.href = "/login";
          return;
        }
        throw new Error(data.error || "Could not start checkout");
      }
      window.location.href = data.url;
    } catch (err) {
      const m = err instanceof Error ? err.message : "Something went wrong";
      toast.error(m);
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className={`relative rounded-2xl overflow-hidden flex flex-col p-6 md:p-7 ${
        plan.featured
          ? "border-2 border-mint/50 bg-gradient-to-b from-mint/[0.08] to-transparent shadow-[0_30px_80px_-20px_rgba(32,214,181,0.35)] md:scale-[1.03]"
          : "border border-foreground/10 bg-card"
      }`}
    >
      {plan.featured && (
        <>
          <div aria-hidden className="absolute -top-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-mint to-transparent" />
          <Badge variant="mint" className="absolute top-5 right-5">
            <Sparkles className="size-3" />
            Most popular
          </Badge>
        </>
      )}

      <div>
        <h3 className="font-display text-xl font-semibold tracking-tight">
          {plan.name}
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground">{plan.description}</p>
      </div>

      <div className="mt-6 flex items-baseline gap-1">
        <span className="font-display text-5xl font-semibold tracking-tight">
          ${price}
        </span>
        <span className="text-sm text-muted-foreground">/ month</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {yearly && price > 0 ? "Billed annually" : price === 0 ? "Forever free" : "Billed monthly"}
      </p>

      <ul className="mt-6 space-y-2.5 text-sm flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <span
              className={`inline-flex size-5 items-center justify-center rounded-full shrink-0 mt-0.5 ${
                plan.featured ? "bg-mint text-navy" : "bg-mint/10 text-mint"
              }`}
            >
              <Check className="size-3" strokeWidth={3} />
            </span>
            <span className="text-foreground/90">{f}</span>
          </li>
        ))}
      </ul>

      {plan.key === "AGENCY" ? (
        <Button
          asChild
          variant={plan.featured ? "primary" : "secondary"}
          size="lg"
          className="mt-8 w-full group"
        >
          <Link href="mailto:hello@proponiq.com?subject=Agency%20plan%20enquiry">
            {plan.cta}
            <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onCta}
          disabled={loading}
          variant={plan.featured ? "primary" : "secondary"}
          size="lg"
          className="mt-8 w-full group"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Loading…
            </>
          ) : (
            <>
              {plan.cta}
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </Button>
      )}
    </motion.div>
  );
}
