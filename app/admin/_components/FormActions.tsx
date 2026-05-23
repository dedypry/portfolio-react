"use client";

import Link from "next/link";

interface FormActionsProps {
  cancelHref?: string;
  isSubmitting?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  extraActions?: React.ReactNode;
  error?: string;
  success?: string;
}

export function FormActions({
  cancelHref,
  isSubmitting,
  submitLabel = "Save changes",
  cancelLabel = "Cancel",
  extraActions,
  error,
  success,
}: FormActionsProps) {
  return (
    <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm">
        {error && <span className="text-rose-400">{error}</span>}
        {success && <span className="text-emerald-400">{success}</span>}
      </div>
      <div className="flex items-center justify-end gap-2">
        {extraActions}
        {cancelHref && (
          <Link
            href={cancelHref}
            className="rounded-lg border border-white/10 bg-transparent px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5"
          >
            {cancelLabel}
          </Link>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-900/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </div>
  );
}
