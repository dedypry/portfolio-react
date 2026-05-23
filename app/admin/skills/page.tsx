import Link from "next/link";
import { FaPlus } from "react-icons/fa";

import { prisma } from "@/lib/prisma";
import type { SkillGroupTx } from "@/lib/translations";

import { PageHeader } from "../_components/PageHeader";
import { DeleteRowButton } from "../_components/DeleteRowButton";
import { deleteSkillGroup } from "./actions";
import { SkillsManager } from "./SkillsManager";
import {
  createSkill,
  deleteSkill,
} from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const groups = await prisma.skillGroup.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    include: {
      skills: {
        orderBy: [{ order: "asc" }, { name: "asc" }],
      },
    },
  });

  return (
    <>
      <PageHeader
        title="Skills"
        subtitle="Group skills (Languages, Frontend…) and the items inside each group."
        actions={
          <Link
            href="/admin/skills/new-group"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-900/30 hover:brightness-110"
          >
            <FaPlus className="h-3 w-3" />
            New group
          </Link>
        }
      />

      {groups.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-6 py-16 text-center text-sm text-slate-500">
          No skill groups yet. Create your first one!
        </div>
      ) : (
        <div className="space-y-5">
          {groups.map((group) => {
            const titleEn =
              (group.translations as unknown as Record<string, SkillGroupTx>)
                ?.en?.title ?? group.key;
            return (
              <section
                key={group.id}
                className="rounded-2xl border border-white/10 bg-white/5"
              >
                <header className="flex items-center justify-between gap-2 border-b border-white/10 px-5 py-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold text-white">
                      {titleEn}
                    </h2>
                    <p className="text-xs text-slate-500">
                      key: {group.key} · order: {group.order}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-1">
                    <Link
                      href={`/admin/skills/${group.id}/edit`}
                      className="rounded-md border border-white/10 px-2 py-1 text-xs text-slate-300 transition hover:bg-white/10 hover:text-white"
                    >
                      Edit group
                    </Link>
                    <DeleteRowButton
                      id={group.id}
                      action={deleteSkillGroup}
                      confirm="Delete this group? Skills inside will also be deleted."
                    />
                  </div>
                </header>

                <SkillsManager
                  groupId={group.id}
                  initialSkills={group.skills.map((s) => ({
                    id: s.id,
                    name: s.name,
                    proficiency: s.proficiency,
                    order: s.order,
                  }))}
                  createAction={createSkill}
                  deleteAction={deleteSkill}
                />
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
