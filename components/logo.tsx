import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
  href?: string;
}

export function Logo({ className, showWordmark = true, href = "/" }: LogoProps) {
  const content = (
    <span className={cn("inline-flex items-center gap-2.5 group", className)}>
      <LogoMark className="size-8 transition-transform duration-300 group-hover:scale-105" />
      {showWordmark && (
        <span className="font-display text-lg font-bold tracking-tight">
          propon<span className="text-mint">iq</span>
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} aria-label="Proponiq home" className="inline-flex">
        {content}
      </Link>
    );
  }
  return content;
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-8", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="lm-navy" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0F2D52" />
          <stop offset="100%" stopColor="#071B34" />
        </linearGradient>
        <linearGradient id="lm-mint" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#20D6B5" />
          <stop offset="100%" stopColor="#6FFFE9" />
        </linearGradient>
      </defs>
      {/* Stylized P shape */}
      <path
        d="M8 6h16a10 10 0 0 1 0 20H16v8H8V6Z"
        fill="url(#lm-navy)"
      />
      {/* Inner document accent */}
      <path
        d="M12 14h7a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-7V14Z"
        fill="url(#lm-mint)"
      />
      <path d="M14 17h4M14 20h4M14 23h3" stroke="#071B34" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
