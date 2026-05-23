"use client";

import { useTransition } from "react";

interface DeleteRowButtonProps {
  id: string;
  action: (id: string) => Promise<void>;
  confirm?: string;
}

export function DeleteRowButton({
  id,
  action,
  confirm = "Delete this item? This cannot be undone.",
}: DeleteRowButtonProps) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(confirm)) return;
        startTransition(() => action(id));
      }}
      className="rounded-md border border-rose-500/30 px-2 py-1 text-xs text-rose-200 transition hover:bg-rose-500/10 disabled:opacity-50"
    >
      {pending ? "…" : "Delete"}
    </button>
  );
}
