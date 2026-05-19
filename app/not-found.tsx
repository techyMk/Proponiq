import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, FileQuestion, Home, LifeBuoy } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { BackHomeNav } from "@/components/back-home-nav";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "We couldn't find that page. It may have been moved, renamed, or never existed.",
};

export default function NotFound() {
  return (
    <main id="main" className="min-h-svh bg-background relative overflow-hidden flex flex-col">
      <BackgroundOrbs />

      <header className="relative">
        <div className="container flex h-16 items-center justify-between gap-3">
          <Logo />
          <BackHomeNav />
        </div>
      </header>

      <section className="relative flex-1 flex items-center">
        <div className="container max-w-3xl text-center py-16 md:py-24">
          <div className="mx-auto inline-flex size-16 items-center justify-center rounded-2xl bg-mint/10 border border-mint/20 text-mint mb-8">
            <FileQuestion className="size-8" />
          </div>

          <p className="font-display text-[120px] md:text-[180px] leading-none font-bold tracking-tighter bg-gradient-to-b from-foreground/15 to-transparent bg-clip-text text-transparent select-none">
            404
          </p>

          <h1 className="-mt-4 md:-mt-10 font-display text-3xl md:text-4xl font-semibold tracking-tight text-balance">
            We couldn&apos;t find that page
          </h1>

          <p className="mt-4 text-base text-muted-foreground max-w-md mx-auto text-balance leading-relaxed">
            The link may be broken, the page may have moved, or you may have
            typed the URL by hand and missed a character. It happens.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild variant="primary" size="lg" className="group">
              <Link href="/">
                <Home className="size-4" />
                Back to homepage
                <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/dashboard">
                <ArrowLeft className="size-4" />
                Go to dashboard
              </Link>
            </Button>
          </div>

          <div className="mt-14 rounded-2xl border border-foreground/10 bg-card p-5 max-w-md mx-auto">
            <div className="flex items-start gap-3 text-left">
              <div className="inline-flex size-9 items-center justify-center rounded-lg bg-foreground/[0.04] text-foreground/70 shrink-0">
                <LifeBuoy className="size-4" />
              </div>
              <div>
                <h2 className="font-display text-sm font-semibold">
                  Still stuck?
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                  Email{" "}
                  <a
                    href="mailto:hello@proponiq.com"
                    className="text-mint hover:text-cyan-glow underline underline-offset-4"
                  >
                    hello@proponiq.com
                  </a>{" "}
                  with what you were looking for and we&apos;ll help out.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-foreground/10 py-6">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-center sm:text-left">
            <p>© {new Date().getFullYear()} Proponiq, Inc.</p>
            <span className="hidden sm:inline-block opacity-30">·</span>
            <p>
              Designed &amp; developed by{" "}
              <a
                href="https://techymk.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground/80 hover:text-mint transition underline-offset-4 hover:underline"
              >
                techyMk
              </a>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-foreground transition">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function BackgroundOrbs() {
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-mint/15 blur-[140px]" />
      <div className="absolute bottom-0 right-0 size-[400px] rounded-full bg-deep-blue/30 blur-[140px]" />
      <div className="absolute inset-0 bg-grid-light dark:bg-grid-dark [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
    </div>
  );
}
