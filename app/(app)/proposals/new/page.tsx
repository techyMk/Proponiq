import { NewProposalTabs } from "@/components/app/new-proposal-tabs";
import { TEMPLATES } from "@/lib/templates";

export default function NewProposalPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
          New proposal
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Start with AI or pick a template. You can edit everything afterwards.
        </p>
      </div>

      <NewProposalTabs templates={TEMPLATES} />
    </div>
  );
}
