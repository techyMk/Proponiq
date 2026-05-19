"use client";

import * as React from "react";
import { BubbleMenu, type Editor } from "@tiptap/react";
import {
  Sparkles,
  Scissors,
  Expand,
  Wand2,
  CheckCheck,
  Loader2,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Action =
  | "improve"
  | "tighten"
  | "expand"
  | "tone:professional"
  | "tone:warm"
  | "tone:bold"
  | "tone:casual"
  | "fix";

const PRIMARY_ACTIONS: { value: Action; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: "improve", label: "Improve writing", icon: Wand2 },
  { value: "tighten", label: "Tighten", icon: Scissors },
  { value: "expand", label: "Expand", icon: Expand },
  { value: "fix", label: "Fix grammar & spelling", icon: CheckCheck },
];

const TONE_ACTIONS: { value: Action; label: string }[] = [
  { value: "tone:professional", label: "Professional" },
  { value: "tone:warm", label: "Warm" },
  { value: "tone:bold", label: "Bold" },
  { value: "tone:casual", label: "Casual" },
];

type MenuState = "main" | "tone";

export function EditorAIMenu({ editor }: { editor: Editor }) {
  const [view, setView] = React.useState<MenuState>("main");
  const [loading, setLoading] = React.useState(false);

  async function runAction(action: Action) {
    if (loading) return;
    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to, " ");
    if (text.trim().length < 2) {
      toast.error("Select some text first.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/ai/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, action }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "AI request failed");
      }
      const { text: rewritten } = await res.json();
      // Restore the original selection (in case user clicked away) and replace.
      editor
        .chain()
        .focus()
        .setTextSelection({ from, to })
        .deleteSelection()
        .insertContent(toTiptapContent(rewritten))
        .run();
      toast.success("Updated by AI");
      setView("main");
    } catch (err) {
      const m = err instanceof Error ? err.message : "Something went wrong";
      toast.error(m);
    } finally {
      setLoading(false);
    }
  }

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor, from, to }) =>
        editor.isEditable && from !== to && to - from >= 2
      }
      tippyOptions={{
        duration: 120,
        placement: "top",
        offset: [0, 10],
        maxWidth: "none",
        appendTo: () => document.body,
      }}
    >
      <div
        className={cn(
          "rounded-xl border border-foreground/10 bg-card/95 backdrop-blur-xl shadow-card",
          "min-w-[220px] p-1 text-sm flex flex-col"
        )}
        onMouseDown={(e) => e.preventDefault()}
      >
        {loading ? (
          <div className="px-3 py-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin text-mint" />
            <span>Asking Proponiq AI…</span>
          </div>
        ) : view === "main" ? (
          <>
            <div className="px-3 py-2 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
              <Sparkles className="size-3 text-mint" />
              AI assistant
            </div>
            {PRIMARY_ACTIONS.map((a) => {
              const Icon = a.icon;
              return (
                <button
                  key={a.value}
                  type="button"
                  onClick={() => runAction(a.value)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-foreground/[0.06] text-left transition-colors"
                >
                  <Icon className="size-3.5 text-mint" />
                  <span>{a.label}</span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setView("tone")}
              className="flex items-center justify-between gap-2.5 px-3 py-2 rounded-lg hover:bg-foreground/[0.06] text-left transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <Wand2 className="size-3.5 text-mint" />
                <span>Change tone</span>
              </span>
              <ChevronRight className="size-3.5 text-muted-foreground" />
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setView("main")}
              className="flex items-center gap-2 px-3 py-2 text-[11px] text-muted-foreground hover:text-foreground transition"
            >
              <ArrowLeft className="size-3" />
              Back
            </button>
            {TONE_ACTIONS.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => runAction(t.value)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-foreground/[0.06] text-left transition-colors"
              >
                <span className="size-2 rounded-full bg-mint" />
                {t.label}
              </button>
            ))}
          </>
        )}
      </div>
    </BubbleMenu>
  );
}

// Convert plain text (possibly multi-paragraph, possibly with "- " bullets)
// into Tiptap ProseMirror nodes so insertContent renders nicely.
function toTiptapContent(text: string) {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const out: object[] = [];
  for (const para of paragraphs) {
    const lines = para.split(/\n/).map((l) => l.trim());
    const allBullets = lines.length > 1 && lines.every((l) => l.startsWith("- "));
    if (allBullets) {
      out.push({
        type: "bulletList",
        content: lines.map((l) => ({
          type: "listItem",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: l.replace(/^-\s+/, "") }],
            },
          ],
        })),
      });
    } else {
      out.push({
        type: "paragraph",
        content: [{ type: "text", text: para }],
      });
    }
  }
  // Single paragraph special case — return string for cleaner inline replacement
  if (out.length === 1 && (out[0] as { type: string }).type === "paragraph") {
    return text;
  }
  return out;
}
