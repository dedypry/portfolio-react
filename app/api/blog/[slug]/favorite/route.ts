import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { hasFavorited, toggleFavorite } from "@/lib/blogTracking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Returns the visitor's current favorite state + total count. */
export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  const blog = await prisma.blog.findUnique({
    where: { slug },
    select: { id: true, status: true, favoriteCount: true },
  });
  if (!blog || blog.status !== "PUBLISHED") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    favoriteCount: blog.favoriteCount,
    isFavorited: await hasFavorited(blog.id),
  });
}

/**
 * Toggle the visitor's favorite. Cookie-tracked: clicking again UN-favorites
 * (and decrements the counter). The DB counter has a 0 floor so concurrent
 * stale clients can't push it negative.
 */
export async function POST(
  _req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  const blog = await prisma.blog.findUnique({
    where: { slug },
    select: { id: true, status: true, favoriteCount: true },
  });
  if (!blog || blog.status !== "PUBLISHED") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isFavoritedNow = await toggleFavorite(blog.id);

  // Guard against going negative: if the cookie was missing but they tried
  // to un-favorite (shouldn't happen via UI), `toggleFavorite` already
  // returns true (now favorited). The case below handles a stale cookie
  // where the counter was reset.
  let updated;
  if (isFavoritedNow) {
    updated = await prisma.blog.update({
      where: { id: blog.id },
      data: { favoriteCount: { increment: 1 } },
      select: { favoriteCount: true },
    });
  } else {
    updated = await prisma.blog.update({
      where: { id: blog.id },
      data: {
        favoriteCount:
          blog.favoriteCount > 0 ? { decrement: 1 } : blog.favoriteCount,
      },
      select: { favoriteCount: true },
    });
  }

  return NextResponse.json({
    favoriteCount: updated.favoriteCount,
    isFavorited: isFavoritedNow,
  });
}
