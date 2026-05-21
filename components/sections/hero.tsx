"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Play,
  CheckCircle2,
  FileText,
  Bot,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BotIcon } from "@/components/icons/bot-icon";

const stats = [
  { value: "14", label: "Days to build" },
  { value: "11+", label: "Features shipped" },
  { value: "0", label: "Mock data" },
];

export function Hero() {
  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
      <AnimatedBackground />

      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="mint" className="mb-6">
              <BotIcon className="size-4" />
              AI proposal engine · v2 is live
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] text-balance"
          >
            Create winning freelance{" "}
            <span className="relative inline-block">
              <span className="text-gradient">proposals</span>
              <svg
                aria-hidden
                viewBox="0 0 280 12"
                className="absolute -bottom-1 left-0 w-full"
              >
                <path
                  d="M2 9 Q70 1 140 6 T278 4"
                  stroke="url(#hero-underline)"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="hero-underline" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#20D6B5" />
                    <stop offset="100%" stopColor="#6FFFE9" />
                  </linearGradient>
                </defs>
              </svg>
            </span>{" "}
            in seconds.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed"
          >
            Proponiq is the AI proposal platform built for freelancers, agencies and
            consultants — draft, personalize, send, e-sign and track every deal from
            one beautiful workspace.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button asChild size="lg" variant="primary" className="group">
              <Link href="/login">
                Start free
                <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="group">
              <Link href="#product">
                <Play className="size-3.5 fill-current" />
                Watch demo
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground"
          >
            <CheckCircle2 className="size-3.5 text-mint" />
            No credit card · 14-day Pro trial · Cancel anytime
          </motion.div>
        </div>

        {/* Floating dashboard mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-16 md:mt-20 mx-auto max-w-6xl"
        >
          <HeroDashboardMockup />
          <FloatingProposalCard />
          <FloatingStatsCard />
          <FloatingAICard />
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 md:mt-24 grid grid-cols-3 max-w-2xl mx-auto gap-6 text-center"
        >
          {stats.map((s) => (
            <div key={s.label} className="space-y-1">
              <div className="font-display text-2xl md:text-3xl font-semibold tracking-tight">
                {s.value}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function AnimatedBackground() {
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Grid */}
      <div className="absolute inset-0 bg-grid-light dark:bg-grid-dark [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      {/* Mint orb */}
      <motion.div
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-1/2 -translate-x-1/2 size-[700px] rounded-full bg-mint/30 blur-[120px]"
      />
      {/* Deep blue accent */}
      <motion.div
        initial={{ opacity: 0.4 }}
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-[30%] -right-32 size-[500px] rounded-full bg-deep-blue/40 blur-[140px]"
      />
      {/* Cyan glow */}
      <motion.div
        initial={{ opacity: 0.3 }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-[10%] -left-32 size-[480px] rounded-full bg-cyan-glow/20 blur-[140px]"
      />
    </div>
  );
}

function HeroDashboardMockup() {
  return (
    <div className="relative rounded-2xl md:rounded-3xl overflow-hidden glass shadow-[0_50px_120px_-20px_rgba(7,27,52,0.35)] dark:shadow-[0_50px_120px_-20px_rgba(0,0,0,0.7)] glow-mint">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-foreground/10 bg-foreground/[0.02]">
        <div className="flex gap-1.5">
          <div className="size-3 rounded-full bg-red-400/70" />
          <div className="size-3 rounded-full bg-yellow-400/70" />
          <div className="size-3 rounded-full bg-green-400/70" />
        </div>
        <div className="mx-auto px-4 py-1 rounded-md text-xs text-muted-foreground bg-foreground/[0.04] border border-foreground/5">
          proponiq-ai.vercel.app / proposals
        </div>
      </div>

      <div className="grid grid-cols-12 min-h-[440px]">
        {/* Sidebar */}
        <aside className="hidden md:flex col-span-2 flex-col gap-1 p-4 border-r border-foreground/10 bg-foreground/[0.015]">
          {[
            { i: <FileText className="size-4" />, l: "Proposals", active: true },
            { i: <TrendingUp className="size-4" />, l: "Analytics" },
            { i: <Bot className="size-4" />, l: "AI assist" },
            { i: <Zap className="size-4" />, l: "Templates" },
          ].map((it) => (
            <div
              key={it.l}
              className={`flex items-center gap-2 px-3 py-2 text-xs rounded-lg ${
                it.active
                  ? "bg-mint/10 text-mint"
                  : "text-muted-foreground"
              }`}
            >
              {it.i}
              <span>{it.l}</span>
            </div>
          ))}
        </aside>

        {/* Main */}
        <div className="col-span-12 md:col-span-10 p-5 md:p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Pipeline</div>
              <div className="font-display text-lg font-semibold">Active proposals</div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-mint/10 text-mint border border-mint/20 text-xs">
              <BotIcon className="size-3.5" />
              AI Draft
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <KPI label="Win rate" value="67%" trend="+8.2%" />
            <KPI label="Proposals sent" value="124" trend="+22" />
            <KPI label="Revenue closed" value="$48.2k" trend="+12.4%" />
          </div>

          <div className="rounded-xl border border-foreground/10 bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-foreground/10">
              <span className="text-xs font-medium">Recent proposals</span>
              <span className="text-[10px] text-muted-foreground">This week</span>
            </div>
            {[
              { c: "Vortex Studios", t: "Brand redesign", a: "$8,500", s: "Signed" },
              { c: "Northwind Labs", t: "Mobile app MVP", a: "$24,000", s: "Viewed" },
              { c: "Halcyon Co.", t: "SEO retainer", a: "$3,200/mo", s: "Sent" },
            ].map((row) => (
              <div
                key={row.c}
                className="grid grid-cols-12 items-center gap-3 px-4 py-3 text-xs border-b last:border-b-0 border-foreground/5"
              >
                <div className="col-span-4 font-medium">{row.c}</div>
                <div className="col-span-4 text-muted-foreground">{row.t}</div>
                <div className="col-span-2">{row.a}</div>
                <div className="col-span-2 text-right">
                  <StatusPill status={row.s} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KPI({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <div className="rounded-xl border border-foreground/10 bg-card p-4">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 flex items-end justify-between">
        <div className="font-display text-2xl font-semibold tracking-tight">{value}</div>
        <span className="text-[10px] text-mint">{trend}</span>
      </div>
      <div className="mt-3 h-7 flex items-end gap-0.5">
        {[18, 24, 14, 30, 20, 36, 28, 42, 34, 48].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-gradient-to-t from-mint/30 to-mint"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    Signed: "bg-mint/15 text-mint border-mint/30",
    Viewed: "bg-amber-400/15 text-amber-500 border-amber-400/30",
    Sent: "bg-foreground/5 text-muted-foreground border-foreground/10",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full border text-[10px] ${map[status]}`}>
      {status}
    </span>
  );
}

function FloatingProposalCard() {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="hidden md:flex absolute -left-12 lg:-left-20 top-32 glass rounded-2xl p-4 w-64 gap-3 shadow-soft-dark"
    >
      <div className="size-10 rounded-xl bg-mint/15 text-mint flex items-center justify-center shrink-0">
        <CheckCircle2 className="size-5" />
      </div>
      <div className="text-xs">
        <div className="font-medium">Proposal signed</div>
        <div className="text-muted-foreground mt-0.5">
          Vortex Studios · $8,500
        </div>
        <div className="mt-2 flex items-center gap-1 text-mint text-[10px]">
          <span className="size-1.5 rounded-full bg-mint animate-pulse" />
          Just now
        </div>
      </div>
    </motion.div>
  );
}

function FloatingStatsCard() {
  return (
    <motion.div
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      className="hidden md:flex absolute -right-8 lg:-right-16 top-44 glass rounded-2xl p-4 w-60 flex-col gap-2 shadow-soft-dark"
    >
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Win rate this month</span>
        <span className="text-mint font-medium">+8.2%</span>
      </div>
      <div className="font-display text-2xl font-semibold tracking-tight">67%</div>
      <div className="flex items-end gap-1 h-12">
        {[40, 55, 38, 70, 58, 82, 90].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-gradient-to-t from-mint/20 to-mint"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function FloatingAICard() {
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      className="hidden lg:flex absolute -bottom-8 left-1/4 glass rounded-2xl p-4 w-72 flex-col gap-2 shadow-soft-dark"
    >
      <div className="flex items-center gap-2 text-xs">
        <div className="size-6 rounded-md bg-gradient-to-br from-mint to-cyan-glow text-navy flex items-center justify-center overflow-hidden">
          <BotIcon className="size-5" />
        </div>
        <span className="font-medium">AI Assistant</span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">
        I&apos;ve drafted a 3-page proposal for Vortex Studios using your brand voice
        and last quarter&apos;s pricing. Ready to review?
      </p>
      <button className="self-start mt-1 text-[11px] text-mint hover:text-cyan-glow transition">
        Open draft →
      </button>
    </motion.div>
  );
}
