import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The branded Proponiq AI bot icon.
 *
 * Drop-in replacement for any Lucide icon — accepts a className for sizing
 * (e.g. `size-3`, `size-4`, `size-6`). The image scales down to whatever
 * height/width Tailwind sets via the className.
 *
 * Intended for places that represent the AI assistant specifically.
 * For decorative / premium accents, keep using <Sparkles />.
 */
export function BotIcon({
  className,
  alt = "",
}: {
  className?: string;
  alt?: string;
}) {
  return (
    <Image
      src="/bot-icon.webp"
      alt={alt}
      width={48}
      height={48}
      className={cn("inline-block object-contain shrink-0", className)}
      aria-hidden={alt === ""}
      priority={false}
    />
  );
}
