import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoSize = "sm" | "md" | "lg";

interface LogoProps {
  className?: string;
  /** Show the full wordmark (default) or icon-only */
  showWordmark?: boolean;
  /** Wrap in a link. Pass empty string to render without a link */
  href?: string;
  /** Visual size — controls the rendered height */
  size?: LogoSize;
}

// Tailwind classes per size. Width is auto to preserve native aspect ratio.
const SIZE_CLASSES: Record<
  LogoSize,
  { icon: string; logo: string; intrinsic: { w: number; h: number } }
> = {
  // Width/height below are intrinsic ratios passed to next/image; CSS scales
  // them to the right height with `h-* w-auto`.
  sm: { icon: "h-6", logo: "h-6", intrinsic: { w: 200, h: 100 } },
  md: { icon: "h-8", logo: "h-8", intrinsic: { w: 200, h: 100 } },
  lg: { icon: "h-12", logo: "h-12", intrinsic: { w: 240, h: 120 } },
};

export function Logo({
  className,
  showWordmark = true,
  href = "/",
  size = "md",
}: LogoProps) {
  const s = SIZE_CLASSES[size];
  const heightClass = showWordmark ? s.logo : s.icon;

  const lightSrc = showWordmark
    ? "/proponiq-logo-dark.png" // dark asset → for light backgrounds
    : "/proponiq-icon-dark.png";
  const darkSrc = showWordmark
    ? "/proponiq-logo-light.png" // light asset → for dark backgrounds
    : "/proponiq-icon-light.png";

  const content = (
    <span
      className={cn(
        "relative inline-flex items-center select-none",
        "transition-transform duration-300 group-hover/logo:scale-[1.03]",
        className
      )}
    >
      {/* Light theme — dark-colored logo */}
      <Image
        src={lightSrc}
        alt="Proponiq"
        width={s.intrinsic.w}
        height={s.intrinsic.h}
        priority
        className={cn(heightClass, "w-auto block dark:hidden")}
      />
      {/* Dark theme — light-colored logo */}
      <Image
        src={darkSrc}
        alt=""
        width={s.intrinsic.w}
        height={s.intrinsic.h}
        priority
        aria-hidden
        className={cn(heightClass, "w-auto hidden dark:block")}
      />
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label="Proponiq home"
        className="inline-flex group/logo"
      >
        {content}
      </Link>
    );
  }
  return content;
}

/**
 * Icon-only mark — for tight spaces (e.g. in-app sidebar, email avatars).
 * Equivalent to `<Logo showWordmark={false} />` but with no link wrapper by default.
 */
export function LogoMark({
  className,
  size = "md",
}: {
  className?: string;
  size?: LogoSize;
}) {
  const s = SIZE_CLASSES[size];
  return (
    <span className={cn("relative inline-flex", s.icon, className)} aria-hidden>
      <Image
        src="/proponiq-icon-dark.png"
        alt=""
        width={100}
        height={100}
        className={cn(s.icon, "w-auto block dark:hidden")}
      />
      <Image
        src="/proponiq-icon-light.png"
        alt=""
        width={100}
        height={100}
        className={cn(s.icon, "w-auto hidden dark:block")}
      />
    </span>
  );
}
