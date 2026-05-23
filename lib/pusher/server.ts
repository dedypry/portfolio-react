/**
 * Server-side Pusher client. Used to broadcast events from API routes /
 * server actions / background jobs.
 *
 * SAFETY: never imported from a client component — that would leak the
 * secret. We export a `getPusherServer()` getter that returns null if env
 * vars are missing so callers can no-op gracefully (e.g. in dev when
 * Pusher hasn't been configured yet).
 */
import "server-only";
import Pusher from "pusher";

let cached: Pusher | null | undefined;

export function getPusherServer(): Pusher | null {
  if (cached !== undefined) return cached;

  const appId = process.env.PUSHER_APP_ID;
  const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
  const secret = process.env.PUSHER_SECRET;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

  if (!appId || !key || !secret || !cluster) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[pusher] Missing env vars; real-time broadcasts disabled. " +
          "Set PUSHER_APP_ID, PUSHER_SECRET, NEXT_PUBLIC_PUSHER_KEY, NEXT_PUBLIC_PUSHER_CLUSTER."
      );
    }
    cached = null;
    return null;
  }

  cached = new Pusher({
    appId,
    key,
    secret,
    cluster,
    useTLS: true,
  });
  return cached;
}

/** Channel name for a given blog slug. Slug is unique so no extra namespacing. */
export const blogChannel = (slug: string) => `blog-${slug}`;

export const PUSHER_EVENTS = {
  /** A comment that just got auto-approved (root or reply). */
  COMMENT_NEW: "comment:new",
  /** A comment that failed AI moderation. */
  COMMENT_REJECTED: "comment:rejected",
} as const;
