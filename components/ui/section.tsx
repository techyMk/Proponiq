import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  containerClassName?: string;
}

export function Section({
  className,
  containerClassName,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn("relative py-20 md:py-28 lg:py-32", className)}
      {...props}
    >
      <div className={cn("container relative", containerClassName)}>{children}</div>
    </section>
  );
}

interface SectionHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-3xl mb-14 md:mb-20",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <Badge variant="mint" className="mb-5">
          <span className="size-1.5 rounded-full bg-mint animate-pulse-glow" />
          {eyebrow}
        </Badge>
      )}
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-balance">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-base md:text-lg text-muted-foreground text-balance leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
