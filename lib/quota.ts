import { db } from "@/lib/db";
import { PLAN_LIMITS } from "@/lib/plans";
import type { Plan } from "@prisma/client";

export type QuotaResult = {
  allowed: boolean;
  used: number;
  limit: number;
  plan: Plan;
};

export async function checkProposalQuota(userId: string): Promise<QuotaResult> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });
  const plan = user?.plan ?? "FREE";
  const limit = PLAN_LIMITS[plan].maxProposalsPerMonth;

  if (limit === Infinity) {
    return { allowed: true, used: 0, limit: Number.POSITIVE_INFINITY, plan };
  }

  // Count proposals created in the current calendar month
  const now = new Date();
  const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const used = await db.proposal.count({
    where: {
      userId,
      createdAt: { gte: startOfMonth },
    },
  });

  return {
    allowed: used < limit,
    used,
    limit,
    plan,
  };
}
