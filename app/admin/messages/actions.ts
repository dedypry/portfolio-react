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
 * Toggle a message between READ and UNREAD. Sets/unsets `readAt` so we can
 * tell the difference between "never opened" and "opened then re-flagged".
 */
export async function toggleRead(rawId: string, makeRead: boolean) {
  await requireSession();
  const id = idSchema.parse(rawId);

  await prisma.message.update({
    where: { id },
    data: {
      status: makeRead ? "READ" : "UNREAD",
      readAt: makeRead ? new Date() : null,
    },
  });

  revalidatePath("/admin/messages");
  revalidatePath("/admin", "layout");
}

/** Move a message to ARCHIVED (out of the main inbox view). */
export async function archiveMessage(rawId: string) {
  await requireSession();
  const id = idSchema.parse(rawId);

  await prisma.message.update({
    where: { id },
    data: { status: "ARCHIVED" },
  });

  revalidatePath("/admin/messages");
  revalidatePath("/admin", "layout");
}

/** Restore an archived/unread message back to UNREAD inbox. */
export async function restoreMessage(rawId: string) {
  await requireSession();
  const id = idSchema.parse(rawId);

  await prisma.message.update({
    where: { id },
    data: { status: "UNREAD", readAt: null },
  });

  revalidatePath("/admin/messages");
  revalidatePath("/admin", "layout");
}

/** Permanently delete a message. */
export async function deleteMessage(rawId: string) {
  await requireSession();
  const id = idSchema.parse(rawId);

  await prisma.message.delete({ where: { id } });

  revalidatePath("/admin/messages");
  revalidatePath("/admin", "layout");
}

/**
 * Mark every UNREAD message as READ. Useful "inbox zero" button after a
 * bulk review.
 */
export async function markAllRead() {
  await requireSession();

  await prisma.message.updateMany({
    where: { status: "UNREAD" },
    data: { status: "READ", readAt: new Date() },
  });

  revalidatePath("/admin/messages");
  revalidatePath("/admin", "layout");
}
