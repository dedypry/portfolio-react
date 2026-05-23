import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Recognised share channels. We accept "other" so the UI can record
// generic Web Share API uses or copy-link without creating a new endpoint.
const bodySchema = z
  .object({
    channel: z
      .enum(["twitter", "facebook", "linkedin", "whatsapp", "copy", "other"])
      .optional(),
  })
  .optional();

/**
 * Record a share event. We only bump the total counter (not per-channel) to
 * keep the schema simple — if you want a breakdown later, add a SharedEvent
 * model and write to both.
 */
export async function POST(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  // Parse defensively — most callers send {} or no body at all.
  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await req.json().catch(() => ({})));
  } catch {
    body = undefined;
  }

  const blog = await prisma.blog.findUnique({
    where: { slug },
    select: { id: true, status: true },
  });
  if (!blog || blog.status !== "PUBLISHED") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.blog.update({
    where: { id: blog.id },
    data: { shareCount: { increment: 1 } },
    select: { shareCount: true },
  });

  return NextResponse.json({
    shareCount: updated.shareCount,
    channel: body?.channel ?? "other",
  });
}
