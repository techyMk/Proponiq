"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const TONES = [
  { v: "professional", label: "Professional" },
  { v: "warm", label: "Warm" },
  { v: "bold", label: "Bold" },
  { v: "casual", label: "Casual" },
] as const;

export function NewProposalForm() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const [form, setForm] = React.useState({
    title: "",
    clientName: "",
    projectDescription: "",
    scope: "",
    budget: "",
    timeline: "",
    tone: "professional" as (typeof TONES)[number]["v"],
  });

  const set =
    <K extends keyof typeof form>(k: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    if (!form.title.trim() || !form.clientName.trim() || form.projectDescription.trim().length < 10) {
      toast.error("Fill in title, client and a project description (10+ chars).");
      return;
    }
    setLoading(true);
    const tId = toast.loading("Drafting your proposal with AI…");
    try {
      // Step 1: generate
      const draftRes = await fetch("/api/ai/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!draftRes.ok) {
        const data = await draftRes.json().catch(() => ({}));
        throw new Error(data.error || `AI draft failed (${draftRes.status})`);
      }
      const draft = await draftRes.json();

      // Step 2: persist
      const createRes = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: draft.generated.title || form.title,
          clientName: form.clientName,
          brief: draft.brief,
          content: draft.content,
          amount: form.budget || undefined,
        }),
      });
      if (!createRes.ok) {
        const data = await createRes.json().catch(() => ({}));
        throw new Error(data.error || "Could not save proposal");
      }
      const proposal = await createRes.json();

      toast.success("Draft ready!", { id: tId });
      router.push(`/proposals/${proposal.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message, { id: tId });
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-foreground/10 bg-card p-6 md:p-8 space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Project title" required>
          <Input
            placeholder="Brand redesign for Vortex Studios"
            value={form.title}
            onChange={set("title")}
            required
          />
        </Field>
        <Field label="Client name" required>
          <Input
            placeholder="Vortex Studios"
            value={form.clientName}
            onChange={set("clientName")}
            required
          />
        </Field>
      </div>

      <Field
        label="What's the project?"
        required
        hint="2–4 sentences. What's the client trying to achieve?"
      >
        <Textarea
          placeholder="Vortex is launching a B2B SaaS in Q3 and wants a brand identity refresh — new mark, type system, web colors, plus a 1-pager pitch deck template…"
          value={form.projectDescription}
          onChange={set("projectDescription")}
          rows={5}
          required
          minLength={10}
        />
      </Field>

      <Field
        label="Scope / requirements (optional)"
        hint="Bullets work great. List deliverables, must-haves, constraints."
      >
        <Textarea
          placeholder={`- Logo + wordmark\n- Color system + typography\n- Pitch deck template (Figma)\n- 2 rounds of revisions`}
          value={form.scope}
          onChange={set("scope")}
          rows={4}
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Budget (optional)">
          <Input
            placeholder="$8,500 fixed"
            value={form.budget}
            onChange={set("budget")}
          />
        </Field>
        <Field label="Timeline (optional)">
          <Input
            placeholder="6 weeks"
            value={form.timeline}
            onChange={set("timeline")}
          />
        </Field>
      </div>

      <Field label="Tone of voice">
        <div className="flex flex-wrap gap-2">
          {TONES.map((t) => {
            const active = form.tone === t.v;
            return (
              <button
                key={t.v}
                type="button"
                onClick={() => setForm((f) => ({ ...f, tone: t.v }))}
                className={`px-3.5 py-1.5 rounded-full text-xs border transition ${
                  active
                    ? "bg-mint text-navy border-mint"
                    : "border-foreground/10 text-muted-foreground hover:text-foreground hover:border-foreground/20"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </Field>

      <div className="flex items-center justify-between pt-2 border-t border-foreground/10">
        <p className="text-xs text-muted-foreground">
          Drafting takes ~5 seconds. You can edit everything afterwards.
        </p>
        <Button type="submit" size="lg" variant="primary" disabled={loading} className="group">
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Drafting…
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              Draft with AI
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="text-mint">*</span>}
      </Label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}
