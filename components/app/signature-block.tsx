"use client";

import * as React from "react";
import { CheckCircle2, Loader2, ShieldCheck, PenLine } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Signature = {
  signerName: string;
  signerEmail: string | null;
  signedAt: string;
};

export function SignatureBlock({
  token,
  signature,
  defaultName,
}: {
  token: string;
  signature: Signature | null;
  defaultName?: string;
}) {
  const [signed, setSigned] = React.useState<Signature | null>(signature);
  const [name, setName] = React.useState(defaultName ?? "");
  const [email, setEmail] = React.useState("");
  const [consent, setConsent] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  async function onSign(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    if (name.trim().length < 2) {
      toast.error("Type your full name to sign.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Enter a valid email so we can confirm the signature.");
      return;
    }
    if (!consent) {
      toast.error("Please agree to the proposal terms first.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/p/${token}/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signerName: name, signerEmail: email, consent }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not sign");
      }
      const created = await res.json();
      setSigned({
        signerName: created.signerName,
        signerEmail: created.signerEmail,
        signedAt: created.signedAt,
      });
      toast.success("Proposal signed!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (signed) {
    const when = new Date(signed.signedAt);
    return (
      <div className="mt-10 rounded-2xl border border-mint/40 bg-gradient-to-br from-mint/[0.08] to-transparent p-6 md:p-8">
        <div className="flex items-center gap-3">
          <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-mint/15 border border-mint/30 text-mint">
            <CheckCircle2 className="size-6" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold tracking-tight">
              Proposal signed
            </h3>
            <p className="text-xs text-muted-foreground">
              {when.toLocaleString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
        <div className="mt-5 pt-5 border-t border-foreground/10 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Detail label="Signed by">
            <span
              className="font-display text-base"
              style={{ fontStyle: "italic" }}
            >
              {signed.signerName}
            </span>
          </Detail>
          {signed.signerEmail && <Detail label="Email">{signed.signerEmail}</Detail>}
        </div>
        <p className="mt-4 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <ShieldCheck className="size-3.5 text-mint" />
          Audit log includes IP, user agent, and timestamp.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSign}
      className="mt-10 rounded-2xl border border-foreground/10 bg-card p-6 md:p-8 space-y-5"
    >
      <div className="flex items-center gap-3">
        <div className="inline-flex size-10 items-center justify-center rounded-xl bg-mint/10 border border-mint/20 text-mint">
          <PenLine className="size-5" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold tracking-tight">
            Accept & sign
          </h3>
          <p className="text-xs text-muted-foreground">
            Type your full name below — it counts as a legally binding signature.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>
            Full name <span className="text-mint">*</span>
          </Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            required
            autoComplete="name"
          />
        </div>
        <div className="space-y-2">
          <Label>
            Email <span className="text-mint">*</span>
          </Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@vortex.com"
            required
            autoComplete="email"
          />
        </div>
      </div>

      {name.trim().length >= 2 && (
        <div className="rounded-xl border border-dashed border-mint/30 bg-mint/[0.05] p-5 text-center">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Preview signature
          </p>
          <p
            className="mt-2 font-display text-3xl text-foreground"
            style={{ fontStyle: "italic" }}
          >
            {name.trim()}
          </p>
        </div>
      )}

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 size-4 rounded border-foreground/20 bg-card text-mint focus-visible:ring-2 focus-visible:ring-mint/40 accent-mint"
        />
        <span className="text-xs text-muted-foreground leading-relaxed">
          I confirm that I am authorized to sign this proposal on behalf of the
          client, and I agree to the scope, timeline and investment outlined
          above. My typed name is a legally binding electronic signature. My IP
          address and user agent will be recorded for the audit log.
        </span>
      </label>

      <div className="pt-2">
        <Button type="submit" size="lg" variant="primary" disabled={submitting} className="w-full sm:w-auto">
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Signing…
            </>
          ) : (
            <>
              <CheckCircle2 className="size-4" />
              Accept & sign proposal
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm font-medium mt-0.5">{children}</dd>
    </div>
  );
}
