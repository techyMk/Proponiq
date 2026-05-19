import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "relative bg-mint text-navy hover:bg-cyan-glow shadow-[0_8px_30px_-8px_rgba(32,214,181,0.6)] hover:shadow-[0_12px_40px_-8px_rgba(32,214,181,0.8)] hover:-translate-y-0.5",
        secondary:
          "bg-foreground/[0.04] text-foreground border border-foreground/10 hover:bg-foreground/[0.08] hover:border-foreground/20 backdrop-blur",
        ghost:
          "text-foreground hover:bg-foreground/[0.06]",
        outline:
          "border border-foreground/15 bg-transparent text-foreground hover:bg-foreground/[0.04]",
        gradient:
          "bg-gradient-to-r from-mint to-cyan-glow text-navy hover:shadow-[0_12px_40px_-8px_rgba(32,214,181,0.8)] hover:-translate-y-0.5",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-7 text-base",
        xl: "h-14 px-8 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const cls = cn(buttonVariants({ variant, size, className }));

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<{ className?: string }>;
      return React.cloneElement(child, {
        className: cn(cls, child.props.className),
        ...props,
      });
    }

    return (
      <button ref={ref} className={cls} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
