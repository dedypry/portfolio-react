"use client";

import { useEffect, useRef } from "react";

/**
 * Fire-and-forget pingback that records a unique view in the DB.
 * Runs once per mount; the server side cookie-deduplicates further so
 * refreshes within 24h don't double-count.
 *
 * Renders nothing — just a side-effect component you can drop into the
 * detail page tree.
 */
export function ViewTracker({ slug }: { slug: string }) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    void fetch(`/api/blog/${encodeURIComponent(slug)}/view`, {
      method: "POST",
      keepalive: true,
    }).catch(() => {
      // Silent: a missed view is not user-facing.
    });
  }, [slug]);

  return null;
}
