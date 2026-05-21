"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Github, ArrowUpRight, Quote } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";

export function Testimonials() {
  return (
    <Section id="testimonials" className="relative">
      <BgAccent />

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <Badge variant="mint" className="mb-5">
            <span className="size-1.5 rounded-full bg-mint animate-pulse-glow" />
            Why I built this
          </Badge>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-balance">
            A portfolio project that&apos;s actually{" "}
            <span className="text-gradient">a working product.</span>
          </h2>
        </motion.div>

        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative rounded-3xl border border-mint/20 bg-gradient-to-br from-mint/[0.05] via-card to-card p-8 md:p-12 overflow-hidden"
        >
          <Quote
            aria-hidden
            className="absolute -top-4 -right-4 size-24 text-mint/10 rotate-12"
          />

          <blockquote className="relative space-y-5 text-base md:text-lg leading-relaxed text-balance">
            <p>
              Proponiq started as a stress test for myself: build a complete SaaS,
              end-to-end, in one week. Not a clone with mock data — a real product
              where every button works, every flow ships, and every claim on this
              page is something you can try right now.
            </p>
            <p>
              It was also an excuse to play with stacks I love. Groq for instant
              AI. Tiptap for the editor. React-PDF for branded exports.
              Stripe and Resend wired up properly. The fun parts — the inline AI
              assistant, the live signature with audit log, the custom
              branding — ended up being the hardest, which is usually how it goes.
            </p>
            <p className="text-muted-foreground text-[15px]">
              Proponiq isn&apos;t a live company. There&apos;s no real user base,
              no paying customers, no team. It&apos;s one builder, seven days,
              and the entire surface area of a working SaaS — auth, AI, payments,
              signatures, PDFs, email, custom branding. If you&apos;re hiring
              or curious, the code&apos;s on GitHub.
            </p>
          </blockquote>

          <figcaption className="relative mt-8 pt-6 border-t border-foreground/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-full bg-gradient-to-br from-deep-blue to-mint flex items-center justify-center font-semibold text-white">
                M
              </div>
              <div>
                <div className="font-display text-base font-semibold">
                  Manikandan
                </div>
                <div className="text-xs text-muted-foreground">
                  Designer &amp; developer · techyMk
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="https://github.com/techyMk/Proponiq"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 h-9 rounded-full text-xs text-muted-foreground hover:text-foreground border border-foreground/10 hover:border-foreground/25 hover:bg-foreground/5 transition"
              >
                <Github className="size-3.5" />
                View source
              </Link>
              <Link
                href="https://techymk.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 h-9 rounded-full text-xs bg-mint text-navy hover:bg-cyan-glow transition"
              >
                Portfolio
                <ArrowUpRight className="size-3.5" />
              </Link>
            </div>
          </figcaption>
        </motion.figure>
      </div>
    </Section>
  );
}

function BgAccent() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none overflow-hidden"
    >
      <div className="absolute right-0 top-1/3 size-[500px] rounded-full bg-mint/8 blur-[140px] opacity-50" />
    </div>
  );
}
