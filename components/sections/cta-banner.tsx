"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTABanner() {
  return (
    <section id="cta" className="relative py-24 md:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-mint/20 bg-gradient-to-br from-deep-blue/90 via-navy to-navy text-neutral-text px-8 py-16 md:px-16 md:py-24 text-center"
        >
          {/* Glow & mesh */}
          <div aria-hidden className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-mint/30 blur-[160px]" />
            <div className="absolute -bottom-40 right-0 size-[420px] rounded-full bg-cyan-glow/15 blur-[140px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_30%,_rgba(7,27,52,0.6))]" />
            <svg
              className="absolute inset-0 w-full h-full opacity-[0.04]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="gridc" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M40 0L0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#gridc)" />
            </svg>
          </div>

          <div className="relative max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-mint/15 text-mint border border-mint/30">
              <Sparkles className="size-3.5" />
              Start winning more clients this week
            </div>
            <h2 className="mt-6 font-display text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05] text-balance">
              Ready to send a proposal{" "}
              <span className="text-gradient">they can&apos;t say no to?</span>
            </h2>
            <p className="mt-5 text-base md:text-lg text-neutral-text/70 max-w-xl mx-auto text-balance">
              A working AI proposal platform — built end-to-end for freelancers,
              agencies and consultants. Sign in with Google and try every feature
              free.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild variant="primary" size="xl" className="group">
                <Link href="/login">
                  Start free trial
                  <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="xl"
                className="border-white/15 text-white hover:bg-white/5"
              >
                <Link href="#product">Book a 15-min demo</Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-neutral-text/60">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-mint" />
                No credit card required
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-mint" />
                Cancel anytime
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-mint" />
                Setup in under 5 minutes
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
