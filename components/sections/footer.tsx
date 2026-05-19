"use client";

import * as React from "react";
import Link from "next/link";
import { Twitter, Github, Linkedin, Send, ArrowRight } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Dashboard", href: "/#product" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Templates", href: "/#features" },
      { label: "Integrations", href: "/#features" },
      { label: "Changelog", href: "/" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/" },
      { label: "Customers", href: "/#testimonials" },
      { label: "Careers", href: "/" },
      { label: "Press kit", href: "/" },
      { label: "Contact", href: "mailto:techymk.dev@gmail.com" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/" },
      { label: "Guides", href: "/" },
      { label: "Proposal templates", href: "/#features" },
      { label: "Help center", href: "mailto:techymk.dev@gmail.com" },
      { label: "API docs", href: "/" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Security", href: "/privacy#security" },
      { label: "DPA", href: "/privacy#subprocessors" },
    ],
  },
];

export function Footer() {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  return (
    <footer className="relative border-t border-foreground/10 bg-foreground/[0.015] pt-20 pb-10 mt-10">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Brand + newsletter */}
          <div className="lg:col-span-5">
            <Logo />
            <p className="mt-5 text-sm text-muted-foreground max-w-sm leading-relaxed">
              Smart proposals, bigger wins. Proponiq is the AI proposal platform
              built for freelancers, agencies and consultants who care about how
              they show up.
            </p>

            <form
              className="mt-7 max-w-md"
              onSubmit={(e) => {
                e.preventDefault();
                if (!email) return;
                setSubmitted(true);
              }}
              aria-label="Subscribe to the newsletter"
            >
              <label htmlFor="footer-newsletter" className="text-xs font-medium">
                Get product updates & proposal tips
              </label>
              <div className="mt-2 flex items-center gap-2 rounded-full border border-foreground/10 bg-card pl-4 pr-1 py-1 focus-within:border-mint/40 transition">
                <Send className="size-4 text-muted-foreground" />
                <input
                  id="footer-newsletter"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@studio.com"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground py-2"
                />
                <Button type="submit" size="sm" variant="primary" className="group">
                  {submitted ? "Subscribed" : "Subscribe"}
                  {!submitted && (
                    <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
                  )}
                </Button>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                One short email a week. Unsubscribe in one click.
              </p>
            </form>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-8">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
                  {col.title}
                </h4>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-foreground/10 flex flex-col-reverse md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} Proponiq, Inc. All rights reserved.</p>
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
              <span className="inline-block size-1 rounded-full bg-mint ml-2 align-middle animate-pulse" />
            </p>
          </div>
          <div className="flex items-center gap-1">
            {[
              { i: Twitter, href: "#", label: "Twitter" },
              { i: Linkedin, href: "#", label: "LinkedIn" },
              { i: Github, href: "#", label: "GitHub" },
            ].map(({ i: Icon, href, label }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="inline-flex items-center justify-center size-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition"
              >
                <Icon className="size-4" />
              </Link>
            ))}
          </div>
        </div>

        {/* Decorative wordmark */}
        <div
          aria-hidden
          className="pointer-events-none mt-12 select-none text-center"
        >
          <div className="font-display text-[18vw] md:text-[14vw] leading-none font-bold tracking-tighter bg-gradient-to-b from-foreground/5 to-transparent bg-clip-text text-transparent">
            proponiq
          </div>
        </div>
      </div>
    </footer>
  );
}
