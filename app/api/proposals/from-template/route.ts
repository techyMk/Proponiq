import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getTemplate } from "@/lib/templates";
import { checkProposalQuota } from "@/lib/quota";

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

  // Replace [Client Name] placeholder in title + content
  const clientName = parsed.data.clientName.trim();
  const title =
    parsed.data.title?.trim() ||
    template.defaultTitle.replace(/\[Client Name\]/gi, clientName);

  const content = JSON.parse(
    JSON.stringify(template.content).replace(/\[Client Name\]/gi, clientName)
  );

  const proposal = await db.proposal.create({
    data: {
      userId: session.user.id,
      title,
      clientName,
      content,
      amount: template.defaultAmount ?? null,
      currency: "USD",
    },
  });

  return NextResponse.json(proposal, { status: 201 });
}
