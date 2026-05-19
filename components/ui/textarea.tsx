import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[120px] w-full rounded-xl border border-foreground/10 bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors resize-y",
        "focus-visible:outline-none focus-visible:border-mint/50 focus-visible:ring-2 focus-visible:ring-mint/30",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
