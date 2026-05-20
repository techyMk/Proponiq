import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getTemplate } from "@/lib/templates";
import { checkProposalQuota } from "@/lib/quota";
import { buildContext, substitute, substituteInDoc } from "@/lib/variables";

const schema = z.object({
  templateId: z.string().min(1),
  clientName: z.string().min(1).max(120),
  title: z.string().min(1).max(200).optional(),
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
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const template = getTemplate(parsed.data.templateId);
  if (!template) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
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

  // Pull the owner's profile so we can fill {{your.name}} / {{your.business}}.
  const owner = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, businessName: true },
  });

  const clientName = parsed.data.clientName.trim();
  const ctx = buildContext({
    clientName,
    ownerName: owner?.name ?? null,
    ownerBusinessName: owner?.businessName ?? null,
    amount: template.defaultAmount ?? null,
  });

  const title =
    parsed.data.title?.trim() ?? substitute(template.defaultTitle, ctx);
  const content = substituteInDoc(template.content, ctx);
  const amount = template.defaultAmount
    ? substitute(template.defaultAmount, ctx)
    : null;

  const proposal = await db.proposal.create({
    data: {
      userId: session.user.id,
      title,
      clientName,
      content,
      amount,
      currency: "USD",
    },
  });

  return NextResponse.json(proposal, { status: 201 });
}
