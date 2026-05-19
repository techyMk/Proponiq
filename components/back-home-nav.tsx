"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackHomeNavProps {
  className?: string;
  homeHref?: string;
}

export function BackHomeNav({ className, homeHref = "/" }: BackHomeNavProps) {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = React.useState(false);

  React.useEffect(() => {
    setCanGoBack(window.history.length > 1);
  }, []);

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <button
        type="button"
        onClick={() => {
          if (canGoBack) router.back();
          else router.push(homeHref);
        }}
        className="group inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-xs font-medium border border-foreground/10 bg-card/60 backdrop-blur hover:bg-card hover:border-foreground/25 hover:-translate-x-0.5 transition-all text-muted-foreground hover:text-foreground"
        aria-label="Go back"
      >
        <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
        Back
      </button>
      <Link
        href={homeHref}
        className="group inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-xs font-medium border border-foreground/10 bg-card/60 backdrop-blur hover:bg-card hover:border-foreground/25 transition-all text-muted-foreground hover:text-foreground"
        aria-label="Go to homepage"
      >
        <Home className="size-3.5" />
        Home
      </Link>
    </div>
  );
}
