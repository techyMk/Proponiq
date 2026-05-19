"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  LayoutTemplate,
  UserSquare,
  DollarSign,
  FileDown,
  BarChart3,
  Send,
  Signature,
  PlugZap,
} from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";

type Feature = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: Sparkles,
    title: "AI proposal generation",
    description:
      "Generate scoped, on-brand proposals in seconds. Tone, pricing and structure tuned to each prospect.",
  },
  {
    icon: LayoutTemplate,
    title: "Beautiful templates",
    description:
      "60+ premium templates spanning design, dev, marketing, consulting and more — fully customizable.",
  },
  {
    icon: UserSquare,
    title: "Client personalization",
    description:
      "Auto-pulls client context, logos and signals so every proposal feels tailored, not templated.",
  },
  {
    icon: DollarSign,
    title: "Pricing automation",
    description:
      "Dynamic pricing tables, tiered packages, discounts and recurring retainers — done in one click.",
  },
  {
    icon: FileDown,
    title: "One-click PDF export",
    description:
      "Polished, print-ready PDFs with your branding, embedded fonts and crisp typography.",
  },
  {
    icon: BarChart3,
    title: "Analytics & tracking",
    description:
      "See when proposals are opened, read, and shared. Pinpoint exactly where prospects drop off.",
  },
  {
    icon: Send,
    title: "Smart follow-ups",
    description:
      "Behaviorally-triggered nudges that get replies — without sounding like spam.",
  },
  {
    icon: Signature,
    title: "Legally-binding e-signature",
    description:
      "Built-in e-signatures with audit trail. No more chasing PDFs across email threads.",
  },
  {
    icon: PlugZap,
    title: "CRM & tool integrations",
    description:
      "Native sync with HubSpot, Pipedrive, Notion, Slack, Stripe and 30+ more.",
  },
];

export function Features() {
  return (
    <Section id="features" className="relative">
      <BackgroundAccent />
      <SectionHeader
        eyebrow="Everything you need"
        title={
          <>
            One workspace.{" "}
            <span className="text-gradient">Every part of the proposal flow.</span>
          </>
        }
        description="From the first AI draft to a signed contract, Proponiq replaces a stack of disjointed tools with a single, beautiful, focused workspace."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {features.map((f, i) => (
          <FeatureCard key={f.title} feature={f} index={i} />
        ))}
      </div>
    </Section>
  );
}

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const Icon = feature.icon;
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative rounded-2xl border border-foreground/10 bg-card p-6 md:p-7 overflow-hidden transition-all duration-300 hover:border-mint/40 hover:shadow-glow-sm hover:-translate-y-1"
    >
      {/* Hover gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-mint/0 via-mint/0 to-mint/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative">
        <div className="relative inline-flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-mint/15 to-cyan-glow/10 border border-mint/20 text-mint group-hover:scale-105 transition-transform">
          <Icon className="size-5" />
          <div className="absolute -inset-1 rounded-xl bg-mint/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <h3 className="mt-5 font-display text-lg font-semibold tracking-tight">
          {feature.title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {feature.description}
        </p>
      </div>
    </motion.article>
  );
}

function BackgroundAccent() {
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute left-1/2 top-0 -translate-x-1/2 size-[600px] rounded-full bg-mint/10 blur-[140px] opacity-50" />
    </div>
  );
}
