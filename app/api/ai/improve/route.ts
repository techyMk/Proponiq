import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { improveText } from "@/lib/text-ai";

export const runtime = "nodejs";
export const maxDuration = 30;

const schema = z.object({
  text: z.string().min(2).max(4000),
  action: z.enum([
    "improve",
    "tighten",
    "expand",
    "tone:professional",
    "tone:warm",
    "tone:bold",
    "tone:casual",
    "fix",
  ]),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  try {
    const result = await improveText(parsed.data.text, parsed.data.action);
    return NextResponse.json({ text: result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI request failed";
    console.error("[ai/improve] failed", message);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
