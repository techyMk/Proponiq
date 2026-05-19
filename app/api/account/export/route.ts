import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [user, proposals] = await Promise.all([
    db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        createdAt: true,
        userType: true,
        businessName: true,
        headline: true,
        services: true,
        onboardedAt: true,
        plan: true,
      },
    }),
    db.proposal.findMany({
      where: { userId: session.user.id },
      include: {
        views: true,
        signatures: true,
      },
    }),
  ]);

  const payload = {
    exportedAt: new Date().toISOString(),
    user,
    proposals,
  };

  const filename = `proponiq-export-${new Date().toISOString().slice(0, 10)}.json`;
  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
