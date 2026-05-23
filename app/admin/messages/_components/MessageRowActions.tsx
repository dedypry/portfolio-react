"use client";

import { useState, useTransition } from "react";
import {
  Archive,
  ArchiveRestore,
  CheckCheck,
  Eye,
  Loader2,
  Mail,
  Trash2,
} from "lucide-react";

import {
  archiveMessage,
  deleteMessage,
  restoreMessage,
  toggleRead,
} from "../actions";

interface Props {
  id: string;
  status: "UNREAD" | "READ" | "ARCHIVED";
  email: string;
  subject: string | null;
}

/**
 * Per-row toolbar in the admin inbox. Buttons shown depend on status.
 * The "Reply" button opens the visitor's email in a fresh mailto: with
 * a sensible "Re:" prefix so the admin doesn't have to retype.
 */
export function MessageRowActions({ id, status, email, subject }: Props) {
  const [pending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const run = (fn: () => Promise<void>) => {
    startTransition(async () => {
      try {
        await fn();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed";
        window.alert(msg);
      }
    });
  };

  const replySubject = subject
    ? subject.toLowerCase().startsWith("re:")
      ? subject
      : `Re: ${subject}`
    : "Re: your message";
  const mailto = `mailto:${email}?subject=${encodeURIComponent(replySubject)}`;

  const btn =
    "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium transition disabled:opacity-50";

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <a
        href={mailto}
        className={`${btn} border-indigo-400/30 bg-indigo-500/10 text-indigo-200 hover:bg-indigo-500/20`}
        title="Reply via email"
      >
        <Mail size={11} />
        Reply
      </a>

      {status === "UNREAD" ? (
        <button
          type="button"
          disabled={pending}
          onClick={() => run(() => toggleRead(id, true))}
          className={`${btn} border-emerald-400/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20`}
        >
          {pending ? (
            <Loader2 size={11} className="animate-spin" />
          ) : (
            <CheckCheck size={11} />
          )}
          Mark read
        </button>
      ) : status === "READ" ? (
        <button
          type="button"
          disabled={pending}
          onClick={() => run(() => toggleRead(id, false))}
          className={`${btn} border-amber-400/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20`}
          title="Mark unread"
        >
          <Eye size={11} />
          Unread
        </button>
      ) : null}

      {status !== "ARCHIVED" ? (
        <button
          type="button"
          disabled={pending}
          onClick={() => run(() => archiveMessage(id))}
          className={`${btn} border-slate-500/30 bg-slate-500/10 text-slate-300 hover:bg-slate-500/20`}
          title="Move to archive"
        >
          <Archive size={11} />
          Archive
        </button>
      ) : (
        <button
          type="button"
          disabled={pending}
          onClick={() => run(() => restoreMessage(id))}
          className={`${btn} border-slate-500/30 bg-slate-500/10 text-slate-300 hover:bg-slate-500/20`}
          title="Restore to inbox"
        >
          <ArchiveRestore size={11} />
          Restore
        </button>
      )}

      {confirmDelete ? (
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => deleteMessage(id))}
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
        >
          <Trash2 size={11} />
          Delete
        </button>
      )}
    </div>
  );
}
