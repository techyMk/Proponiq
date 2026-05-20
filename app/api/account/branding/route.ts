import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export const runtime = "nodejs";

const hexColor = z
  .string()
  .trim()
  .regex(/^#[0-9a-fA-F]{6}$/, "Use a 6-digit hex like #20D6B5");

const urlOrEmpty = z
  .string()
  .trim()
  .max(500)
  .refine(
    (v) => v === "" || /^https?:\/\/.+/i.test(v),
    "Must be a full https:// URL"
  );

const schema = z.object({
  brandColor: z.union([hexColor, z.literal("")]).optional(),
  brandLogoUrl: urlOrEmpty.optional(),
});

export async function PATCH(req: Request) {
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
      ...(parsed.data.brandColor !== undefined && {
        brandColor: parsed.data.brandColor.trim() || null,
      }),
      ...(parsed.data.brandLogoUrl !== undefined && {
        brandLogoUrl: parsed.data.brandLogoUrl.trim() || null,
      }),
    },
    select: { brandColor: true, brandLogoUrl: true },
  });

  return NextResponse.json(updated);
}
