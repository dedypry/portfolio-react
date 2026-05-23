"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  FaBell,
  FaCheckCircle,
  FaCommentDots,
  FaInbox,
} from "react-icons/fa";

import type { AdminNotifications, AdminNotificationItem } from "@/lib/adminNotifications";

interface NotificationBellProps {
  data: AdminNotifications;
}

const KIND_META: Record<
  AdminNotificationItem["kind"],
  { icon: typeof FaBell; bg: string; fg: string; label: string }
> = {
  comment_pending: {
    icon: FaCommentDots,
    bg: "bg-amber-500/15",
    fg: "text-amber-300",
    label: "Pending review",
  },
  comment_new: {
    icon: FaCheckCircle,
    bg: "bg-emerald-500/15",
    fg: "text-emerald-300",
    label: "New comment",
  },
  message_unread: {
    icon: FaInbox,
    bg: "bg-sky-500/15",
    fg: "text-sky-300",
    label: "Unread message",
  },
};

export function NotificationBell({ data }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside or pressing Esc.
  useEffect(() => {
    if (!open) return;

    const onClickAway = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onClickAway);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickAway);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const { actionable, recent, counts } = data;
  const total = counts.actionableTotal;
  const hasAny = actionable.length > 0 || recent.length > 0;

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={[
          "relative grid h-9 w-9 place-items-center rounded-full border transition",
          open
            ? "border-white/20 bg-white/10 text-white"
            : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10 hover:text-white",
        ].join(" ")}
        aria-label={
          total > 0
            ? `${total} notifications need attention`
            : "Notifications"
        }
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <FaBell className="h-4 w-4" />
        {total > 0 && (
          <span
            className="absolute -right-1 -top-1 grid h-5 min-w-[20px] place-items-center rounded-full bg-rose-500 px-1.5 text-[10px] font-semibold text-white shadow-lg shadow-rose-500/30"
            aria-hidden
          >
            {total > 99 ? "99+" : total}
          </span>
        )}
        {/* Subtle pulse ring when there's something actionable. */}
        {total > 0 && (
          <span
            className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-rose-500/20"
            aria-hidden
          />
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Notifications"
          className="absolute right-0 z-50 mt-2 w-[22rem] overflow-hidden rounded-xl border border-white/10 bg-slate-900/95 shadow-2xl shadow-black/40 backdrop-blur"
        >
          <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <div className="text-sm font-semibold text-white">
                Notifications
              </div>
              <div className="text-[11px] text-slate-400">
                {total > 0
                  ? `${total} need${total === 1 ? "s" : ""} your attention`
                  : "All caught up — nice work."}
              </div>
            </div>
            <Link
              href="/admin/messages"
              onClick={() => setOpen(false)}
              className="text-[11px] font-medium text-indigo-300 transition hover:text-indigo-200"
            >
              Inbox →
            </Link>
          </header>

          <div className="max-h-[28rem] overflow-y-auto">
            {!hasAny && (
              <div className="px-4 py-10 text-center text-xs text-slate-500">
                Nothing here yet. New comments and messages will show up live.
              </div>
            )}

            {actionable.length > 0 && (
              <Section title="Needs your attention" tone="amber">
                {actionable.map((item) => (
                  <NotificationRow
                    key={item.id}
                    item={item}
                    onClose={() => setOpen(false)}
                  />
                ))}
              </Section>
            )}

            {recent.length > 0 && (
              <Section title="Recent activity" tone="slate">
                {recent.map((item) => (
                  <NotificationRow
                    key={item.id}
                    item={item}
                    onClose={() => setOpen(false)}
                  />
                ))}
              </Section>
            )}
          </div>

          <footer className="grid grid-cols-2 gap-2 border-t border-white/10 bg-black/30 px-3 py-2">
            <Link
              href="/admin/comments?status=PENDING"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-1.5 text-center text-[11px] font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              Review comments
              {counts.pendingComments > 0 && (
                <span className="ml-1.5 rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[10px] text-amber-300">
                  {counts.pendingComments}
                </span>
              )}
            </Link>
            <Link
              href="/admin/messages?status=UNREAD"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-1.5 text-center text-[11px] font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              View inbox
              {counts.unreadMessages > 0 && (
                <span className="ml-1.5 rounded-full bg-sky-500/20 px-1.5 py-0.5 text-[10px] text-sky-300">
                  {counts.unreadMessages}
                </span>
              )}
            </Link>
          </footer>
        </div>
      )}
    </div>
  );
}

/* ─── Sub-components ──────────────────────────────────────── */

function Section({
  title,
  tone,
  children,
}: {
  title: string;
  tone: "amber" | "slate";
  children: React.ReactNode;
}) {
  return (
    <div>
      <div
        className={[
          "px-4 pb-1.5 pt-3 text-[10px] font-semibold uppercase tracking-wider",
          tone === "amber" ? "text-amber-300/90" : "text-slate-400",
        ].join(" ")}
      >
        {title}
      </div>
      <ul>{children}</ul>
    </div>
  );
}

function NotificationRow({
  item,
  onClose,
}: {
  item: AdminNotificationItem;
  onClose: () => void;
}) {
  const meta = KIND_META[item.kind];
  const Icon = meta.icon;
  return (
    <li>
      <Link
        href={item.href}
        onClick={onClose}
        className="flex gap-3 px-4 py-2.5 transition hover:bg-white/5"
      >
        <div
          className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full ${meta.bg} ${meta.fg}`}
        >
          <Icon className="h-3.5 w-3.5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <span className="truncate text-sm font-medium text-white">
              {item.title}
            </span>
            <time
              dateTime={item.createdAt.toISOString()}
              className="shrink-0 text-[10px] text-slate-500"
            >
              {formatDistanceToNow(new Date(item.createdAt), {
                addSuffix: true,
              })}
            </time>
          </div>
          <p className="mt-0.5 line-clamp-2 text-[11px] text-slate-400">
            {item.preview}
          </p>
        </div>
      </Link>
    </li>
  );
}
