import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { generateProposal, toTiptapDoc } from "@/lib/proposal-ai";

export const runtime = "nodejs";
export const maxDuration = 30;

const briefSchema = z.object({
  title: z.string().min(2).max(160),
  clientName: z.string().min(1).max(120),
  projectDescription: z.string().min(10).max(4000),
  scope: z.string().max(2000).optional(),
  budget: z.string().max(120).optional(),
  timeline: z.string().max(120).optional(),
  tone: z.enum(["professional", "warm", "bold", "casual"]).optional(),
  yourName: z.string().max(120).optional(),
  yourRole: z.string().max(120).optional(),
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

  const parsed = briefSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid brief", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  try {
    const generated = await generateProposal(parsed.data);
    const doc = toTiptapDoc(generated);
    return NextResponse.json({
      brief: parsed.data,
      generated,
      content: doc,
    });
  } catch (err) {
    console.error("[ai/draft] error", err);
    const message = err instanceof Error ? err.message : "Unknown AI error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
