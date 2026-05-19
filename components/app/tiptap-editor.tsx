"use client";

import * as React from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
} from "lucide-react";
import { cn } from "@/lib/utils";

type TiptapEditorProps = {
  initialContent: object | null;
  onChange?: (json: object) => void;
  editable?: boolean;
  className?: string;
};

export function TiptapEditor({
  initialContent,
  onChange,
  editable = true,
  className,
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: "Start writing… or use AI to draft a section.",
      }),
      Typography,
    ],
    content: initialContent ?? { type: "doc", content: [{ type: "paragraph" }] },
    editable,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          "prose-proposal focus:outline-none",
          !editable && "pointer-events-none"
        ),
      },
    },
    onUpdate({ editor }) {
      onChange?.(editor.getJSON());
    },
  });

  if (!editor) {
    return (
      <div className="min-h-[400px] rounded-xl border border-foreground/10 bg-card animate-pulse" />
    );
  }

  return (
    <div className={cn("rounded-2xl border border-foreground/10 bg-card overflow-hidden", className)}>
      {editable && <EditorToolbar editor={editor} />}
      <div
        className={cn(
          "p-6 md:p-10",
          editable && "max-h-[70vh] overflow-y-auto"
        )}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function EditorToolbar({ editor }: { editor: Editor }) {
  const items: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    isActive?: () => boolean;
    onClick: () => void;
    separator?: boolean;
  }[] = [
    { icon: Bold, label: "Bold", isActive: () => editor.isActive("bold"), onClick: () => editor.chain().focus().toggleBold().run() },
    { icon: Italic, label: "Italic", isActive: () => editor.isActive("italic"), onClick: () => editor.chain().focus().toggleItalic().run() },
    { icon: Strikethrough, label: "Strike", isActive: () => editor.isActive("strike"), onClick: () => editor.chain().focus().toggleStrike().run() },
    { icon: Heading1, label: "H1", isActive: () => editor.isActive("heading", { level: 1 }), onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
    { icon: Heading2, label: "H2", isActive: () => editor.isActive("heading", { level: 2 }), onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { icon: Heading3, label: "H3", isActive: () => editor.isActive("heading", { level: 3 }), onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
    { icon: List, label: "Bullet list", isActive: () => editor.isActive("bulletList"), onClick: () => editor.chain().focus().toggleBulletList().run() },
    { icon: ListOrdered, label: "Numbered list", isActive: () => editor.isActive("orderedList"), onClick: () => editor.chain().focus().toggleOrderedList().run() },
    { icon: Quote, label: "Quote", isActive: () => editor.isActive("blockquote"), onClick: () => editor.chain().focus().toggleBlockquote().run() },
  ];

  return (
    <div className="flex items-center gap-0.5 px-3 py-2 border-b border-foreground/10 bg-foreground/[0.015] flex-wrap">
      {items.map((it, i) => {
        const Icon = it.icon;
        const active = it.isActive?.();
        return (
          <button
            key={i}
            type="button"
            title={it.label}
            aria-label={it.label}
            onClick={it.onClick}
            className={cn(
              "inline-flex size-8 items-center justify-center rounded-md transition",
              active
                ? "bg-mint/15 text-mint"
                : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.06]"
            )}
          >
            <Icon className="size-4" />
          </button>
        );
      })}
      <div className="mx-1 h-5 w-px bg-foreground/10" />
      <button
        type="button"
        title="Undo"
        aria-label="Undo"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-foreground/[0.06] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Undo className="size-4" />
      </button>
      <button
        type="button"
        title="Redo"
        aria-label="Redo"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-foreground/[0.06] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Redo className="size-4" />
      </button>
    </div>
  );
}
