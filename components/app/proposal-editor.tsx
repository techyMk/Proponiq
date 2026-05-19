"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  Eye,
  Globe,
  Loader2,
  Mail,
  Send,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { SendProposalDialog } from "@/components/app/send-proposal-dialog";
import type { ProposalStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TiptapEditor } from "@/components/app/tiptap-editor";
import { cn } from "@/lib/utils";

type ProposalShape = {
  id: string;
  title: string;
  clientName: string;
  clientEmail: string | null;
  status: ProposalStatus;
  amount: string | null;
  currency: string | null;
  content: object;
  shareToken: string;
  isPublic: boolean;
  viewCount: number;
  updatedAt: string;
  signature: {
    signerName: string;
    signerEmail: string | null;
    signedAt: string;
  } | null;
};

const statusStyles: Record<ProposalStatus, string> = {
  DRAFT: "bg-foreground/[0.06] text-muted-foreground border-foreground/10",
  SENT: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  VIEWED: "bg-amber-400/10 text-amber-400 border-amber-400/30",
  SIGNED: "bg-mint/15 text-mint border-mint/30",
  ARCHIVED: "bg-foreground/[0.04] text-muted-foreground border-foreground/10",
};

export function ProposalEditor({
  proposal,
  ownerName,
  ownerEmail,
}: {
  proposal: ProposalShape;
  ownerName: string | null;
  ownerEmail: string | null;
}) {
  const router = useRouter();

  const [title, setTitle] = React.useState(proposal.title);
  const [clientName, setClientName] = React.useState(proposal.clientName);
  const [clientEmail, setClientEmail] = React.useState(proposal.clientEmail ?? "");
  const [amount, setAmount] = React.useState(proposal.amount ?? "");
  const [status, setStatus] = React.useState<ProposalStatus>(proposal.status);
  const [isPublic, setIsPublic] = React.useState(proposal.isPublic);
  const [content, setContent] = React.useState<object>(proposal.content);

  const [saving, setSaving] = React.useState(false);
  const [savedAt, setSavedAt] = React.useState<Date | null>(
    new Date(proposal.updatedAt)
  );

  const initialSnapshot = React.useRef(JSON.stringify({
    title, clientName, clientEmail, amount, status, isPublic, content,
  }));

  const save = React.useCallback(
    async (patch: Record<string, unknown>) => {
      setSaving(true);
      try {
        const res = await fetch(`/api/proposals/${proposal.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
        if (!res.ok) throw new Error("Save failed");
        setSavedAt(new Date());
      } catch {
        toast.error("Couldn't save. Check your connection.");
      } finally {
        setSaving(false);
      }
    },
    [proposal.id]
  );

  // Debounced autosave on field changes
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(() => {
    const snapshot = JSON.stringify({
      title, clientName, clientEmail, amount, status, isPublic, content,
    });
    if (snapshot === initialSnapshot.current) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      save({
        title,
        clientName,
        clientEmail: clientEmail || null,
        amount: amount || null,
        status,
        isPublic,
        content,
      });
    }, 800);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [title, clientName, clientEmail, amount, status, isPublic, content, save]);

  function publish() {
    if (isPublic) {
      copyShareLink();
      return;
    }
    setIsPublic(true);
    setStatus(status === "DRAFT" ? "SENT" : status);
    toast.success("Proposal published — share link is live.");
  }

  function copyShareLink() {
    const url = `${window.location.origin}/p/${proposal.shareToken}`;
    navigator.clipboard.writeText(url);
    toast.success("Share link copied to clipboard");
  }

  async function remove() {
    if (!confirm("Delete this proposal? This cannot be undone.")) return;
    const res = await fetch(`/api/proposals/${proposal.id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Proposal deleted");
      router.push("/proposals");
      router.refresh();
    } else {
      toast.error("Couldn't delete");
    }
  }

  // Avoid hydration mismatch: render relative path on the server,
  // upgrade to absolute URL after mount.
  const [shareUrl, setShareUrl] = React.useState(`/p/${proposal.shareToken}`);
  React.useEffect(() => {
    setShareUrl(`${window.location.origin}/p/${proposal.shareToken}`);
  }, [proposal.shareToken]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
      {/* Main */}
      <div className="space-y-4 min-w-0">
        <div className="flex items-center gap-3">
          <Button asChild size="sm" variant="ghost">
            <Link href="/proposals">
              <ArrowLeft className="size-4" />
              All proposals
            </Link>
          </Button>
          <SaveIndicator saving={saving} savedAt={savedAt} />
        </div>

        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Proposal title"
          className="h-auto text-2xl md:text-3xl font-display font-semibold tracking-tight px-4 py-3 bg-transparent border-transparent focus-visible:border-mint/40 focus-visible:bg-card"
        />

        <TiptapEditor
          initialContent={content}
          onChange={(json) => setContent(json)}
        />
      </div>

      {/* Sidebar */}
      <aside className="space-y-4">
        <div className="rounded-2xl border border-foreground/10 bg-card p-5 space-y-4">
          <div>
            <Label>Status</Label>
            <div className="mt-2 grid grid-cols-2 gap-1">
              {(["DRAFT", "SENT", "VIEWED", "SIGNED"] as ProposalStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={cn(
                    "px-2 py-1.5 rounded-lg text-[11px] border transition",
                    status === s
                      ? statusStyles[s]
                      : "border-foreground/10 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {s[0] + s.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Client</Label>
            <Input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Client name"
            />
            <Input
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="client@email.com"
              type="email"
            />
          </div>

          <div className="space-y-2">
            <Label>Investment</Label>
            <Input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="$8,500 fixed"
            />
          </div>
        </div>

        <SendProposalDialog
          proposalId={proposal.id}
          defaultTo={clientEmail || null}
          ownerEmail={ownerEmail}
          defaultClientName={clientName}
          proposalTitle={title}
          senderName={ownerName}
          onSent={() => {
            setIsPublic(true);
            if (status === "DRAFT") setStatus("SENT");
          }}
          trigger={
            <button
              type="button"
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-mint text-navy h-11 text-sm font-medium hover:bg-cyan-glow transition shadow-[0_8px_30px_-8px_rgba(32,214,181,0.5)]"
            >
              <Mail className="size-4" />
              Send to client
            </button>
          }
        />

        <div className="rounded-2xl border border-foreground/10 bg-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Public share link</Label>
            <button
              type="button"
              onClick={() => setIsPublic((v) => !v)}
              role="switch"
              aria-checked={isPublic}
              className={cn(
                "relative inline-flex h-5 w-9 items-center rounded-full transition",
                isPublic ? "bg-mint" : "bg-foreground/15"
              )}
            >
              <span
                className={cn(
                  "inline-block size-4 transform rounded-full bg-white transition",
                  isPublic ? "translate-x-[18px]" : "translate-x-0.5"
                )}
              />
            </button>
          </div>
          {isPublic ? (
            <>
              <div className="flex items-center gap-2 rounded-lg border border-foreground/10 bg-background/50 px-3 py-2">
                <Globe className="size-3.5 text-mint shrink-0" />
                <span className="text-[11px] text-muted-foreground truncate">
                  {shareUrl}
                </span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" className="flex-1" onClick={copyShareLink}>
                  <Copy className="size-3.5" />
                  Copy
                </Button>
                <Button asChild size="sm" variant="secondary" className="flex-1">
                  <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="size-3.5" />
                    Open
                  </a>
                </Button>
              </div>
            </>
          ) : (
            <p className="text-xs text-muted-foreground leading-relaxed">
              Turn on to generate a public link your client can open without an
              account.
            </p>
          )}

          <div className="pt-3 border-t border-foreground/10 flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <Eye className="size-3.5" />
              {proposal.viewCount} {proposal.viewCount === 1 ? "view" : "views"}
            </span>
            <Button size="sm" variant="primary" onClick={publish}>
              <Send className="size-3.5" />
              {isPublic ? "Copy link" : "Publish"}
            </Button>
          </div>
        </div>

        {proposal.signature && (
          <div className="rounded-2xl border border-mint/30 bg-gradient-to-br from-mint/[0.06] to-transparent p-5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-mint" />
              <span className="text-xs font-semibold">Signed</span>
            </div>
            <p
              className="mt-3 font-display text-xl text-foreground"
              style={{ fontStyle: "italic" }}
            >
              {proposal.signature.signerName}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {new Date(proposal.signature.signedAt).toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
            {proposal.signature.signerEmail && (
              <p className="text-[11px] text-muted-foreground truncate">
                {proposal.signature.signerEmail}
              </p>
            )}
            <p className="mt-3 pt-3 border-t border-foreground/10 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <ShieldCheck className="size-3 text-mint" />
              Audit log captured
            </p>
          </div>
        )}

        <a
          href={`/api/proposals/${proposal.id}/pdf`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2.5 text-xs text-muted-foreground hover:text-foreground border border-foreground/10 hover:border-foreground/20 rounded-xl transition"
        >
          <Download className="size-3.5" />
          Download as PDF
        </a>

        <button
          type="button"
          onClick={remove}
          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition"
        >
          <Trash2 className="size-3.5" />
          Delete proposal
        </button>
      </aside>
    </div>
  );
}

function SaveIndicator({
  saving,
  savedAt,
}: {
  saving: boolean;
  savedAt: Date | null;
}) {
  if (saving) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <Loader2 className="size-3.5 animate-spin" />
        Saving…
      </span>
    );
  }
  if (savedAt) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
        <Check className="size-3.5 text-mint" />
        Saved
      </span>
    );
  }
  return null;
}
