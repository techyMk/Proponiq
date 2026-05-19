import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "mint" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
        variant === "default" &&
          "bg-foreground/[0.05] text-foreground border border-foreground/10",
        variant === "mint" &&
          "bg-mint/10 text-mint border border-mint/20",
        variant === "outline" &&
          "border border-foreground/15 text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}
