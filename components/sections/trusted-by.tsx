"use client";

import * as React from "react";
import { motion } from "framer-motion";

// -----------------------------------------------------------------------------
// Inline brand SVGs for tools without reliable simple-icons coverage,
// or where we want full color control.
// All sized to fit a 20×20 box; viewBox normalised.
// -----------------------------------------------------------------------------

const GoogleIcon = () => (
  <svg
    viewBox="0 0 48 48"
    className="size-5"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      fill="#4285F4"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.860-1.977,13.409-5.192l-6.190-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    />
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.190,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </svg>
);

const StripeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="size-5"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      fill="#635BFF"
      d="M13.479 9.883c-1.626-.604-2.512-1.067-2.512-1.803 0-.622.511-.977 1.423-.977 1.667 0 3.379.642 4.558 1.22l.666-4.111c-.935-.446-2.847-1.177-5.49-1.177-1.87 0-3.425.487-4.536 1.4-1.155.954-1.757 2.336-1.757 4.005 0 3.024 1.847 4.312 4.857 5.403 1.936.7 2.582 1.196 2.582 1.957 0 .736-.629 1.157-1.766 1.157-1.394 0-3.692-.683-5.197-1.557l-.674 4.157c1.293.733 3.692 1.483 6.18 1.483 1.976 0 3.624-.467 4.738-1.347 1.244-.98 1.888-2.425 1.888-4.318 0-3.094-1.888-4.382-4.96-5.492z"
    />
  </svg>
);

// Tiptap brand-style "tip" wordmark, recreated as a single-color mark
const TiptapIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className ?? "size-5"}
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    aria-hidden
  >
    {/* Three rectangles representing the Tiptap "tip-tap" rhythm */}
    <rect x="2" y="6" width="6" height="12" rx="1.5" />
    <rect x="9" y="6" width="6" height="12" rx="1.5" />
    <rect x="16" y="6" width="6" height="12" rx="1.5" />
  </svg>
);

// Groq lightning-Q mark — minimal recognisable Q with a slash
const GroqIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className ?? "size-5"}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <circle cx="11" cy="12" r="7" />
    <path d="M15 16l5 5" />
  </svg>
);

// -----------------------------------------------------------------------------
// Tech stack — order matters (most recognisable first)
// -----------------------------------------------------------------------------

type Tech =
  | { kind: "slug"; name: string; slug: string }
  | { kind: "svg"; name: string; Svg: React.ComponentType<{ className?: string }> };

const TECH: Tech[] = [
  { kind: "slug", name: "Next.js", slug: "nextdotjs" },
  { kind: "slug", name: "React", slug: "react" },
  { kind: "slug", name: "TypeScript", slug: "typescript" },
  { kind: "slug", name: "Tailwind CSS", slug: "tailwindcss" },
  { kind: "slug", name: "Prisma", slug: "prisma" },
  { kind: "slug", name: "Postgres", slug: "postgresql" },
  { kind: "svg", name: "Stripe", Svg: StripeIcon },
  { kind: "svg", name: "Tiptap", Svg: TiptapIcon },
  { kind: "slug", name: "Resend", slug: "resend" },
  { kind: "slug", name: "Vercel", slug: "vercel" },
  { kind: "svg", name: "Groq", Svg: GroqIcon },
  { kind: "svg", name: "Auth.js", Svg: GoogleIcon },
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
              <TechBadge key={`${t.name}-${i}`} tech={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TechBadge({ tech }: { tech: Tech }) {
  return (
    <div className="flex items-center gap-2.5 shrink-0 opacity-70 hover:opacity-100 transition-opacity duration-300">
      {tech.kind === "slug" ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://cdn.simpleicons.org/${tech.slug}/5C6B82`}
            alt=""
            width={20}
            height={20}
            className="size-5 block dark:hidden"
            loading="lazy"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://cdn.simpleicons.org/${tech.slug}/D6E2F0`}
            alt=""
            width={20}
            height={20}
            className="size-5 hidden dark:block"
            loading="lazy"
          />
        </>
      ) : (
        <span className="text-foreground/70 dark:text-foreground/80 inline-flex">
          <tech.Svg className="size-5" />
        </span>
      )}
      <span className="font-display text-base md:text-lg font-semibold tracking-tight text-foreground/80">
        {tech.name}
      </span>
    </div>
  );
}
