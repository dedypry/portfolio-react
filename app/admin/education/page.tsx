import Link from "next/link";
import { FaPlus } from "react-icons/fa";

import { prisma } from "@/lib/prisma";
import type { EducationTx } from "@/lib/translations";

import { PageHeader } from "../_components/PageHeader";
import { DataTable, type Column } from "../_components/DataTable";
import { deleteEducation } from "./actions";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  school: string;
  location: string;
  period: string;
  degree: string;
};

export default async function AdminEducationPage() {
  const items = await prisma.education.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  const rows: Row[] = items.map((e) => ({
    id: e.id,
    school: e.school,
    location: e.location,
    period: e.period,
    degree:
      (e.translations as unknown as Record<string, EducationTx>)?.en?.degree ??
      "—",
  }));

  const columns: Column<Row>[] = [
    {
      header: "School",
      cell: (r) => (
        <div>
          <div className="font-medium text-white">{r.school}</div>
          <div className="text-xs text-slate-400">{r.degree}</div>
        </div>
      ),
    },
    { header: "Location", cell: (r) => r.location },
    { header: "Period", cell: (r) => r.period },
  ];

  return (
    <>
      <PageHeader
        title="Education"
        actions={
          <Link
            href="/admin/education/new"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-900/30 hover:brightness-110"
          >
            <FaPlus className="h-3 w-3" />
            New entry
          </Link>
        }
      />

      <DataTable
        rows={rows}
        columns={columns}
        editHref={(r) => `/admin/education/${r.id}/edit`}
        deleteAction={deleteEducation}
        emptyMessage="No education entries yet."
      />
    </>
  );
}
