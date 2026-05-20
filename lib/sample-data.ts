import type { ProposalStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { getTemplate } from "@/lib/templates";
import { buildContext, substitute, substituteInDoc } from "@/lib/variables";

// -----------------------------------------------------------------------------
// Sample proposals seeded to new users so the dashboard isn't empty on first
// visit. They look like real, in-progress work — one signed, one viewed, one
// still in draft — so the KPI strip and "Recent" cards have data immediately.
// -----------------------------------------------------------------------------

type Sample = {
  templateId: string;
  clientName: string;
  clientEmail: string | null;
  amount: string;
  status: ProposalStatus;
  isPublic: boolean;
  daysAgo: number;
  views?: number;
  signature?: {
    signerName: string;
    signerEmail: string;
    signedDaysAgo: number;
  };
};

const SAMPLES: Sample[] = [
  {
    templateId: "brand-identity",
    clientName: "Acme Studios",
    clientEmail: "marisol@acmestudios.com",
    amount: "$6,500 fixed",
    status: "SIGNED",
    isPublic: true,
    daysAgo: 14,
    views: 11,
    signature: {
      signerName: "Marisol Castro",
      signerEmail: "marisol@acmestudios.com",
      signedDaysAgo: 9,
    },
  },
  {
    templateId: "web-design",
    clientName: "Northwind Labs",
    clientEmail: "dan@northwind.dev",
    amount: "$8,500 fixed",
    status: "VIEWED",
    isPublic: true,
    daysAgo: 5,
    views: 4,
  },
  {
    templateId: "seo-retainer",
    clientName: "Vortex Studios",
    clientEmail: null,
    amount: "$3,200 / month",
    status: "DRAFT",
    isPublic: false,
    daysAgo: 1,
  },
];

const DAY = 24 * 60 * 60 * 1000;

export async function seedSampleProposals(userId: string) {
  // Only seed if user has zero proposals (safety against double-seeding)
  const existing = await db.proposal.count({ where: { userId } });
  if (existing > 0) return { skipped: true, count: 0 };

  const owner = await db.user.findUnique({
    where: { id: userId },
    select: { name: true, businessName: true },
  });

  let created = 0;

  for (const sample of SAMPLES) {
    const template = getTemplate(sample.templateId);
    if (!template) continue;

    const ctx = buildContext({
      clientName: sample.clientName,
      ownerName: owner?.name ?? null,
      ownerBusinessName: owner?.businessName ?? null,
      amount: sample.amount,
    });
    const title = substitute(template.defaultTitle, ctx);
    const content = substituteInDoc(template.content, ctx);

    const createdAt = new Date(Date.now() - sample.daysAgo * DAY);

    const proposal = await db.proposal.create({
      data: {
        userId,
        title,
        clientName: sample.clientName,
        clientEmail: sample.clientEmail,
        amount: sample.amount,
        currency: "USD",
        content,
        status: sample.status,
        isPublic: sample.isPublic,
        createdAt,
        updatedAt: createdAt,
      },
    });
    created++;

    if (sample.views && sample.views > 0) {
      // Spread views over the days since creation
      const viewsData = Array.from({ length: sample.views }, (_, i) => {
        const offsetMs = ((i + 1) / sample.views!) * sample.daysAgo * DAY;
        return {
          proposalId: proposal.id,
          viewedAt: new Date(createdAt.getTime() + offsetMs),
          userAgent:
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
          ip: "203.0.113.42",
        };
      });
      await db.proposalView.createMany({ data: viewsData });
    }

    if (sample.signature) {
      const signedAt = new Date(Date.now() - sample.signature.signedDaysAgo * DAY);
      await db.proposalSignature.create({
        data: {
          proposalId: proposal.id,
          signerName: sample.signature.signerName,
          signerEmail: sample.signature.signerEmail,
          signedAt,
          userAgent:
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
          ip: "203.0.113.42",
        },
      });
    }
  }

  return { skipped: false, count: created };
}
