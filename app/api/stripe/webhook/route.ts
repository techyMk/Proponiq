import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { db } from "@/lib/db";
import { getStripe } from "@/lib/stripe";
import { priceIdToPlan } from "@/lib/plans";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = getStripe();
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    console.error("[stripe webhook] signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;
        const userId =
          (s.metadata?.userId as string | undefined) ??
          (s.client_reference_id as string | undefined);
        if (!userId || !s.subscription || !s.customer) break;

        const sub = await stripe.subscriptions.retrieve(
          typeof s.subscription === "string" ? s.subscription : s.subscription.id
        );
        await upsertSubscription(userId, sub);
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        if (userId) await upsertSubscription(userId, sub);
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        if (userId) {
          await db.user.update({
            where: { id: userId },
            data: {
              plan: "FREE",
              stripeSubscriptionId: null,
              stripePriceId: null,
              stripeCurrentPeriodEnd: null,
            },
          });
        }
        break;
      }
      default:
        // Ignore everything else
        break;
    }
  } catch (err) {
    console.error("[stripe webhook] handler error", err);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function upsertSubscription(userId: string, sub: Stripe.Subscription) {
  const priceId = sub.items.data[0]?.price.id;
  const plan = priceId ? priceIdToPlan(priceId) ?? "FREE" : "FREE";
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;

  await db.user.update({
    where: { id: userId },
    data: {
      stripeCustomerId: customerId,
      stripeSubscriptionId: sub.id,
      stripePriceId: priceId ?? null,
      stripeCurrentPeriodEnd: new Date(sub.current_period_end * 1000),
      plan: sub.status === "active" || sub.status === "trialing" ? plan : "FREE",
    },
  });
}
