"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star, Quote } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  avatar: string;
  highlight?: boolean;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "Proponiq cut my proposal time from 4 hours to under 12 minutes. I signed two retainers in the first week — the ROI is honestly absurd.",
    name: "Amara Khan",
    role: "Brand designer · Solo studio",
    avatar: "https://i.pravatar.cc/200?img=47",
    highlight: true,
  },
  {
    quote:
      "We replaced PandaDoc, Notion templates and three Zapier hacks with a single Proponiq workspace. Our acceptance rate jumped 31%.",
    name: "Daniel Okafor",
    role: "Founder · Northwind Labs",
    avatar: "https://i.pravatar.cc/200?img=12",
  },
  {
    quote:
      "The AI doesn't just generate text — it learns our voice. New hires send proposals that read exactly like our senior partners.",
    name: "Priya Mehta",
    role: "COO · Halcyon Consulting",
    avatar: "https://i.pravatar.cc/200?img=32",
  },
  {
    quote:
      "Beautiful, fast, and ridiculously thoughtful. Every detail has been considered — and clients notice the difference immediately.",
    name: "Marcus Lee",
    role: "Independent dev consultant",
    avatar: "https://i.pravatar.cc/200?img=15",
  },
  {
    quote:
      "Open tracking told us a client opened the proposal 11 times before signing — Proponiq turned a guess into a science.",
    name: "Sofía Rivera",
    role: "Agency lead · Loomflux",
    avatar: "https://i.pravatar.cc/200?img=45",
  },
  {
    quote:
      "It feels like the proposal tool we've all been waiting for. Modern, polished, fast — clearly built by people who get the freelance grind.",
    name: "Henry Walsh",
    role: "Fractional CTO",
    avatar: "https://i.pravatar.cc/200?img=8",
  },
];

export function Testimonials() {
  return (
    <Section id="testimonials" className="relative">
      <BgAccent />
      <SectionHeader
        eyebrow="Loved by independents"
        title={
          <>
            The first proposal tool{" "}
            <span className="text-gradient">freelancers actually rave about.</span>
          </>
        }
        description="From solo brand designers to 30-person agencies — Proponiq users are closing more deals, faster."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {testimonials.map((t, i) => (
          <motion.figure
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className={`relative rounded-2xl border p-6 md:p-7 overflow-hidden flex flex-col ${
              t.highlight
                ? "border-mint/40 bg-gradient-to-br from-mint/[0.08] to-cyan-glow/[0.04] shadow-glow-sm"
                : "border-foreground/10 bg-card"
            }`}
          >
            {t.highlight && (
              <Quote className="absolute -top-2 -right-2 size-16 text-mint/10 rotate-12" />
            )}
            <div className="flex items-center gap-1 text-mint">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star key={idx} className="size-3.5 fill-current" />
              ))}
            </div>
            <blockquote
              className={`mt-4 leading-relaxed text-balance ${
                t.highlight ? "text-base md:text-lg font-medium" : "text-sm"
              }`}
            >
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-auto pt-6 flex items-center gap-3">
              <Image
                src={t.avatar}
                alt={t.name}
                width={40}
                height={40}
                className="size-10 rounded-full object-cover ring-2 ring-mint/30"
              />
              <div>
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </Section>
  );
}

function BgAccent() {
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute right-0 top-1/3 size-[500px] rounded-full bg-mint/8 blur-[140px] opacity-50" />
    </div>
  );
}
