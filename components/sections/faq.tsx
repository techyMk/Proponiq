"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";

const faqs = [
  {
    q: "How is Proponiq different from a tool like PandaDoc or DocuSign?",
    a: "Proponiq is purpose-built for service businesses — freelancers, agencies and consultants — not enterprise contracts. That means AI drafting trained on great proposals, a beautiful proposal-first editor, smart follow-ups, and pricing that doesn't punish independents.",
  },
  {
    q: "Do I need to know anything technical to set this up?",
    a: "Not a thing. Sign in, pick a template, drop in your brand colors and logo, and you're sending proposals in under 5 minutes. We import from PDFs, Google Docs and Notion if you want to start from existing work.",
  },
  {
    q: "Is the AI actually any good — or is it generic placeholder text?",
    a: "We train per-account on your own proposals, brand voice and pricing history. After 2-3 proposals, the AI sounds noticeably more like you than it does the model out of the box. You can also tone-shift, expand and tighten any section with a single click.",
  },
  {
    q: "Can clients sign proposals directly inside Proponiq?",
    a: "Yes — every plan includes legally-binding e-signature with a full audit trail. Clients can sign on desktop or mobile in under 30 seconds, no account required.",
  },
  {
    q: "Will it work with the tools I already use?",
    a: "Proponiq syncs natively with HubSpot, Pipedrive, Notion, Slack, Stripe, Google Calendar, and 30+ more. We also expose a clean API and Zapier integration if you want to wire up something custom.",
  },
  {
    q: "What happens if I cancel?",
    a: "Your data is yours. Cancel anytime — you keep read-only access to every proposal, and you can export the entire workspace as PDFs and JSON in one click. No lock-in, no drama.",
  },
];

export function FAQ() {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <Section id="faq" className="relative">
      <SectionHeader
        eyebrow="FAQ"
        title={
          <>
            Got questions? <span className="text-gradient">We&apos;ve got answers.</span>
          </>
        }
        description="If you don't see your question here, drop us a note — we usually reply within an hour."
      />

      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <motion.div
              key={f.q}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className={`rounded-2xl border bg-card overflow-hidden transition-colors ${
                isOpen ? "border-mint/30" : "border-foreground/10"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-4 px-5 md:px-6 py-5 text-left"
              >
                <span className="font-display text-sm md:text-base font-semibold tracking-tight">
                  {f.q}
                </span>
                <span
                  className={`inline-flex size-8 items-center justify-center rounded-full bg-foreground/[0.04] shrink-0 transition-transform ${
                    isOpen ? "rotate-45 bg-mint text-navy" : ""
                  }`}
                >
                  <Plus className="size-4" />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 md:px-6 pb-5 text-sm text-muted-foreground leading-relaxed">
                      {f.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
