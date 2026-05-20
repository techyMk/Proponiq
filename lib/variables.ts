// Lightweight mail-merge / template-variable system.
// Templates use {{namespace.key}} placeholders that are substituted at
// proposal-creation time using the owner's profile + client info.

export type VariableContext = {
  client: {
    name: string;
    firstName: string;
    email?: string | null;
  };
  your: {
    name: string;
    firstName: string;
    business: string;
  };
  date: {
    long: string;  // "May 19, 2026"
    short: string; // "05/19/26"
    iso: string;   // "2026-05-19"
  };
  amount?: string;
  timeline?: string;
};

export type VariableContextInput = {
  clientName: string;
  clientEmail?: string | null;
  ownerName?: string | null;
  ownerBusinessName?: string | null;
  amount?: string | null;
  timeline?: string | null;
  /** Optional override for the date (useful in tests). Defaults to now. */
  now?: Date;
};

export function buildContext(input: VariableContextInput): VariableContext {
  const now = input.now ?? new Date();
  const ownerName = (input.ownerName ?? "").trim();
  const clientName = (input.clientName ?? "").trim();

  return {
    client: {
      name: clientName,
      firstName: firstWord(clientName),
      email: input.clientEmail ?? null,
    },
    your: {
      name: ownerName,
      firstName: firstWord(ownerName),
      business: (input.ownerBusinessName ?? "").trim(),
    },
    date: {
      long: now.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      short: now.toLocaleDateString("en-US"),
      iso: now.toISOString().slice(0, 10),
    },
    amount: input.amount ?? undefined,
    timeline: input.timeline ?? undefined,
  };
}

function firstWord(s: string): string {
  return s.split(/\s+/)[0] ?? s;
}

// Available placeholder paths, for documentation + UI hints.
export const VARIABLES: { key: string; label: string; example: string }[] = [
  { key: "client.name", label: "Client name", example: "Vortex Studios" },
  { key: "client.firstName", label: "Client first name", example: "Vortex" },
  { key: "your.name", label: "Your name", example: "Marisol Castro" },
  { key: "your.firstName", label: "Your first name", example: "Marisol" },
  { key: "your.business", label: "Your business / studio", example: "Acme Studio" },
  { key: "date.long", label: "Today (long)", example: "May 19, 2026" },
  { key: "date.short", label: "Today (short)", example: "5/19/2026" },
  { key: "amount", label: "Proposal amount", example: "$8,500 fixed" },
  { key: "timeline", label: "Project timeline", example: "6 weeks" },
];

// -----------------------------------------------------------------------------
// String substitution
// -----------------------------------------------------------------------------

const TOKEN_REGEX = /\{\{\s*([\w.]+)\s*\}\}/g;

export function substitute(text: string, ctx: VariableContext): string {
  return text.replace(TOKEN_REGEX, (raw, path: string) => {
    const value = resolve(ctx, path);
    return value ?? raw;
  });
}

function resolve(ctx: VariableContext, path: string): string | undefined {
  const parts = path.split(".");
  let cursor: unknown = ctx;
  for (const p of parts) {
    if (cursor && typeof cursor === "object" && p in (cursor as object)) {
      cursor = (cursor as Record<string, unknown>)[p];
    } else {
      return undefined;
    }
  }
  if (cursor == null) return undefined;
  return String(cursor);
}

// -----------------------------------------------------------------------------
// ProseMirror / Tiptap JSON tree substitution
// -----------------------------------------------------------------------------

type PmNode = {
  type: string;
  text?: string;
  content?: PmNode[];
  [k: string]: unknown;
};

export function substituteInDoc<T>(doc: T, ctx: VariableContext): T {
  return walk(doc, ctx) as T;
}

function walk(value: unknown, ctx: VariableContext): unknown {
  if (Array.isArray(value)) {
    return value.map((v) => walk(v, ctx));
  }
  if (value && typeof value === "object") {
    const obj = value as PmNode;
    const out: PmNode = { ...obj };
    if (typeof obj.text === "string") {
      out.text = substitute(obj.text, ctx);
    }
    if (Array.isArray(obj.content)) {
      out.content = (obj.content as PmNode[]).map((c) => walk(c, ctx) as PmNode);
    }
    return out;
  }
  return value;
}
