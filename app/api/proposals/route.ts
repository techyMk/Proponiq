import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { checkProposalQuota } from "@/lib/quota";

const createSchema = z.object({
  title: z.string().min(1).max(200),
  clientName: z.string().min(1).max(120),
  clientEmail: z.string().email().optional().nullable(),
  brief: z.unknown().optional(),
  content: z.unknown(),
  amount: z.string().max(120).optional().nullable(),
  currency: z.string().max(8).optional().nullable(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const proposals = await db.proposal.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { views: true } } },
  });
  return NextResponse.json(proposals);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const quota = await checkProposalQuota(session.user.id);
  if (!quota.allowed) {
    return NextResponse.json(
      {
        error: `You've used all ${quota.limit} proposals on the Free plan this month. Upgrade to Pro for unlimited.`,
        code: "QUOTA_EXCEEDED",
        used: quota.used,
        limit: quota.limit,
      },
      { status: 402 }
    );
  }

  const proposal = await db.proposal.create({
    data: {
      userId: session.user.id,
      title: parsed.data.title,
      clientName: parsed.data.clientName,
      clientEmail: parsed.data.clientEmail ?? null,
      brief: (parsed.data.brief as object) ?? undefined,
      content: parsed.data.content as object,
      amount: parsed.data.amount ?? null,
      currency: parsed.data.currency ?? "USD",
    },
  });
  return NextResponse.json(proposal, { status: 201 });
}
