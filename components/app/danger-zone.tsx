"use client";

import * as React from "react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { Download, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DangerZone() {
  const [confirm, setConfirm] = React.useState("");
  const [deleting, setDeleting] = React.useState(false);

  async function onDelete(e: React.FormEvent) {
    e.preventDefault();
    if (confirm !== "DELETE") {
      toast.error('Type "DELETE" exactly to confirm.');
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: "DELETE" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not delete account");
      }
      toast.success("Your account has been deleted.");
      await signOut({ callbackUrl: "/" });
    } catch (err) {
      const m = err instanceof Error ? err.message : "Something went wrong";
      toast.error(m);
      setDeleting(false);
    }
  }

  return (
    <section className="rounded-2xl border border-red-500/20 bg-red-500/[0.03] p-6 space-y-4">
      <div>
        <h2 className="font-display text-lg font-semibold text-red-400">
          Danger zone
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Export everything, or permanently delete your account.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button asChild variant="secondary" size="sm">
          <a href="/api/account/export" download>
            <Download className="size-3.5" />
            Export my data (JSON)
          </a>
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              <Trash2 className="size-3.5" />
              Delete my account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-red-400">
                Delete your account?
              </DialogTitle>
              <DialogDescription>
                This permanently removes your profile, all proposals, signatures
                and view history. If you have an active subscription, we&apos;ll
                cancel it. This cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={onDelete} className="space-y-4">
              <div className="space-y-2">
                <Label>
                  Type <span className="font-mono text-foreground">DELETE</span>{" "}
                  to confirm
                </Label>
                <Input
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="DELETE"
                  autoFocus
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-foreground/10">
                <DialogClose asChild>
                  <Button type="button" variant="ghost" size="sm">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  size="sm"
                  disabled={deleting || confirm !== "DELETE"}
                  className="bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Deleting…
                    </>
                  ) : (
                    <>
                      <Trash2 className="size-4" />
                      Permanently delete
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
