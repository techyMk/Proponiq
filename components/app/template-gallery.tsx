"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import type { ProposalTemplate } from "@/lib/templates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function TemplateGallery({ templates }: { templates: ProposalTemplate[] }) {
  const router = useRouter();
  const [selectedId, setSelectedId] = React.useState<string>(templates[0]?.id ?? "");
  const [clientName, setClientName] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const selected = templates.find((t) => t.id === selectedId) ?? templates[0];

  async function onCreate() {
    if (!clientName.trim()) {
      toast.error("Enter a client name first.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/proposals/from-template", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: selected.id,
          clientName: clientName.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not create proposal");
      }
      const proposal = await res.json();
      toast.success("Proposal created!");
      router.push(`/proposals/${proposal.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
      setSubmitting(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      <div>
        <Label className="mb-3 inline-block">Choose a template</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {templates.map((t) => {
            const active = selectedId === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedId(t.id)}
                className={cn(
                  "group text-left rounded-2xl border p-4 transition-all relative overflow-hidden",
                  active
                    ? "border-mint/50 bg-gradient-to-br from-mint/[0.08] to-transparent shadow-glow-sm"
                    : "border-foreground/10 bg-card hover:border-foreground/20 hover:-translate-y-0.5"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-2xl">{t.emoji}</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {t.category}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-sm font-semibold tracking-tight">
                  {t.name}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {t.description}
                </p>
                {t.defaultAmount && (
                  <p className="mt-3 text-[11px] font-medium text-mint">
                    {t.defaultAmount}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-2xl border border-foreground/10 bg-card p-5 space-y-4 lg:sticky lg:top-20">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selected?.emoji}</span>
              <div>
                <h3 className="font-display text-base font-semibold tracking-tight">
                  {selected?.name}
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  {selected?.category}
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
              {selected?.description}
            </p>
          </div>

          <div className="space-y-2 pt-3 border-t border-foreground/10">
            <Label>
              Client name <span className="text-mint">*</span>
            </Label>
            <Input
              placeholder="Vortex Studios"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
            />
            <p className="text-[11px] text-muted-foreground">
              We&apos;ll replace placeholders in the template with this name.
            </p>
          </div>

          <Button
            type="button"
            size="md"
            variant="primary"
            className="w-full group"
            onClick={onCreate}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Creating…
              </>
            ) : (
              <>
                Use this template
                <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </Button>
        </div>
      </aside>
    </div>
  );
}
