import type { Plan } from "@prisma/client";

export type PlanKey = "FREE" | "PRO" | "AGENCY";
export type Interval = "monthly" | "yearly";

export const PLAN_LIMITS = {
  FREE: {
    maxProposalsPerMonth: 5,
    aiDraft: true,
    customBranding: false,
    teamSeats: 1,
  },
  PRO: {
    maxProposalsPerMonth: Infinity,
    aiDraft: true,
    customBranding: false,
    teamSeats: 1,
  },
  AGENCY: {
    maxProposalsPerMonth: Infinity,
    aiDraft: true,
    customBranding: true,
    teamSeats: 10,
  },
} as const;

export type PaidPlan = "PRO" | "AGENCY";

type PriceMap = Record<PaidPlan, Record<Interval, string | undefined>>;

export const PRICE_IDS: PriceMap = {
  PRO: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
    yearly: process.env.STRIPE_PRICE_PRO_YEARLY,
  },
  AGENCY: {
    monthly: process.env.STRIPE_PRICE_AGENCY_MONTHLY,
    yearly: process.env.STRIPE_PRICE_AGENCY_YEARLY,
  },
};

export function priceIdToPlan(priceId: string): PaidPlan | null {
  for (const plan of ["PRO", "AGENCY"] as PaidPlan[]) {
    for (const interval of ["monthly", "yearly"] as Interval[]) {
      if (PRICE_IDS[plan][interval] === priceId) return plan;
    }
  }
  return null;
}

export function isPaid(plan: Plan): boolean {
  return plan === "PRO" || plan === "AGENCY";
}
