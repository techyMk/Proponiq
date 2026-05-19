"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  User,
  Users,
  Briefcase,
  Building2,
  Circle,
  ArrowRight,
  Loader2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type UserType = "FREELANCER" | "AGENCY" | "CONSULTANT" | "IN_HOUSE" | "OTHER";

const TYPES: {
  value: UserType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    value: "FREELANCER",
    label: "Freelancer",
    description: "I work for myself, project to project.",
    icon: User,
  },
  {
    value: "AGENCY",
    label: "Agency",
    description: "We're a team that takes on client work.",
    icon: Users,
  },
  {
    value: "CONSULTANT",
    label: "Consultant",
    description: "I sell expertise — strategy, advisory, audits.",
    icon: Briefcase,
  },
  {
    value: "IN_HOUSE",
    label: "In-house",
    description: "I send internal proposals or vendor RFPs.",
    icon: Building2,
  },
  {
    value: "OTHER",
    label: "Something else",
    description: "We&apos;ll keep things general.",
    icon: Circle,
  },
];

const SERVICE_OPTIONS = [
  "Branding & design",
  "Web design",
  "Web development",
  "Mobile development",
  "Product / UX",
  "Marketing",
  "SEO",
  "Content & copy",
  "Strategy",
  "Consulting",
  "Photography",
  "Video",
  "Other",
];

export function OnboardingForm() {
  const router = useRouter();

  const [userType, setUserType] = React.useState<UserType | null>(null);
  const [businessName, setBusinessName] = React.useState("");
  const [headline, setHeadline] = React.useState("");
  const [services, setServices] = React.useState<string[]>([]);
  const [submitting, setSubmitting] = React.useState(false);

  function toggleService(s: string) {
    setServices((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    if (!userType) {
      toast.error("Pick the option that best describes you.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userType,
          businessName,
          headline,
          services,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not save");
      }
      toast.success("All set — welcome aboard!");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <section className="rounded-2xl border border-foreground/10 bg-card p-6 md:p-8 space-y-5">
        <div>
          <Label className="text-sm">
            Which best describes you? <span className="text-mint">*</span>
          </Label>
          <p className="text-xs text-muted-foreground mt-1">
            We use this to tune the AI and pick relevant templates.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {TYPES.map((t) => {
            const active = userType === t.value;
            const Icon = t.icon;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setUserType(t.value)}
                className={cn(
                  "group text-left rounded-xl border p-4 transition-all relative",
                  active
                    ? "border-mint/50 bg-gradient-to-br from-mint/[0.08] to-transparent shadow-glow-sm"
                    : "border-foreground/10 hover:border-foreground/25 hover:-translate-y-0.5"
                )}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "inline-flex size-9 items-center justify-center rounded-lg shrink-0 transition",
                      active
                        ? "bg-mint text-navy"
                        : "bg-foreground/[0.05] text-foreground/70"
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="font-display text-sm font-semibold tracking-tight">
                      {t.label}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                      {t.description}
                    </p>
                  </div>
                  {active && (
                    <Check className="size-4 text-mint absolute top-3 right-3" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-foreground/10 bg-card p-6 md:p-8 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Business / studio name</Label>
            <Input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Vortex Studio"
            />
          </div>
          <div className="space-y-2">
            <Label>One-line headline</Label>
            <Input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Brand designer for early-stage SaaS"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>What kind of work do you do? (optional)</Label>
          <p className="text-[11px] text-muted-foreground">
            Helps the AI match your tone and recommend templates.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {SERVICE_OPTIONS.map((s) => {
              const active = services.includes(s);
              return (
                <button
                  type="button"
                  key={s}
                  onClick={() => toggleService(s)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs border transition",
                    active
                      ? "bg-mint text-navy border-mint"
                      : "border-foreground/10 text-muted-foreground hover:text-foreground hover:border-foreground/20"
                  )}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          You can update this anytime in Settings.
        </p>
        <Button
          type="submit"
          size="lg"
          variant="primary"
          disabled={submitting || !userType}
          className="group"
        >
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              Finish setup
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
