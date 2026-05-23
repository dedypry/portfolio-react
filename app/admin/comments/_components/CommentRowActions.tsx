"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, Trash2, X, AlertOctagon } from "lucide-react";

import {
  approveComment,
  deleteComment,
  markSpam,
  rejectComment,
} from "../actions";

interface Props {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SPAM";
}

/**
 * Per-row moderation toolbar. Buttons shown depend on the current status:
 *   PENDING  → Approve · Reject · Spam · Delete
 *   APPROVED → Reject · Spam · Delete
 *   REJECTED → Approve · Spam · Delete
 *   SPAM     → Approve · Delete
 */
export function CommentRowActions({ id, status }: Props) {
  const [pending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const run = (action: () => Promise<void>) => {
    startTransition(async () => {
      try {
        await action();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed";
        window.alert(msg);
      }
    });
  };

  const btn =
    "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium transition disabled:opacity-50";

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {status !== "APPROVED" && (
        <button
          type="button"
          disabled={pending}
          onClick={() => run(() => approveComment(id))}
          className={`${btn} border-emerald-400/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20`}
        >
          {pending ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
          Approve
        </button>
      )}
      {status !== "REJECTED" && status !== "SPAM" && (
        <button
          type="button"
          disabled={pending}
          onClick={() => run(() => rejectComment(id))}
          className={`${btn} border-amber-400/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20`}
        >
          <X size={11} />
          Reject
        </button>
      )}
      {status !== "SPAM" && (
        <button
          type="button"
          disabled={pending}
          onClick={() => run(() => markSpam(id))}
          className={`${btn} border-slate-500/30 bg-slate-500/10 text-slate-300 hover:bg-slate-500/20`}
          title="Mark as spam — keeps the row for audit but hides it"
        >
          <AlertOctagon size={11} />
          Spam
        </button>
      )}
      {confirmDelete ? (
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => deleteComment(id))}
            className={`${btn} border-rose-400/40 bg-rose-500/20 text-rose-200 hover:bg-rose-500/30`}
          >
            {pending ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
            Confirm
          </button>
          <button
            type="button"
            onClick={() => setConfirmDelete(false)}
            className={`${btn} border-white/15 bg-white/5 text-slate-300 hover:bg-white/10`}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={pending}
          onClick={() => setConfirmDelete(true)}
          className={`${btn} border-rose-400/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20`}
          title="Delete permanently (also deletes any replies)"
        >
          <Trash2 size={11} />
          Delete
        </button>
      )}
    </div>
  );
}
