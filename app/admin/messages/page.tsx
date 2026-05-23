import Link from "next/link";
import { format } from "date-fns";
import { Mail } from "lucide-react";

import { prisma } from "@/lib/prisma";

import { PageHeader } from "../_components/PageHeader";
import { MarkAllReadButton } from "./_components/MarkAllReadButton";
import { MessageRowActions } from "./_components/MessageRowActions";

export const dynamic = "force-dynamic";

const STATUSES = ["UNREAD", "READ", "ARCHIVED"] as const;
type StatusFilter = (typeof STATUSES)[number] | "ALL";

const STATUS_STYLE: Record<(typeof STATUSES)[number], string> = {
  UNREAD: "bg-amber-500/10 text-amber-300 border-amber-500/30",
  READ: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  ARCHIVED: "bg-slate-500/10 text-slate-400 border-slate-500/30",
};

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminMessagesPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const filter: StatusFilter = (() => {
    const raw = (sp?.status ?? "UNREAD").toUpperCase();
    if (raw === "ALL") return "ALL";
    return (STATUSES as readonly string[]).includes(raw)
      ? (raw as (typeof STATUSES)[number])
      : "UNREAD";
  })();

  const [counts, messages] = await Promise.all([
    prisma.message.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    prisma.message.findMany({
      where: filter === "ALL" ? undefined : { status: filter },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
  ]);

  const countByStatus: Record<string, number> = Object.fromEntries(
    counts.map((c) => [c.status, c._count._all])
  );
  const totalCount = counts.reduce((sum, c) => sum + c._count._all, 0);
  const unreadCount = countByStatus.UNREAD ?? 0;

  return (
    <>
      <PageHeader
        title="Messages"
        subtitle="Visitor messages from the public contact form. Reply by email — these are private notes, not public comments."
        actions={<MarkAllReadButton unreadCount={unreadCount} />}
      />

      {/* Filter chips */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <FilterChip
          href="/admin/messages?status=UNREAD"
          active={filter === "UNREAD"}
          label="Unread"
          count={countByStatus.UNREAD ?? 0}
          tone="amber"
        />
        <FilterChip
          href="/admin/messages?status=READ"
          active={filter === "READ"}
          label="Read"
          count={countByStatus.READ ?? 0}
          tone="emerald"
        />
        <FilterChip
          href="/admin/messages?status=ARCHIVED"
          active={filter === "ARCHIVED"}
          label="Archived"
          count={countByStatus.ARCHIVED ?? 0}
          tone="slate"
        />
        <FilterChip
          href="/admin/messages?status=ALL"
          active={filter === "ALL"}
          label="All"
          count={totalCount}
          tone="indigo"
        />
      </div>

      {messages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-20 text-center">
          <Mail
            size={32}
            className="mx-auto mb-3 text-slate-600"
            aria-hidden
          />
          <p className="text-sm text-slate-500">
            {filter === "UNREAD"
              ? "Inbox zero. Nothing new from visitors."
              : "No messages in this view."}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {messages.map((m) => {
            const isUnread = m.status === "UNREAD";
            return (
              <li
                key={m.id}
                className={[
                  "rounded-xl border bg-slate-900/40 p-4 transition",
                  isUnread
                    ? "border-amber-400/30 shadow-[0_0_0_1px_rgba(251,191,36,0.05)]"
                    : "border-white/10",
                ].join(" ")}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <span className="text-sm font-semibold text-white">
                        {m.name}
                      </span>
                      <a
                        href={`mailto:${m.email}`}
                        className="text-xs text-indigo-300 hover:text-indigo-200"
                      >
                        {m.email}
                      </a>
                      <span
                        className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${STATUS_STYLE[m.status]}`}
                      >
                        {m.status}
                      </span>
                      {isUnread && (
                        <span
                          className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400"
                          aria-label="New"
                        />
                      )}
                    </div>
                    {m.subject && (
                      <h3 className="mt-1 text-sm font-medium text-white/95">
                        {m.subject}
                      </h3>
                    )}
                    <div className="mt-0.5 text-[11px] text-slate-500">
                      {format(m.createdAt, "dd MMM yyyy · HH:mm")}
                      {m.readAt && (
                        <>
                          {" · "}
                          read{" "}
                          {format(m.readAt, "dd MMM yyyy · HH:mm")}
                        </>
                      )}
                    </div>
                  </div>

                  <MessageRowActions
                    id={m.id}
                    status={m.status}
                    email={m.email}
                    subject={m.subject}
                  />
                </div>

                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-200">
                  {m.body}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

interface FilterChipProps {
  href: string;
  active: boolean;
  label: string;
  count: number;
  tone: "amber" | "emerald" | "slate" | "indigo";
}

function FilterChip({ href, active, label, count, tone }: FilterChipProps) {
  const base =
    "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition";
  const palette: Record<FilterChipProps["tone"], string> = {
    amber: active
      ? "border-amber-400/50 bg-amber-500/15 text-amber-200"
      : "border-white/10 bg-white/5 text-slate-400 hover:border-amber-400/30 hover:text-amber-200",
    emerald: active
      ? "border-emerald-400/50 bg-emerald-500/15 text-emerald-200"
      : "border-white/10 bg-white/5 text-slate-400 hover:border-emerald-400/30 hover:text-emerald-200",
    slate: active
      ? "border-slate-400/50 bg-slate-500/15 text-slate-200"
      : "border-white/10 bg-white/5 text-slate-400 hover:border-slate-400/30 hover:text-slate-200",
    indigo: active
      ? "border-indigo-400/50 bg-indigo-500/15 text-indigo-200"
      : "border-white/10 bg-white/5 text-slate-400 hover:border-indigo-400/30 hover:text-indigo-200",
  };

  return (
    <Link href={href} className={`${base} ${palette[tone]}`}>
      <span>{label}</span>
      <span className="rounded-full bg-black/30 px-1.5 py-0.5 text-[10px] tabular-nums">
        {count}
      </span>
    </Link>
  );
}
