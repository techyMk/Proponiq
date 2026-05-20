"use client";

import * as React from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Palette, Loader2, Image as ImageIcon, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DEFAULT_COLOR = "#20D6B5";

const PRESETS = [
  "#20D6B5", // mint
  "#0F2D52", // navy
  "#6366F1", // indigo
  "#F97316", // orange
  "#EF4444", // red
  "#A855F7", // purple
  "#10B981", // green
  "#0EA5E9", // sky
];

export function BrandingCard({
  initialColor,
  initialLogoUrl,
}: {
  initialColor: string | null;
  initialLogoUrl: string | null;
}) {
  const [color, setColor] = React.useState(initialColor ?? DEFAULT_COLOR);
  const [logoUrl, setLogoUrl] = React.useState(initialLogoUrl ?? "");
  const [saving, setSaving] = React.useState(false);

  const isValidHex = /^#[0-9a-fA-F]{6}$/.test(color);
  const isValidLogo = logoUrl === "" || /^https?:\/\/.+/i.test(logoUrl);
  const hasChanges = color !== (initialColor ?? DEFAULT_COLOR) || logoUrl !== (initialLogoUrl ?? "");

  async function save() {
    if (!isValidHex) {
      toast.error("Enter a valid hex color like #20D6B5");
      return;
    }
    if (!isValidLogo) {
      toast.error("Logo URL must start with https://");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/account/branding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandColor: color === DEFAULT_COLOR ? "" : color,
          brandLogoUrl: logoUrl,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Save failed");
      }
      toast.success("Branding updated. New proposals will use it.");
    } catch (err) {
      const m = err instanceof Error ? err.message : "Something went wrong";
      toast.error(m);
    } finally {
      setSaving(false);
    }
  }

  function resetToDefault() {
    setColor(DEFAULT_COLOR);
    setLogoUrl("");
  }

  return (
    <section className="rounded-2xl border border-foreground/10 bg-card p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-semibold inline-flex items-center gap-2">
            <Palette className="size-4 text-mint" />
            Branding
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Customize the look of your shared proposals and PDFs.
          </p>
        </div>
        {hasChanges && (
          <button
            type="button"
            onClick={resetToDefault}
            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition"
          >
            <RotateCcw className="size-3" />
            Reset
          </button>
        )}
      </div>

      {/* Color */}
      <div className="space-y-3">
        <Label>Brand color</Label>
        <div className="flex items-center gap-3">
          <label
            htmlFor="brand-color"
            className="size-10 rounded-lg border border-foreground/15 overflow-hidden cursor-pointer relative shrink-0"
            style={{ background: isValidHex ? color : "transparent" }}
          >
            <input
              id="brand-color"
              type="color"
              value={isValidHex ? color : DEFAULT_COLOR}
              onChange={(e) => setColor(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </label>
          <Input
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="#20D6B5"
            className="flex-1 max-w-[140px] font-mono text-sm"
            maxLength={7}
          />
          <div className="flex flex-wrap items-center gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setColor(p)}
                aria-label={`Set color to ${p}`}
                className={`size-6 rounded-full border-2 transition ${
                  color.toLowerCase() === p.toLowerCase()
                    ? "border-foreground scale-110"
                    : "border-transparent hover:scale-110"
                }`}
                style={{ background: p }}
              />
            ))}
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Used as the accent color on the share page and in PDF exports.
        </p>
      </div>

      {/* Logo URL */}
      <div className="space-y-3">
        <Label>Logo URL (optional)</Label>
        <div className="flex items-start gap-3">
          {logoUrl && isValidLogo ? (
            <div className="size-14 rounded-lg border border-foreground/15 bg-white/95 dark:bg-card flex items-center justify-center overflow-hidden shrink-0 p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt=""
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.opacity = "0.2";
                }}
              />
            </div>
          ) : (
            <div className="size-14 rounded-lg border border-dashed border-foreground/15 flex items-center justify-center shrink-0 text-muted-foreground">
              <ImageIcon className="size-5" />
            </div>
          )}
          <div className="flex-1">
            <Input
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://yourdomain.com/logo.png"
              type="url"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              Paste a hosted image URL. Recommended: square or 2:1 ratio, PNG with
              transparency.
            </p>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="rounded-xl border border-foreground/10 bg-foreground/[0.02] p-5">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3">
          Preview
        </p>
        <div
          className="rounded-lg p-4 flex items-center justify-between gap-3 bg-card border border-foreground/10"
          style={{ borderLeft: `4px solid ${isValidHex ? color : DEFAULT_COLOR}` }}
        >
          <div className="flex items-center gap-3 min-w-0">
            {logoUrl && isValidLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoUrl}
                alt=""
                className="h-7 w-auto max-w-[120px] object-contain"
              />
            ) : (
              <Image
                src="/proponiq-icon-dark.png"
                alt=""
                width={28}
                height={28}
                className="h-7 w-7 block dark:hidden"
              />
            )}
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">
                Proposal for Vortex Studios
              </div>
              <div className="text-xs text-muted-foreground">$8,500 fixed</div>
            </div>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-full text-xs font-medium text-white shrink-0"
            style={{ background: isValidHex ? color : DEFAULT_COLOR }}
          >
            Accept & sign
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={save}
          disabled={saving || !hasChanges || !isValidHex || !isValidLogo}
        >
          {saving ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving…
            </>
          ) : (
            "Save branding"
          )}
        </Button>
      </div>
    </section>
  );
}
