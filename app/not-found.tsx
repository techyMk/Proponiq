import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { NotFoundContent } from "@/components/not-found-content";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "We couldn't find that page. It may have been moved, renamed, or never existed.",
};

export default function NotFound() {
  return (
    <main
      id="main"
      className="min-h-svh bg-background relative overflow-hidden flex flex-col"
    >
      <header className="relative z-10">
        <div className="container flex h-16 items-center">
          <Logo />
        </div>
      </header>

      <NotFoundContent />

      <footer className="relative z-10 border-t border-foreground/10 py-6">
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
