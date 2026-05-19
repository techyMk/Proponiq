"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import {
  Clock,
  Trophy,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";

const benefits = [
  {
    icon: Clock,
    title: "Save 6+ hours every week",
    description:
      "AI drafts, smart templates and auto-pricing replace the slowest, most repetitive parts of every proposal.",
    metric: { value: 6, suffix: "h", label: "Saved weekly" },
  },
  {
    icon: Trophy,
    title: "Close more clients",
    description:
      "Polished, personalized proposals delivered fast outperform generic decks every time.",
    metric: { value: 38, suffix: "%", label: "More closes" },
  },
  {
    icon: Sparkles,
    title: "Look like a $10M agency",
    description:
      "Premium templates, branded PDFs and beautiful e-signature flows make solo freelancers feel like a studio.",
    metric: { value: 60, suffix: "+", label: "Premium templates" },
  },
  {
    icon: TrendingUp,
    title: "Boost acceptance rate",
    description:
      "Built-in tracking, follow-ups and AI-driven nudges keep proposals warm until they sign.",
    metric: { value: 67, suffix: "%", label: "Avg. win rate" },
  },
  {
    icon: Zap,
    title: "Automate the boring",
    description:
      "Stop copy-pasting. Stop reformatting PDFs. Stop chasing signatures. Proponiq does the busywork.",
    metric: { value: 22, suffix: "k", label: "Hours automated" },
  },
];

export function Benefits() {
  return (
    <Section className="relative">
      <SectionHeader
        eyebrow="Built for freelancers"
        title={
          <>
            Less admin.{" "}
            <span className="text-gradient">More signed deals.</span>
          </>
        }
        description="Proponiq removes the unglamorous, hours-eating parts of running a service business so you can focus on what clients actually pay for."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {/* Large hero benefit */}
        <BenefitCard b={benefits[0]} variant="large" />

        {/* Two stacked on the right */}
        <div className="grid grid-cols-1 gap-4 md:gap-5">
          <BenefitCard b={benefits[1]} />
          <BenefitCard b={benefits[2]} />
        </div>
        <div className="grid grid-cols-1 gap-4 md:gap-5">
          <BenefitCard b={benefits[3]} />
          <BenefitCard b={benefits[4]} />
        </div>
      </div>
    </Section>
  );
}

function BenefitCard({
  b,
  variant,
}: {
  b: (typeof benefits)[number];
  variant?: "large";
}) {
  const Icon = b.icon;
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className={`group relative rounded-2xl border border-foreground/10 bg-card overflow-hidden transition-all duration-300 hover:border-mint/30 hover:shadow-glow-sm ${
        variant === "large" ? "p-7 md:row-span-2 md:p-8" : "p-6"
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-mint/0 to-mint/[0.04] opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative flex flex-col h-full">
        <div className="inline-flex size-11 items-center justify-center rounded-xl bg-mint/10 text-mint border border-mint/20">
          <Icon className="size-5" />
        </div>
        <h3
          className={`mt-4 font-display font-semibold tracking-tight ${
            variant === "large" ? "text-2xl" : "text-lg"
          }`}
        >
          {b.title}
        </h3>
        <p
          className={`mt-2 text-muted-foreground leading-relaxed ${
            variant === "large" ? "text-base" : "text-sm"
          }`}
        >
          {b.description}
        </p>
        {b.metric && (
          <div className="mt-auto pt-6">
            <div className="flex items-baseline gap-2">
              <Counter
                target={b.metric.value}
                suffix={b.metric.suffix}
                active={inView}
                large={variant === "large"}
              />
              <span className="text-xs text-muted-foreground">{b.metric.label}</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function Counter({
  target,
  suffix,
  active,
  large,
}: {
  target: number;
  suffix: string;
  active: boolean;
  large?: boolean;
}) {
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    if (!active) return;
    const duration = 1400;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target]);

  return (
    <span
      className={`font-display font-semibold tracking-tight text-gradient ${
        large ? "text-5xl md:text-6xl" : "text-3xl"
      }`}
    >
      {value}
      {suffix}
    </span>
  );
}
