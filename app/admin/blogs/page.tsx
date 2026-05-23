import Link from "next/link";
import { format } from "date-fns";
import { FaPlus } from "react-icons/fa";

import { prisma } from "@/lib/prisma";
import type { BlogTx } from "@/lib/translations";

import { PageHeader } from "../_components/PageHeader";
import { DataTable, type Column } from "../_components/DataTable";
import { deleteBlog } from "./actions";

export const dynamic = "force-dynamic";

type BlogRow = Awaited<ReturnType<typeof loadRows>>[number];

async function loadRows() {
  const blogs = await prisma.blog.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      slug: true,
      status: true,
      publishedAt: true,
      tags: true,
      translations: true,
      createdAt: true,
      readingTime: true,
    },
  });
  return blogs.map((b) => ({
    ...b,
    title:
      (b.translations as unknown as Record<string, BlogTx>)?.en?.title ??
      "Untitled",
  }));
}

const STATUS_STYLE: Record<string, string> = {
  DRAFT: "bg-amber-500/10 text-amber-300 border-amber-500/30",
  PUBLISHED: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  ARCHIVED: "bg-slate-500/10 text-slate-400 border-slate-500/30",
};

export default async function AdminBlogsPage() {
  const rows = await loadRows();

  const columns: Column<BlogRow>[] = [
    {
      header: "Title",
      cell: (r) => (
        <div>
          <div className="font-medium text-white">{r.title}</div>
          <div className="text-xs text-slate-500">/{r.slug}</div>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (r) => (
        <span
          className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[r.status]}`}
        >
          {r.status}
        </span>
      ),
    },
    {
      header: "Published",
      cell: (r) =>
        r.publishedAt ? (
          <span className="text-slate-300">
            {format(r.publishedAt, "dd MMM yyyy")}
          </span>
        ) : (
          <span className="text-slate-600">—</span>
        ),
    },
    {
      header: "Tags",
      cell: (r) => (
        <div className="flex flex-wrap gap-1">
          {r.tags.length === 0 ? (
            <span className="text-slate-600 text-xs">—</span>
          ) : (
            r.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-300"
              >
                {tag}
              </span>
            ))
          )}
        </div>
      ),
    },
    {
      header: "Read",
      cell: (r) =>
        r.readingTime ? (
          <span className="text-xs text-slate-400">{r.readingTime}m</span>
        ) : (
          <span className="text-slate-600">—</span>
        ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Blogs"
        subtitle="Write, schedule, and publish posts in English & Indonesian."
        actions={
          <Link
            href="/admin/blogs/new"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-900/30 hover:brightness-110"
          >
            <FaPlus className="h-3 w-3" />
            New post
          </Link>
        }
      />

      <DataTable
        rows={rows}
        columns={columns}
        editHref={(r) => `/admin/blogs/${r.id}/edit`}
        deleteAction={deleteBlog}
        emptyMessage="No blog posts yet. Create your first one!"
      />
    </>
  );
}
