"use client";

import { motion } from "framer-motion";

const logos = [
  "Northwind",
  "Vortex",
  "Halcyon",
  "Loomflux",
  "Atlas Forge",
  "Sublyne",
  "Quartz Labs",
  "Riverpoint",
  "Helix",
  "Outwave",
];

export function TrustedBy() {
  return (
    <section
      aria-label="Trusted by teams"
      className="relative py-14 md:py-20 border-y border-foreground/5 bg-foreground/[0.015]"
    >
      <div className="container">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-[11px] uppercase tracking-[0.25em] text-muted-foreground"
        >
          Trusted by 12,000+ independent professionals & teams
        </motion.p>

        <div className="relative mt-8 overflow-hidden mask-fade-x">
          <div className="flex gap-12 md:gap-16 animate-marquee w-max">
            {[...logos, ...logos].map((name, i) => (
              <FauxLogo key={i} name={name} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FauxLogo({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-300">
      <svg
        viewBox="0 0 24 24"
        className="size-5 text-foreground"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M5 12h14M12 5v14" />
      </svg>
      <span className="font-display text-lg md:text-xl font-semibold tracking-tight text-foreground/80">
        {name}
      </span>
    </div>
  );
}
