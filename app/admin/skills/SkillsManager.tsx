"use client";

import { useState, useTransition } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";

import type { SkillInput } from "@/lib/validators";

interface SkillRow {
  id: string;
  name: string;
  proficiency: number | null;
  order: number;
}

interface Props {
  groupId: string;
  initialSkills: SkillRow[];
  createAction: (input: SkillInput) => Promise<void>;
  deleteAction: (id: string) => Promise<void>;
}

export function SkillsManager({
  groupId,
  initialSkills,
  createAction,
  deleteAction,
}: Props) {
  const [draftName, setDraftName] = useState("");
  const [pending, startTransition] = useTransition();

  const add = () => {
    const name = draftName.trim();
    if (!name) return;
    setDraftName("");
    startTransition(() =>
      createAction({
        name,
        proficiency: null,
        order: initialSkills.length,
        groupId,
      })
    );
  };

  const remove = (id: string) => {
    startTransition(() => deleteAction(id));
  };

  return (
    <div className="space-y-3 px-5 py-4">
      <div className="flex flex-wrap gap-1.5">
        {initialSkills.length === 0 ? (
          <span className="text-xs text-slate-600">No skills yet.</span>
        ) : (
          initialSkills.map((skill) => (
            <span
              key={skill.id}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-slate-900/60 px-2 py-1 text-xs text-slate-200"
            >
              {skill.name}
              <button
                type="button"
                onClick={() => remove(skill.id)}
                className="text-slate-500 hover:text-rose-300 disabled:opacity-50"
                disabled={pending}
                aria-label="Remove"
              >
                <FaTimes className="h-2.5 w-2.5" />
              </button>
            </span>
          ))
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="Add a skill (Enter)…"
          className="flex-1 rounded-md border border-white/10 bg-slate-900/60 px-3 py-1.5 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30"
        />
        <button
          type="button"
          onClick={add}
          disabled={pending || !draftName.trim()}
          className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FaPlus className="h-2.5 w-2.5" />
          Add
        </button>
      </div>

    </div>
  );
}
