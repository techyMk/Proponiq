"use client";

import { motion } from "framer-motion";

// Real tech stack — battle-tested tools the product is actually built with.
// Logos served by simple-icons.org CDN (free, no auth, no rate limits worth
// worrying about for a portfolio).
const TECH: { slug?: string; name: string }[] = [
  { slug: "nextdotjs", name: "Next.js" },
  { slug: "react", name: "React" },
  { slug: "typescript", name: "TypeScript" },
  { slug: "tailwindcss", name: "Tailwind CSS" },
  { slug: "prisma", name: "Prisma" },
  { slug: "postgresql", name: "Postgres" },
  { slug: "stripe", name: "Stripe" },
  { slug: "tiptap", name: "Tiptap" },
  { slug: "resend", name: "Resend" },
  { slug: "vercel", name: "Vercel" },
  { slug: undefined, name: "Groq" },
  { slug: undefined, name: "Auth.js" },
];

export function TrustedBy() {
  return (
    <section
      aria-label="Tech stack"
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
          Built with a modern, battle-tested stack
        </motion.p>

        <div className="relative mt-8 overflow-hidden mask-fade-x">
          <div className="flex gap-12 md:gap-16 animate-marquee w-max">
            {[...TECH, ...TECH].map((t, i) => (
              <TechBadge key={`${t.name}-${i}`} slug={t.slug} name={t.name} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TechBadge({ slug, name }: { slug?: string; name: string }) {
  return (
    <div className="flex items-center gap-2.5 shrink-0 opacity-70 hover:opacity-100 transition-opacity duration-300">
      {slug ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://cdn.simpleicons.org/${slug}/5C6B82`}
            alt=""
            width={20}
            height={20}
            className="size-5 block dark:hidden"
            loading="lazy"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://cdn.simpleicons.org/${slug}/D6E2F0`}
            alt=""
            width={20}
            height={20}
            className="size-5 hidden dark:block"
            loading="lazy"
          />
        </>
      ) : (
        <span
          aria-hidden
          className="size-5 rounded-sm bg-gradient-to-br from-mint/30 to-cyan-glow/20 inline-flex items-center justify-center text-[10px] font-bold text-mint"
        >
          {name[0]}
        </span>
      )}
      <span className="font-display text-base md:text-lg font-semibold tracking-tight text-foreground/80">
        {name}
      </span>
    </div>
  );
}
