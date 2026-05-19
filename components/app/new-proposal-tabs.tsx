"use client";

import * as React from "react";
import { Sparkles, LayoutTemplate } from "lucide-react";
import type { ProposalTemplate } from "@/lib/templates";
import { NewProposalForm } from "@/components/app/new-proposal-form";
import { TemplateGallery } from "@/components/app/template-gallery";
import { cn } from "@/lib/utils";

type Tab = "ai" | "template";

export function NewProposalTabs({ templates }: { templates: ProposalTemplate[] }) {
  const [tab, setTab] = React.useState<Tab>("ai");

  return (
    <div className="space-y-6">
      <div className="inline-flex items-center gap-1 p-1 rounded-full border border-foreground/10 bg-card">
        <TabButton active={tab === "ai"} onClick={() => setTab("ai")}>
          <Sparkles className="size-4" />
          AI draft
        </TabButton>
        <TabButton active={tab === "template"} onClick={() => setTab("template")}>
          <LayoutTemplate className="size-4" />
          From template
        </TabButton>
      </div>

      {tab === "ai" ? (
        <NewProposalForm />
      ) : (
        <TemplateGallery templates={templates} />
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm transition",
        active
          ? "bg-mint text-navy"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}
