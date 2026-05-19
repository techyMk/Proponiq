import { NextResponse } from "next/server";
import { z } from "zod";
import { auth, signOut } from "@/auth";
import { db } from "@/lib/db";
import { getStripe, stripeEnabled } from "@/lib/stripe";

export const runtime = "nodejs";

const schema = z.object({
  confirm: z.literal("DELETE", {
    errorMap: () => ({ message: 'Type "DELETE" to confirm.' }),
  }),
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

  // Cancel Stripe subscription on best-effort basis
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { stripeSubscriptionId: true },
  });
  if (stripeEnabled && user?.stripeSubscriptionId) {
    try {
      await getStripe().subscriptions.cancel(user.stripeSubscriptionId);
    } catch (err) {
      console.warn("[account delete] failed to cancel subscription", err);
    }
  }

  // Cascading delete via Prisma onDelete: Cascade (User → Account/Session/Proposal/etc.)
  await db.user.delete({ where: { id: session.user.id } });

  // Clear the session cookie
  await signOut({ redirect: false });

  return NextResponse.json({ ok: true });
}
