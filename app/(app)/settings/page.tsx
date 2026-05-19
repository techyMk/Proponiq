import { redirect } from "next/navigation";
import Image from "next/image";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { BillingCard } from "@/components/app/billing-card";
import { DangerZone } from "@/components/app/danger-zone";

export const dynamic = "force-dynamic";

const USER_TYPE_LABELS: Record<string, string> = {
  FREELANCER: "Freelancer",
  AGENCY: "Agency",
  CONSULTANT: "Consultant",
  IN_HOUSE: "In-house",
  OTHER: "Other",
};

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const now = new Date();
  const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

  const [user, proposalCount, proposalsThisMonth] = await Promise.all([
    db.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        image: true,
        createdAt: true,
        userType: true,
        businessName: true,
        headline: true,
        services: true,
        plan: true,
        stripeSubscriptionId: true,
        stripeCurrentPeriodEnd: true,
      },
    }),
    db.proposal.count({ where: { userId: session.user.id } }),
    db.proposal.count({
      where: { userId: session.user.id, createdAt: { gte: startOfMonth } },
    }),
  ]);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Account info, billing, and workspace preferences.
        </p>
      </div>

      <section className="rounded-2xl border border-foreground/10 bg-card p-6 space-y-4">
        <h2 className="font-display text-lg font-semibold">Profile</h2>
        <div className="flex items-center gap-4">
          {user?.image ? (
            <Image
              src={user.image}
              alt={user.name ?? "Profile"}
              width={56}
              height={56}
              className="size-14 rounded-full object-cover ring-2 ring-mint/30"
            />
          ) : (
            <div className="size-14 rounded-full bg-mint/15 text-mint flex items-center justify-center font-semibold">
              {(user?.name?.[0] ?? user?.email?.[0] ?? "?").toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <div className="font-medium truncate">{user?.name}</div>
            <div className="text-sm text-muted-foreground truncate">{user?.email}</div>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-3 pt-3 border-t border-foreground/10">
          <Detail label="Member since">
            {user?.createdAt?.toLocaleDateString()}
          </Detail>
          <Detail label="Total proposals">{proposalCount}</Detail>
        </dl>
      </section>

      <BillingCard
        plan={user?.plan ?? "FREE"}
        hasSubscription={Boolean(user?.stripeSubscriptionId)}
        periodEnd={user?.stripeCurrentPeriodEnd?.toISOString() ?? null}
        proposalsUsedThisMonth={proposalsThisMonth}
      />

      <section className="rounded-2xl border border-foreground/10 bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Your work</h2>
          {user?.userType && (
            <span className="inline-block px-2.5 py-1 rounded-full text-[11px] bg-mint/10 text-mint border border-mint/20">
              {USER_TYPE_LABELS[user.userType]}
            </span>
          )}
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {user?.businessName && (
            <Detail label="Business">{user.businessName}</Detail>
          )}
          {user?.headline && <Detail label="Headline">{user.headline}</Detail>}
        </dl>

        {user?.services && user.services.length > 0 && (
          <div className="pt-3 border-t border-foreground/10">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
              Services
            </p>
            <div className="flex flex-wrap gap-1.5">
              {user.services.map((s) => (
                <span
                  key={s}
                  className="px-2.5 py-1 rounded-full text-[11px] border border-foreground/10 bg-foreground/[0.03] text-foreground/80"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      <DangerZone />
    </div>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm font-medium mt-0.5">{children}</dd>
    </div>
  );
}
