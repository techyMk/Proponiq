import { getGroq, GROQ_DEFAULT_MODEL } from "./groq";

export type ProposalBrief = {
  title: string;
  clientName: string;
  projectDescription: string;
  scope?: string;
  budget?: string;
  timeline?: string;
  tone?: "professional" | "warm" | "bold" | "casual";
  yourName?: string;
  yourRole?: string;
};

export type GeneratedProposal = {
  title: string;
  sections: { heading: string; body: string }[];
  pricingSummary?: string;
  timelineSummary?: string;
};

const SYSTEM_PROMPT = `You are an expert proposal writer for freelancers, agencies, and consultants.

You write proposals that are:
- Concise and skimmable (no fluff, no filler)
- Confident but warm
- Outcome-focused (what the client gets, not what we'll do)
- Free of corporate jargon

You ALWAYS return a single valid JSON object matching this exact shape:
{
  "title": string,
  "sections": [
    { "heading": string, "body": string }
  ],
  "pricingSummary": string,
  "timelineSummary": string
}

Rules:
- Produce 4–6 sections. Suggested order: Overview, Approach, Scope of work, Timeline, Investment, Next steps.
- Each body is plain prose (no markdown headings, no bullets unless you use plain "- " lines).
- Use the client name naturally throughout.
- Match the requested tone.
- Never include backticks, code fences, or commentary outside the JSON.`;

function buildUserPrompt(brief: ProposalBrief) {
  const tone = brief.tone ?? "professional";
  return [
    `Write a proposal with this brief.`,
    ``,
    `Project title: ${brief.title}`,
    `Client: ${brief.clientName}`,
    `Project description:`,
    brief.projectDescription.trim(),
    brief.scope ? `\nKnown scope / requirements:\n${brief.scope.trim()}` : "",
    brief.budget ? `\nBudget: ${brief.budget}` : "",
    brief.timeline ? `\nTimeline: ${brief.timeline}` : "",
    brief.yourName || brief.yourRole
      ? `\nWritten by: ${brief.yourName ?? ""}${brief.yourRole ? ` (${brief.yourRole})` : ""}`
      : "",
    `\nTone: ${tone}`,
    ``,
    `Return ONLY the JSON object as specified.`,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function generateProposal(brief: ProposalBrief): Promise<GeneratedProposal> {
  const groq = getGroq();

  const completion = await groq.chat.completions.create({
    model: GROQ_DEFAULT_MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(brief) },
    ],
    temperature: 0.6,
    max_tokens: 2000,
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0]?.message?.content?.trim();
  if (!raw) throw new Error("Groq returned an empty response");

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("AI response was not valid JSON");
  }

  return normalize(parsed, brief);
}

function normalize(input: unknown, brief: ProposalBrief): GeneratedProposal {
  const obj = (input ?? {}) as Record<string, unknown>;
  const title = typeof obj.title === "string" && obj.title.trim() ? obj.title : brief.title;
  const rawSections = Array.isArray(obj.sections) ? obj.sections : [];
  const sections = rawSections
    .map((s) => {
      const sec = s as Record<string, unknown>;
      const heading = typeof sec.heading === "string" ? sec.heading : "";
      const body = typeof sec.body === "string" ? sec.body : "";
      return { heading: heading.trim(), body: body.trim() };
    })
    .filter((s) => s.heading && s.body);

  return {
    title,
    sections: sections.length
      ? sections
      : [{ heading: "Overview", body: "Draft could not be parsed — please rewrite this section." }],
    pricingSummary: typeof obj.pricingSummary === "string" ? obj.pricingSummary : undefined,
    timelineSummary: typeof obj.timelineSummary === "string" ? obj.timelineSummary : undefined,
  };
}

// Convert generated proposal to Tiptap (ProseMirror) JSON
export function toTiptapDoc(p: GeneratedProposal) {
  const content: TiptapNode[] = [];

  content.push(heading(1, p.title));

  for (const s of p.sections) {
    content.push(heading(2, s.heading));
    // Split body by blank lines into paragraphs
    const paragraphs = s.body
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
    for (const para of paragraphs) {
      // If the paragraph contains "- " lines, render as bulletList
      const lines = para.split(/\n/).map((l) => l.trim());
      const allBullets = lines.length > 1 && lines.every((l) => l.startsWith("- "));
      if (allBullets) {
        content.push({
          type: "bulletList",
          content: lines.map((l) => ({
            type: "listItem",
            content: [paragraph(l.replace(/^-\s+/, ""))],
          })),
        });
      } else {
        content.push(paragraph(para));
      }
    }
  }

  if (p.pricingSummary) {
    content.push(heading(2, "Investment"));
    content.push(paragraph(p.pricingSummary));
  }
  if (p.timelineSummary) {
    content.push(heading(2, "Timeline"));
    content.push(paragraph(p.timelineSummary));
  }

  return { type: "doc", content };
}

type TiptapNode =
  | { type: "heading"; attrs: { level: number }; content: TiptapNode[] }
  | { type: "paragraph"; content?: TiptapNode[] }
  | { type: "text"; text: string }
  | { type: "bulletList"; content: TiptapNode[] }
  | { type: "listItem"; content: TiptapNode[] };

function heading(level: number, text: string): TiptapNode {
  return { type: "heading", attrs: { level }, content: [{ type: "text", text }] };
}
function paragraph(text: string): TiptapNode {
  return { type: "paragraph", content: [{ type: "text", text }] };
}
