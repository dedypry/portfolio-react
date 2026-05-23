"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const idSchema = z.string().cuid();

async function requireSession() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
}

/**
 * Approve a pending/rejected/spam comment so it shows up publicly.
 * No-ops if the comment is already approved.
 */
export async function approveComment(rawId: string) {
  await requireSession();
  const id = idSchema.parse(rawId);

  await prisma.comment.update({
    where: { id },
    data: { status: "APPROVED" },
  });

  revalidatePath("/admin/comments");
  // Bust the public blog cache too — the new approved comment should appear
  // on the next page render.
  revalidatePath("/", "layout");
}

/** Reject a comment (keep the row for audit, but hide from public). */
export async function rejectComment(rawId: string) {
  await requireSession();
  const id = idSchema.parse(rawId);

  await prisma.comment.update({
    where: { id },
    data: { status: "REJECTED" },
  });

  revalidatePath("/admin/comments");
  revalidatePath("/", "layout");
}

/** Mark as spam (also hides from public; used to train future filters). */
export async function markSpam(rawId: string) {
  await requireSession();
  const id = idSchema.parse(rawId);

  await prisma.comment.update({
    where: { id },
    data: { status: "SPAM" },
  });

  revalidatePath("/admin/comments");
  revalidatePath("/", "layout");
}

/**
 * Permanently delete a comment + all of its replies (cascade in schema).
 * Use sparingly — for clearly malicious content you want gone for good.
 */
export async function deleteComment(rawId: string) {
  await requireSession();
  const id = idSchema.parse(rawId);

  await prisma.comment.delete({ where: { id } });

  revalidatePath("/admin/comments");
  revalidatePath("/", "layout");
}
