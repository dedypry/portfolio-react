"use client";

import Pusher from "pusher-js";

/**
 * Browser-side Pusher singleton. Lazily initialised on first call so SSR
 * + the build don't try to instantiate it. Returns null if the public env
 * vars are missing — callers should treat that as "real-time disabled".
 *
 * Why singleton: each page subscribes to channels, but the underlying
 * connection should stay shared across components and across navigations.
 */
let cached: Pusher | null | undefined;

export function getPusherClient(): Pusher | null {
  if (typeof window === "undefined") return null;
  if (cached !== undefined) return cached;

  const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

  if (!key || !cluster) {
    cached = null;
    return null;
  }

  cached = new Pusher(key, {
    cluster,
    forceTLS: true,
    enabledTransports: ["ws", "wss"],
  });
  return cached;
}

export const blogChannel = (slug: string) => `blog-${slug}`;

export const PUSHER_EVENTS = {
  COMMENT_NEW: "comment:new",
  COMMENT_REJECTED: "comment:rejected",
} as const;

/** Shape of payloads broadcast on the blog channel. Mirrors the server. */
export interface PusherCommentPayload {
  id: string;
  parentId: string | null;
  authorName: string;
  authorWebsite: string | null;
  body: string;
  createdAt: string;
  isAiReply: boolean;
}

export interface PusherRejectedPayload {
  id: string;
  reason: string;
}
