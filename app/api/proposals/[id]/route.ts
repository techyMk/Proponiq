import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const patchSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  clientName: z.string().min(1).max(120).optional(),
  clientEmail: z.string().email().nullable().optional(),
  content: z.unknown().optional(),
  amount: z.string().max(120).nullable().optional(),
  currency: z.string().max(8).nullable().optional(),
  status: z.enum(["DRAFT", "SENT", "VIEWED", "SIGNED", "ARCHIVED"]).optional(),
  isPublic: z.boolean().optional(),
});

async function authorize(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" as const, status: 401 };
  const proposal = await db.proposal.findUnique({ where: { id } });
  if (!proposal) return { error: "Not found" as const, status: 404 };
  if (proposal.userId !== session.user.id)
    return { error: "Forbidden" as const, status: 403 };
  return { proposal };
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const result = await authorize(id);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json(result.proposal);
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const result = await authorize(id);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const updated = await db.proposal.update({
    where: { id },
    data: {
      ...(parsed.data.title !== undefined && { title: parsed.data.title }),
      ...(parsed.data.clientName !== undefined && { clientName: parsed.data.clientName }),
      ...(parsed.data.clientEmail !== undefined && { clientEmail: parsed.data.clientEmail }),
      ...(parsed.data.content !== undefined && { content: parsed.data.content as object }),
      ...(parsed.data.amount !== undefined && { amount: parsed.data.amount }),
      ...(parsed.data.currency !== undefined && { currency: parsed.data.currency }),
      ...(parsed.data.status !== undefined && { status: parsed.data.status }),
      ...(parsed.data.isPublic !== undefined && { isPublic: parsed.data.isPublic }),
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const result = await authorize(id);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  await db.proposal.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
