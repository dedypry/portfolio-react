import Link from "next/link";
import { format } from "date-fns";
import { CornerDownRight, ExternalLink, Sparkles } from "lucide-react";

import { prisma } from "@/lib/prisma";
import type { BlogTx } from "@/lib/translations";

import { PageHeader } from "../_components/PageHeader";
import { CommentRowActions } from "./_components/CommentRowActions";

export const dynamic = "force-dynamic";

const STATUSES = ["PENDING", "APPROVED", "REJECTED", "SPAM"] as const;
type StatusFilter = (typeof STATUSES)[number] | "ALL";

const STATUS_STYLE: Record<(typeof STATUSES)[number], string> = {
  PENDING: "bg-amber-500/10 text-amber-300 border-amber-500/30",
  APPROVED: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  REJECTED: "bg-slate-500/10 text-slate-400 border-slate-500/30",
  SPAM: "bg-rose-500/10 text-rose-300 border-rose-500/30",
};

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminCommentsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const filter: StatusFilter = (() => {
    const raw = (sp?.status ?? "PENDING").toUpperCase();
    if (raw === "ALL") return "ALL";
    return (STATUSES as readonly string[]).includes(raw)
      ? (raw as (typeof STATUSES)[number])
      : "PENDING";
  })();

  // Always run all status counts in parallel so the filter chips can show
  // accurate badges without a second roundtrip.
  const [counts, comments] = await Promise.all([
    prisma.comment.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    prisma.comment.findMany({
      where: filter === "ALL" ? undefined : { status: filter },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        blog: {
          select: { slug: true, translations: true },
        },
        parent: {
          select: { authorName: true, body: true },
        },
      },
    }),
  ]);

  const countByStatus: Record<string, number> = Object.fromEntries(
    counts.map((c) => [c.status, c._count._all])
  );
  const totalCount = counts.reduce((sum, c) => sum + c._count._all, 0);

  return (
    <>
      <PageHeader
        title="Comments"
        subtitle="AI auto-approves clean comments and posts a reply on your behalf. Anything flagged lands here for you to review."
      />

      {/* Status filter chips */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <FilterChip
          href="/admin/comments?status=PENDING"
          active={filter === "PENDING"}
          label="Pending"
          count={countByStatus.PENDING ?? 0}
          tone="amber"
        />
        <FilterChip
          href="/admin/comments?status=APPROVED"
          active={filter === "APPROVED"}
          label="Approved"
          count={countByStatus.APPROVED ?? 0}
          tone="emerald"
        />
        <FilterChip
          href="/admin/comments?status=REJECTED"
          active={filter === "REJECTED"}
          label="Rejected"
          count={countByStatus.REJECTED ?? 0}
          tone="slate"
        />
        <FilterChip
          href="/admin/comments?status=SPAM"
          active={filter === "SPAM"}
          label="Spam"
          count={countByStatus.SPAM ?? 0}
          tone="rose"
        />
        <FilterChip
          href="/admin/comments?status=ALL"
          active={filter === "ALL"}
          label="All"
          count={totalCount}
          tone="indigo"
        />
      </div>

      {comments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center text-sm text-slate-500">
          No comments in this view.
        </div>
      ) : (
        <ul className="space-y-3">
          {comments.map((c) => {
            const tx = c.blog?.translations as unknown as
              | Record<string, BlogTx>
              | undefined;
            const blogTitle =
              tx?.en?.title ?? tx?.id?.title ?? c.blog?.slug ?? "—";

            return (
              <li
                key={c.id}
                className="rounded-xl border border-white/10 bg-slate-900/40 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <span className="text-sm font-semibold text-white">
                        {c.authorName}
                      </span>
                      <span className="text-xs text-slate-500">
                        {c.authorEmail}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${STATUS_STYLE[c.status]}`}
                      >
                        {c.status}
                      </span>
                      {c.isAiReply && (
                        <span
                          title={`AI auto-reply${c.aiModel ? ` · ${c.aiModel}` : ""}`}
                          className="inline-flex items-center gap-1 rounded-md border border-indigo-400/40 bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-medium text-indigo-200"
                        >
                          <Sparkles size={10} aria-hidden />
                          AI reply
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500">
                      {format(c.createdAt, "dd MMM yyyy · HH:mm")} · on{" "}
                      <Link
                        href={`/en/blog/${c.blog?.slug ?? ""}#comments`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-indigo-300 hover:text-indigo-200"
                      >
                        {blogTitle}
                        <ExternalLink size={10} />
                      </Link>
                    </div>
                  </div>

                  <CommentRowActions id={c.id} status={c.status} />
                </div>

                {c.parent && (
                  <div className="mt-3 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-500">
                      <CornerDownRight size={10} />
                      Reply to{" "}
                      <span className="text-slate-300">
                        {c.parent.authorName}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 italic">
                      “{c.parent.body}”
                    </p>
                  </div>
                )}

                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-200">
                  {c.body}
                </p>

                {c.authorWebsite && (
                  <a
                    href={c.authorWebsite}
                    target="_blank"
                    rel="nofollow noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-[11px] text-indigo-300 hover:text-indigo-200"
                  >
                    {c.authorWebsite}
                    <ExternalLink size={10} />
                  </a>
                )}
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
  tone: "amber" | "emerald" | "slate" | "rose" | "indigo";
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
    rose: active
      ? "border-rose-400/50 bg-rose-500/15 text-rose-200"
      : "border-white/10 bg-white/5 text-slate-400 hover:border-rose-400/30 hover:text-rose-200",
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
