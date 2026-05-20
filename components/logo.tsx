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

// Height classes per size variant. Width stays `w-auto` so the image's
// natural aspect ratio (2:1 for the wordmark, 1:1 for the icon) is preserved.
const SIZE_CLASSES: Record<LogoSize, { icon: string; logo: string }> = {
  sm: { icon: "h-6", logo: "h-7" },   // tiny — inline with small text
  md: { icon: "h-9", logo: "h-10" },  // nav / app header default
  lg: { icon: "h-14", logo: "h-14" }, // hero placements (login, onboarding, footer)
};

// Intrinsic dimensions used by next/image for layout reservation.
// Values just need to match the source image's aspect ratio.
const INTRINSIC = {
  logo: { width: 240, height: 120 }, // ~2:1
  icon: { width: 100, height: 100 }, // 1:1
};

export function Logo({
  className,
  showWordmark = true,
  href = "/",
  size = "md",
}: LogoProps) {
  const heightClass = showWordmark
    ? SIZE_CLASSES[size].logo
    : SIZE_CLASSES[size].icon;
  const dims = showWordmark ? INTRINSIC.logo : INTRINSIC.icon;

  const lightSrc = showWordmark
    ? "/proponiq-logo-dark.png" // dark-colored asset → for light backgrounds
    : "/proponiq-icon-dark.png";
  const darkSrc = showWordmark
    ? "/proponiq-logo-light.png" // light-colored asset → for dark backgrounds
    : "/proponiq-icon-light.png";

  const content = (
    <span
      className={cn(
        "relative inline-flex items-center select-none",
        "transition-transform duration-300 group-hover/logo:scale-[1.03]",
        className
      )}
    >
      <Image
        src={lightSrc}
        alt="Proponiq"
        width={dims.width}
        height={dims.height}
        priority
        className={cn(heightClass, "w-auto block dark:hidden")}
      />
      <Image
        src={darkSrc}
        alt=""
        width={dims.width}
        height={dims.height}
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
 * Icon-only mark for tight spaces (sidebars, email avatars, decorations).
 */
export function LogoMark({
  className,
  size = "md",
}: {
  className?: string;
  size?: LogoSize;
}) {
  const heightClass = SIZE_CLASSES[size].icon;
  return (
    <span className={cn("relative inline-flex", className)} aria-hidden>
      <Image
        src="/proponiq-icon-dark.png"
        alt=""
        width={INTRINSIC.icon.width}
        height={INTRINSIC.icon.height}
        className={cn(heightClass, "w-auto block dark:hidden")}
      />
      <Image
        src="/proponiq-icon-light.png"
        alt=""
        width={INTRINSIC.icon.width}
        height={INTRINSIC.icon.height}
        className={cn(heightClass, "w-auto hidden dark:block")}
      />
    </span>
  );
}
