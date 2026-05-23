import Link from "next/link";
import { FaPlus, FaStar } from "react-icons/fa";

import { prisma } from "@/lib/prisma";
import type { ProjectTx } from "@/lib/translations";

import { PageHeader } from "../_components/PageHeader";
import { DataTable, type Column } from "../_components/DataTable";
import { deleteProject } from "./actions";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  name: string;
  category: string;
  featured: boolean;
  link: string | null;
  stackCount: number;
};

export default async function AdminProjectsPage() {
  const items = await prisma.project.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  const rows: Row[] = items.map((p) => ({
    id: p.id,
    name:
      (p.translations as unknown as Record<string, ProjectTx>)?.en?.name ??
      "Untitled",
    category: p.category,
    featured: p.featured,
    link: p.link,
    stackCount: p.stack.length,
  }));

  const columns: Column<Row>[] = [
    {
      header: "Project",
      cell: (r) => (
        <div className="flex items-center gap-2">
          {r.featured && <FaStar className="h-3 w-3 text-amber-400" />}
          <div>
            <div className="font-medium text-white">{r.name}</div>
            {r.link && (
              <a
                href={r.link}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-indigo-300 hover:text-indigo-200"
              >
                {r.link}
              </a>
            )}
          </div>
        </div>
      ),
    },
    {
      header: "Category",
      cell: (r) => (
        <span className="inline-flex rounded-md bg-white/5 px-2 py-0.5 text-xs text-slate-300">
          {r.category}
        </span>
      ),
    },
    {
      header: "Stack",
      cell: (r) => <span className="text-xs text-slate-500">{r.stackCount} items</span>,
    },
  ];

  return (
    <>
      <PageHeader
        title="Projects"
        actions={
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-900/30 hover:brightness-110"
          >
            <FaPlus className="h-3 w-3" />
            New project
          </Link>
        }
      />

      <DataTable
        rows={rows}
        columns={columns}
        editHref={(r) => `/admin/projects/${r.id}/edit`}
        deleteAction={deleteProject}
        emptyMessage="No projects yet."
      />
    </>
  );
}
