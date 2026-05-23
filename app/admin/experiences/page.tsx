import Link from "next/link";
import { FaPlus } from "react-icons/fa";

import { prisma } from "@/lib/prisma";
import type { ExperienceTx } from "@/lib/translations";

import { PageHeader } from "../_components/PageHeader";
import { DataTable, type Column } from "../_components/DataTable";
import { deleteExperience } from "./actions";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  company: string;
  period: string;
  type: string;
  role: string;
  stackCount: number;
};

export default async function AdminExperiencesPage() {
  const items = await prisma.experience.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  const rows: Row[] = items.map((e) => ({
    id: e.id,
    company: e.company,
    period: e.period,
    type: e.type,
    role:
      (e.translations as unknown as Record<string, ExperienceTx>)?.en?.role ??
      "—",
    stackCount: e.stack.length,
  }));

  const columns: Column<Row>[] = [
    {
      header: "Company",
      cell: (r) => (
        <div>
          <div className="font-medium text-white">{r.company}</div>
          <div className="text-xs text-slate-400">{r.role}</div>
        </div>
      ),
    },
    { header: "Period", cell: (r) => <span className="text-slate-300">{r.period}</span> },
    {
      header: "Type",
      cell: (r) => (
        <span className="inline-flex rounded-md bg-white/5 px-2 py-0.5 text-xs text-slate-300">
          {r.type.replace(/_/g, " ").toLowerCase()}
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
        title="Experience"
        subtitle="Career timeline shown in chronological order."
        actions={
          <Link
            href="/admin/experiences/new"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-900/30 hover:brightness-110"
          >
            <FaPlus className="h-3 w-3" />
            New experience
          </Link>
        }
      />

      <DataTable
        rows={rows}
        columns={columns}
        editHref={(r) => `/admin/experiences/${r.id}/edit`}
        deleteAction={deleteExperience}
        emptyMessage="No experience entries yet."
      />
    </>
  );
}
