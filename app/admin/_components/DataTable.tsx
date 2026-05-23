import Link from "next/link";

import { DeleteRowButton } from "./DeleteRowButton";

export interface Column<T> {
  header: string;
  cell: (row: T) => React.ReactNode;
  width?: string;
  align?: "left" | "right" | "center";
}

interface DataTableProps<T extends { id: string }> {
  rows: T[];
  columns: Column<T>[];
  emptyMessage?: string;
  /** Per-row action: edit URL */
  editHref?: (row: T) => string;
  /** Per-row action: delete server action that takes id and revalidates */
  deleteAction?: (id: string) => Promise<void>;
}

export function DataTable<T extends { id: string }>({
  rows,
  columns,
  emptyMessage = "No data yet.",
  editHref,
  deleteAction,
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-6 py-16 text-center text-sm text-slate-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-sm">
          <thead className="bg-white/[0.04] text-xs uppercase tracking-wider text-slate-400">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={[
                    "px-4 py-3 text-left",
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.header}
                </th>
              ))}
              {(editHref || deleteAction) && (
                <th className="w-32 px-4 py-3 text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((row) => (
              <tr key={row.id} className="transition hover:bg-white/[0.02]">
                {columns.map((col, idx) => (
                  <td
                    key={idx}
                    className={[
                      "px-4 py-3 align-top",
                      col.align === "right" && "text-right",
                      col.align === "center" && "text-center",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {col.cell(row)}
                  </td>
                ))}
                {(editHref || deleteAction) && (
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      {editHref && (
                        <Link
                          href={editHref(row)}
                          className="rounded-md border border-white/10 px-2 py-1 text-xs text-slate-300 transition hover:bg-white/10 hover:text-white"
                        >
                          Edit
                        </Link>
                      )}
                      {deleteAction && (
                        <DeleteRowButton id={row.id} action={deleteAction} />
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
