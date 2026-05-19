import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const schema = z.object({
  userType: z.enum(["FREELANCER", "AGENCY", "CONSULTANT", "IN_HOUSE", "OTHER"]),
  businessName: z.string().trim().max(120).optional().or(z.literal("")),
  headline: z.string().trim().max(160).optional().or(z.literal("")),
  services: z.array(z.string().max(60)).max(20).optional().default([]),
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

  const updated = await db.user.update({
    where: { id: session.user.id },
    data: {
      userType: parsed.data.userType,
      businessName: parsed.data.businessName?.trim() || null,
      headline: parsed.data.headline?.trim() || null,
      services: parsed.data.services ?? [],
      onboardedAt: new Date(),
    },
    select: { id: true, onboardedAt: true },
  });

  return NextResponse.json(updated);
}
