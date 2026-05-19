"use client";

import { TiptapEditor } from "@/components/app/tiptap-editor";

export function PublicProposalView({ content }: { content: object }) {
  return (
    <TiptapEditor
      initialContent={content}
      editable={false}
      className="border-foreground/5 bg-transparent shadow-none"
    />
  );
}
