import * as React from "react";
import Link from "next/link";
import { BackHomeNav } from "@/components/back-home-nav";

type Section = {
  id: string;
  title: string;
  children: React.ReactNode;
};

export function LegalPage({
  title,
  subtitle,
  lastUpdated,
  sections,
}: {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: Section[];
}) {
  return (
    <section className="relative pt-32 md:pt-40 pb-24">
      <BackgroundAccent />
      <div className="container max-w-5xl relative">
        <div className="flex justify-center mb-8">
          <BackHomeNav />
        </div>
        <header className="text-center max-w-2xl mx-auto mb-14 md:mb-20">
          <p className="text-xs uppercase tracking-[0.25em] text-mint font-medium">
            Legal
          </p>
          <h1 className="mt-4 font-display text-4xl md:text-5xl font-semibold tracking-tight text-balance">
            {title}
          </h1>
          <p className="mt-4 text-base text-muted-foreground text-balance leading-relaxed">
            {subtitle}
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 lg:gap-16">
          {/* Sticky TOC */}
          <aside className="hidden lg:block">
            <nav className="sticky top-28">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3">
                On this page
              </p>
              <ul className="space-y-1.5 text-sm">
                {sections.map((s) => (
                  <li key={s.id}>
                    <Link
                      href={`#${s.id}`}
                      className="block py-1.5 px-3 -mx-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04] transition"
                    >
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <article className="space-y-12 min-w-0">
            {sections.map((s, i) => (
              <section
                key={s.id}
                id={s.id}
                className="scroll-mt-28 space-y-4 pb-12 border-b border-foreground/5 last:border-b-0"
              >
                <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">
                  <span className="text-mint mr-2 text-base align-middle">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.title}
                </h2>
                <div className="prose-legal">{s.children}</div>
              </section>
            ))}

            <div className="rounded-2xl border border-foreground/10 bg-card p-6 md:p-8">
              <h3 className="font-display text-lg font-semibold">
                Questions?
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Reach us at{" "}
                <a
                  href="mailto:hello@proponiq.com"
                  className="text-mint hover:text-cyan-glow underline underline-offset-4"
                >
                  hello@proponiq.com
                </a>
                . We answer everything within one business day.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function BackgroundAccent() {
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-[700px] rounded-full bg-mint/10 blur-[140px] opacity-60" />
      <div className="absolute inset-0 bg-grid-light dark:bg-grid-dark [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_60%)]" />
    </div>
  );
}
