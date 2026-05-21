"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  TrendingUp,
  Users,
  Inbox,
  Bot,
  Search,
  Bell,
  Plus,
  CheckCircle2,
  Eye,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";
import { BotIcon } from "@/components/icons/bot-icon";

type TabKey = "editor" | "analytics" | "pipeline" | "ai";

const tabs: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "editor", label: "Proposal editor", icon: FileText },
  { key: "analytics", label: "Win-rate analytics", icon: TrendingUp },
  { key: "pipeline", label: "Client pipeline", icon: Users },
  { key: "ai", label: "AI assistant", icon: Bot },
];

export function DashboardPreview() {
  const [active, setActive] = React.useState<TabKey>("editor");

  return (
    <Section id="product" className="relative">
      <SectionHeader
        eyebrow="A look inside"
        title={
          <>
            The workspace prospects{" "}
            <span className="text-gradient">never want to leave.</span>
          </>
        }
        description="Drafting, sending, signing and tracking — all in one calm, fast, beautifully-designed interface."
      />

      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm transition ${
                isActive
                  ? "text-navy bg-mint"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              <Icon className="size-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      <motion.div
        key={active}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative rounded-2xl md:rounded-3xl overflow-hidden glass shadow-[0_30px_80px_-20px_rgba(7,27,52,0.35)] dark:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
      >
        <AppShell>
          {active === "editor" && <EditorView />}
          {active === "analytics" && <AnalyticsView />}
          {active === "pipeline" && <PipelineView />}
          {active === "ai" && <AIView />}
        </AppShell>
      </motion.div>
    </Section>
  );
}

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-12 min-h-[560px]">
      <aside className="hidden md:flex col-span-2 flex-col gap-1 p-4 border-r border-foreground/10 bg-foreground/[0.015]">
        <div className="flex items-center gap-2 px-2 py-2 mb-3">
          <div className="size-7 rounded-md bg-gradient-to-br from-mint to-cyan-glow" />
          <span className="font-display text-sm font-bold">proponiq</span>
        </div>
        {[
          { i: Inbox, l: "Inbox", c: 4 },
          { i: FileText, l: "Proposals", active: true, c: 12 },
          { i: Users, l: "Clients" },
          { i: TrendingUp, l: "Analytics" },
          { i: Bot, l: "AI Assist" },
        ].map((it) => {
          const Icon = it.i;
          return (
            <div
              key={it.l}
              className={`flex items-center justify-between px-3 py-2 text-xs rounded-lg ${
                it.active ? "bg-mint/10 text-mint" : "text-muted-foreground hover:bg-foreground/5"
              }`}
            >
              <span className="flex items-center gap-2">
                <Icon className="size-4" />
                {it.l}
              </span>
              {it.c && <span className="text-[10px] opacity-70">{it.c}</span>}
            </div>
          );
        })}
      </aside>

      <div className="col-span-12 md:col-span-10 flex flex-col">
        <div className="flex items-center justify-between gap-3 px-4 md:px-6 py-3 border-b border-foreground/10 bg-foreground/[0.015]">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Search className="size-3.5" />
            <span>Search proposals, clients, templates…</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center justify-center size-8 rounded-full hover:bg-foreground/5 text-muted-foreground">
              <Bell className="size-4" />
            </button>
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-mint text-navy rounded-full">
              <Plus className="size-3" />
              New
            </button>
            <div className="size-8 rounded-full bg-gradient-to-br from-deep-blue to-mint" />
          </div>
        </div>
        <div className="flex-1 p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}

function EditorView() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-5 h-full">
      <div className="col-span-12 md:col-span-8 rounded-xl border border-foreground/10 bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-foreground/10 flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">Proposal · Draft</div>
            <div className="text-sm font-semibold">Vortex Studios · Brand redesign</div>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-full bg-mint/10 text-mint">
            <BotIcon className="size-3" />
            AI generated
          </span>
        </div>
        <div className="p-5 md:p-7 space-y-4 text-sm leading-relaxed">
          <p className="font-display text-2xl font-semibold tracking-tight">
            Helping <span className="text-mint">Vortex Studios</span> ship a brand the
            next generation of clients will recognize.
          </p>
          <p className="text-muted-foreground">
            We&apos;ll deliver a complete identity refresh in three focused phases —
            research, system design, and rollout — built around your existing audience
            insights and a tighter visual language.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { p: "Phase 1", t: "Discovery" },
              { p: "Phase 2", t: "Identity system" },
              { p: "Phase 3", t: "Rollout & training" },
            ].map((p) => (
              <div key={p.p} className="rounded-lg border border-foreground/10 p-3">
                <div className="text-[10px] text-muted-foreground">{p.p}</div>
                <div className="text-xs font-medium mt-0.5">{p.t}</div>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground text-xs">
            Investment · <span className="text-foreground font-semibold">$8,500</span>
            <span className="mx-2 opacity-30">|</span>
            Timeline · <span className="text-foreground font-semibold">6 weeks</span>
          </p>
        </div>
      </div>

      <div className="col-span-12 md:col-span-4 space-y-3">
        <div className="rounded-xl border border-mint/30 bg-gradient-to-br from-mint/10 to-transparent p-4">
          <div className="flex items-center gap-2 text-xs">
            <BotIcon className="size-4" />
            <span className="font-semibold">AI suggestions</span>
          </div>
          <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
            {[
              "Tighten the opening — remove 24 filler words",
              "Add a 2-month retainer option ($1,200/mo)",
              "Reference Vortex's Q2 audit findings",
            ].map((s) => (
              <li key={s} className="flex gap-2">
                <ChevronRight className="size-3 text-mint mt-0.5 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-foreground/10 bg-card p-4">
          <div className="text-xs font-semibold mb-2">Sections</div>
          <ul className="space-y-1 text-xs">
            {["Cover", "Approach", "Scope", "Timeline", "Pricing", "Sign-off"].map((s) => (
              <li key={s} className="flex items-center justify-between text-muted-foreground hover:text-foreground">
                <span>{s}</span>
                <CheckCircle2 className="size-3 text-mint" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function AnalyticsView() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-5">
      <div className="col-span-12 md:col-span-8 rounded-xl border border-foreground/10 bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs text-muted-foreground">Win rate over time</div>
            <div className="font-display text-2xl font-semibold tracking-tight">67%</div>
          </div>
          <div className="flex items-center gap-1.5 text-mint text-xs">
            <TrendingUp className="size-3.5" /> +8.2% vs. last month
          </div>
        </div>
        <ChartLine />
      </div>
      <div className="col-span-12 md:col-span-4 grid grid-cols-1 gap-4">
        {[
          { l: "Proposals sent", v: "124", t: "+22" },
          { l: "Avg. value", v: "$6,420", t: "+11%" },
          { l: "Time to close", v: "5.2 days", t: "-1.8d" },
        ].map((k) => (
          <div key={k.l} className="rounded-xl border border-foreground/10 bg-card p-4">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{k.l}</div>
            <div className="font-display text-2xl font-semibold tracking-tight mt-1">{k.v}</div>
            <div className="text-[10px] text-mint mt-1">{k.t}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartLine() {
  const points = [
    [0, 70],
    [10, 60],
    [22, 55],
    [35, 48],
    [48, 52],
    [60, 35],
    [72, 38],
    [84, 22],
    [96, 28],
    [100, 18],
  ];
  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`)
    .join(" ");
  const dArea = `${d} L 100 100 L 0 100 Z`;
  return (
    <svg viewBox="0 0 100 100" className="w-full h-48" preserveAspectRatio="none">
      <defs>
        <linearGradient id="cl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#20D6B5" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#20D6B5" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={dArea} fill="url(#cl)" />
      <path d={d} fill="none" stroke="#20D6B5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="1" fill="#6FFFE9" />
      ))}
    </svg>
  );
}

function PipelineView() {
  const cols = [
    { t: "Drafting", c: ["Vortex · Brand", "Halcyon · SEO retainer"], color: "from-blue-500/15 to-blue-500/5" },
    { t: "Sent", c: ["Northwind · App MVP", "Sublyne · Web app"], color: "from-amber-400/15 to-amber-400/5" },
    { t: "Viewed", c: ["Atlas Forge · Microsite", "Helix · Strategy"], color: "from-orange-400/15 to-orange-400/5" },
    { t: "Signed", c: ["Loomflux · Q4 retainer", "Quartz · Audit"], color: "from-mint/15 to-mint/5" },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 h-full">
      {cols.map((c) => (
        <div key={c.t} className="rounded-xl border border-foreground/10 bg-card p-3 flex flex-col gap-2">
          <div className="text-xs font-semibold flex items-center justify-between">
            {c.t}
            <span className="text-[10px] text-muted-foreground">{c.c.length}</span>
          </div>
          {c.c.map((card) => (
            <div
              key={card}
              className={`rounded-lg p-3 text-xs bg-gradient-to-br ${c.color} border border-foreground/5`}
            >
              <div className="font-medium">{card.split(" · ")[0]}</div>
              <div className="text-muted-foreground mt-0.5">{card.split(" · ")[1]}</div>
              <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="size-2.5" /> 2d</span>
                <Eye className="size-2.5" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function AIView() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-5">
      <div className="col-span-12 md:col-span-7 rounded-xl border border-foreground/10 bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-foreground/10 flex items-center gap-2 text-xs">
          <BotIcon className="size-4" />
          <span className="font-semibold">Proponiq AI</span>
          <span className="ml-auto text-muted-foreground">Context: Vortex Studios · Q4 deck · brand voice</span>
        </div>
        <div className="p-5 space-y-4 text-sm">
          <ChatBubble role="user">
            Draft a 3-page proposal for Vortex Studios with brand redesign, 6-week
            timeline, $8,500 fixed price.
          </ChatBubble>
          <ChatBubble role="ai">
            Done. I&apos;ve drafted a 3-page proposal with discovery → identity →
            rollout phasing, pulled in Vortex&apos;s last audit, and included a
            $1,200/mo retainer option. Want me to tighten the cover paragraph?
          </ChatBubble>
        </div>
      </div>
      <div className="col-span-12 md:col-span-5 space-y-3">
        {[
          { t: "Tone", v: "Confident, warm" },
          { t: "Industry", v: "Design studio" },
          { t: "Avg. close", v: "5.2 days" },
          { t: "Voice match", v: "94%" },
        ].map((it) => (
          <div key={it.t} className="rounded-xl border border-foreground/10 bg-card p-4 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{it.t}</span>
            <span className="text-xs font-semibold">{it.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatBubble({ role, children }: { role: "user" | "ai"; children: React.ReactNode }) {
  return (
    <div className={`flex gap-3 ${role === "user" ? "" : "flex-row"}`}>
      <div
        className={`size-7 shrink-0 rounded-full flex items-center justify-center text-[10px] overflow-hidden ${
          role === "user"
            ? "bg-foreground/10"
            : "bg-gradient-to-br from-mint to-cyan-glow text-navy"
        }`}
      >
        {role === "user" ? "You" : <BotIcon className="size-6" />}
      </div>
      <div
        className={`rounded-2xl px-4 py-3 text-xs leading-relaxed max-w-[88%] ${
          role === "user"
            ? "bg-foreground/[0.04]"
            : "bg-mint/10 border border-mint/20"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
