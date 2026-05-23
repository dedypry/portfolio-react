/**
 * Aggregated notification data for the admin top bar bell.
 *
 * Single Promise.all so the layout fetches everything in one round-trip.
 * All errors are swallowed individually — a flaky DB shouldn't blank the
 * notification UI.
 */
import "server-only";

import { prisma } from "@/lib/prisma";

export interface AdminNotificationItem {
  id: string;
  /** Discriminator for icon + colour. */
  kind: "comment_pending" | "comment_new" | "message_unread";
  title: string;
  preview: string;
  href: string;
  createdAt: Date;
}

export interface AdminNotifications {
  /** Things the admin should action: pending comments + unread messages. */
  actionable: AdminNotificationItem[];
  /** Recent activity (informational): newly approved comments. */
  recent: AdminNotificationItem[];
  /** Aggregate counts used by the bell badge + dashboard stats. */
  counts: {
    pendingComments: number;
    unreadMessages: number;
    /** Total things needing attention right now (drives the red dot). */
    actionableTotal: number;
    /** Comments approved in the last 24h that the admin hasn't seen the page for. */
    recentApprovedComments: number;
  };
}

const RECENT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

const truncate = (text: string, max: number) =>
  text.length <= max ? text : text.slice(0, max - 1).trimEnd() + "…";

const safe = async <T>(run: () => Promise<T>, fallback: T): Promise<T> => {
  try {
    return await run();
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[adminNotifications] query failed:", err);
    }
    return fallback;
  }
};

export async function getAdminNotifications(): Promise<AdminNotifications> {
  const recentSince = new Date(Date.now() - RECENT_WINDOW_MS);

  const [
    pendingCommentsRaw,
    unreadMessagesRaw,
    recentApprovedRaw,
    pendingCommentsCount,
    unreadMessagesCount,
    recentApprovedCount,
  ] = await Promise.all([
    safe(
      () =>
        prisma.comment.findMany({
          where: { status: "PENDING" },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            authorName: true,
            body: true,
            createdAt: true,
            blog: { select: { slug: true } },
          },
        }),
      []
    ),
    safe(
      () =>
        prisma.message.findMany({
          where: { status: "UNREAD" },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            name: true,
            subject: true,
            body: true,
            createdAt: true,
          },
        }),
      []
    ),
    safe(
      () =>
        // Newly approved (auto-approved by AI, or manual) — informational.
        // Filter out AI replies so the admin sees visitor activity, not its
        // own bot's replies.
        prisma.comment.findMany({
          where: {
            status: "APPROVED",
            isAiReply: false,
            createdAt: { gte: recentSince },
          },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            authorName: true,
            body: true,
            createdAt: true,
            blog: { select: { slug: true } },
          },
        }),
      []
    ),
    safe(() => prisma.comment.count({ where: { status: "PENDING" } }), 0),
    safe(() => prisma.message.count({ where: { status: "UNREAD" } }), 0),
    safe(
      () =>
        prisma.comment.count({
          where: {
            status: "APPROVED",
            isAiReply: false,
            createdAt: { gte: recentSince },
          },
        }),
      0
    ),
  ]);

  const actionable: AdminNotificationItem[] = [];

  for (const c of pendingCommentsRaw) {
    actionable.push({
      id: `pending-${c.id}`,
      kind: "comment_pending",
      title: `${c.authorName} — needs review`,
      preview: truncate(c.body, 90),
      href: `/admin/comments?status=PENDING`,
      createdAt: c.createdAt,
    });
  }

  for (const m of unreadMessagesRaw) {
    actionable.push({
      id: `msg-${m.id}`,
      kind: "message_unread",
      title: m.subject?.trim() || `Message from ${m.name}`,
      preview: truncate(`${m.name}: ${m.body}`, 90),
      href: `/admin/messages?status=UNREAD`,
      createdAt: m.createdAt,
    });
  }

  // Newest first across both kinds.
  actionable.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const recent: AdminNotificationItem[] = recentApprovedRaw.map((c) => ({
    id: `approved-${c.id}`,
    kind: "comment_new",
    title: `${c.authorName} commented`,
    preview: truncate(c.body, 90),
    href: `/admin/comments?status=APPROVED`,
    createdAt: c.createdAt,
  }));

  return {
    actionable,
    recent,
    counts: {
      pendingComments: pendingCommentsCount,
      unreadMessages: unreadMessagesCount,
      actionableTotal: pendingCommentsCount + unreadMessagesCount,
      recentApprovedComments: recentApprovedCount,
    },
  };
}
