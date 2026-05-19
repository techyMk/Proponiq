import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getStripe, stripeEnabled } from "@/lib/stripe";
import { PRICE_IDS } from "@/lib/plans";

export const runtime = "nodejs";

const schema = z.object({
  plan: z.enum(["PRO", "AGENCY"]),
  interval: z.enum(["monthly", "yearly"]),
});

export async function POST(req: Request) {
  if (!stripeEnabled) {
    return NextResponse.json(
      { error: "Billing is not configured. Add STRIPE_SECRET_KEY to .env." },
      { status: 503 }
    );
  }

  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
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
    return NextResponse.json({ error: "Invalid input" }, { status: 422 });
  }

  const priceId = PRICE_IDS[parsed.data.plan][parsed.data.interval];
  if (!priceId) {
    return NextResponse.json(
      { error: `Price not configured for ${parsed.data.plan} ${parsed.data.interval}` },
      { status: 503 }
    );
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { stripeCustomerId: true, email: true },
  });
  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const stripe = getStripe();
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  try {
    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      customer: user.stripeCustomerId ?? undefined,
      customer_email: user.stripeCustomerId ? undefined : user.email,
      client_reference_id: session.user.id,
      metadata: { userId: session.user.id },
      subscription_data: {
        metadata: { userId: session.user.id },
      },
      success_url: `${appUrl}/settings?billing=success`,
      cancel_url: `${appUrl}/settings?billing=cancelled`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: checkout.url });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Stripe checkout failed";
    console.error("[stripe/checkout] failed", {
      message,
      plan: parsed.data.plan,
      interval: parsed.data.interval,
      priceId,
      hasCustomer: Boolean(user.stripeCustomerId),
    });
    return NextResponse.json(
      { error: message, hint: "Check the Vercel function logs for /api/stripe/checkout" },
      { status: 500 }
    );
  }
}
