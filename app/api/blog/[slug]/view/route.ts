import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { markViewedOnce } from "@/lib/blogTracking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Increment a blog's view counter. Cookie-deduped per visitor for 24 hours,
 * so refreshes from the same browser don't inflate the number. Returns the
 * (possibly unchanged) current view count.
 */
export async function POST(
  _req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  const blog = await prisma.blog.findUnique({
    where: { slug },
    select: { id: true, status: true, viewCount: true },
  });

  if (!blog || blog.status !== "PUBLISHED") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const alreadyCounted = await markViewedOnce(blog.id);
  if (alreadyCounted) {
    return NextResponse.json({ viewCount: blog.viewCount, counted: false });
  }

  const updated = await prisma.blog.update({
    where: { id: blog.id },
    data: { viewCount: { increment: 1 } },
    select: { viewCount: true },
  });

  return NextResponse.json({ viewCount: updated.viewCount, counted: true });
}
