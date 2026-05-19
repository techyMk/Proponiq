import { getGroq, GROQ_DEFAULT_MODEL } from "./groq";

export type ImproveAction =
  | "improve"
  | "tighten"
  | "expand"
  | "tone:professional"
  | "tone:warm"
  | "tone:bold"
  | "tone:casual"
  | "fix";

const ACTION_INSTRUCTIONS: Record<ImproveAction, string> = {
  improve:
    "Rewrite the passage to be clearer, more confident, and more persuasive. Keep the same meaning and length.",
  tighten:
    "Tighten this passage — remove filler, redundant phrasing, and unnecessary qualifiers. Keep the same meaning. Aim for ~30% fewer words.",
  expand:
    "Expand this passage with one or two more sentences of useful detail — examples, specifics, or concrete outcomes. Match the existing tone.",
  "tone:professional":
    "Rewrite this passage in a confident, professional tone. Be polished but human. No corporate jargon.",
  "tone:warm":
    "Rewrite this passage in a warm, friendly tone. Sound like a thoughtful peer, not a marketer.",
  "tone:bold":
    "Rewrite this passage in a bold, direct tone. Strong opinions, no hedging.",
  "tone:casual":
    "Rewrite this passage in a casual, conversational tone. Contractions are fine.",
  fix: "Fix any grammar, spelling, and punctuation issues in this passage. Don't change the meaning, structure, or tone. Don't paraphrase.",
};

const SYSTEM_PROMPT = `You are a precise text editor inside a proposal-writing tool used by freelancers and agencies.

You receive a passage and an instruction. Return ONLY the rewritten passage — no preamble, no quotes around it, no explanation, no markdown formatting.

Hard rules:
- Match the language of the input.
- Match the formatting: if the input is a single paragraph, return a single paragraph. If it has bullet lines (starting with "- "), keep them.
- Never invent facts, prices, dates, names, or numbers that aren't in the source.
- Never wrap the output in quotes.
- Never start with phrases like "Sure, here is" or "Here's the rewritten version".`;

export async function improveText(
  text: string,
  action: ImproveAction
): Promise<string> {
  const instruction = ACTION_INSTRUCTIONS[action] ?? ACTION_INSTRUCTIONS.improve;

  const groq = getGroq();
  const completion = await groq.chat.completions.create({
    model: GROQ_DEFAULT_MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Instruction: ${instruction}\n\nPassage:\n${text}\n\nRewritten passage:`,
      },
    ],
    temperature: action === "fix" ? 0.1 : 0.5,
    max_tokens: Math.min(1200, Math.ceil(text.length * 1.6)),
  });

  const raw = completion.choices[0]?.message?.content?.trim();
  if (!raw) throw new Error("AI returned an empty response");

  // Strip wrapping quotes that some models occasionally add despite the prompt
  return raw.replace(/^["“”']|["“”']$/g, "").trim();
}
