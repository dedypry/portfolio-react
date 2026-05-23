"use client";

import { useTransition } from "react";
import { CheckCheck, Loader2 } from "lucide-react";

import { markAllRead } from "../actions";

interface Props {
  unreadCount: number;
}

/**
 * Top-right "mark all unread as read" shortcut. Disabled when the inbox
 * is already at zero so the click is a no-op.
 */
export function MarkAllReadButton({ unreadCount }: Props) {
  const [pending, startTransition] = useTransition();

  if (unreadCount === 0) return null;

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          try {
            await markAllRead();
          } catch (err) {
            window.alert(err instanceof Error ? err.message : "Failed");
          }
        })
      }
      className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-200 transition hover:bg-emerald-500/20 disabled:opacity-50"
    >
      {pending ? (
        <Loader2 size={12} className="animate-spin" />
      ) : (
        <CheckCheck size={12} />
      )}
      Mark all {unreadCount} as read
    </button>
  );
}
