"use client";

import * as React from "react";
import { toast } from "sonner";
import { Mail, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

export function SendProposalDialog({
  proposalId,
  defaultTo,
  defaultClientName,
  proposalTitle,
  senderName,
  trigger,
  onSent,
}: {
  proposalId: string;
  defaultTo: string | null;
  defaultClientName: string;
  proposalTitle: string;
  senderName: string | null;
  trigger: React.ReactNode;
  onSent?: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [to, setTo] = React.useState(defaultTo ?? "");
  const [subject, setSubject] = React.useState(
    `${senderName ? `${senderName} sent you a proposal — ` : ""}${proposalTitle}`
  );
  const [message, setMessage] = React.useState(
    `Hi ${defaultClientName},\n\nHere's the proposal we discussed. You can review, ask questions, and sign right from the page — no account needed.\n\nLet me know if anything needs adjusting.\n\nThanks,\n${senderName ?? ""}`
  );
  const [sending, setSending] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to.trim())) {
      toast.error("Enter a valid client email.");
      return;
    }
    setSending(true);
    try {
      const res = await fetch(`/api/proposals/${proposalId}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: to.trim(),
          subject: subject.trim(),
          message: message.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not send");
      }
      toast.success("Proposal sent!");
      onSent?.();
      setOpen(false);
    } catch (err) {
      const m = err instanceof Error ? err.message : "Something went wrong";
      toast.error(m);
    } finally {
      setSending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {React.cloneElement(trigger as React.ReactElement, {
        onClick: () => setOpen(true),
      } as React.HTMLAttributes<HTMLElement>)}

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="size-4 text-mint" />
            Send proposal by email
          </DialogTitle>
          <DialogDescription>
            We&apos;ll publish your share link and send the proposal to the client
            in one step.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>
              To <span className="text-mint">*</span>
            </Label>
            <Input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="client@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Subject</Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Your proposal"
            />
          </div>

          <div className="space-y-2">
            <Label>Personal note</Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
            />
            <p className="text-[11px] text-muted-foreground">
              The proposal will be linked from the email — you don&apos;t need to
              include the link manually.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-foreground/10">
            <DialogClose asChild>
              <Button type="button" variant="ghost" size="sm">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="primary" size="sm" disabled={sending}>
              {sending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  Send proposal
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
