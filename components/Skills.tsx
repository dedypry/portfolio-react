"use client";

import { GraduationCap } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import { useT } from "@/i18n/useT";
import type { EducationView, SkillGroupView } from "@/lib/queries";

interface SkillsProps {
  groups: SkillGroupView[];
  education: EducationView[];
}

export default function Skills({ groups, education }: SkillsProps) {
  const { t } = useT();

  return (
    <section id="skills" className="container-x py-28">
      <SectionHeader
        eyebrow={t.skills.eyebrow}
        title={t.skills.title}
        description={t.skills.description}
      />

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((g, i) => (
          <Reveal key={g.id} delay={i * 0.06}>
            <div className="glass h-full rounded-3xl p-6">
              <h3 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
                {g.title}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {g.skills.map((it) => (
                  <span
                    key={it}
                    className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-white/85 transition-colors hover:border-accent/40 hover:bg-accent/10 hover:text-white"
                  >
                    {it}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {education.length > 0 && (
        <Reveal delay={0.15} className="mt-10 space-y-4">
          {education.map((edu) => (
            <div
              key={edu.id}
              className="glass flex flex-col items-start justify-between gap-4 rounded-3xl p-6 sm:flex-row sm:items-center"
            >
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-accent/30 to-cyan-neon/20 ring-1 ring-white/10">
                  <GraduationCap size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-white">
                    {edu.degree}
                  </h3>
                  <p className="text-sm text-white/60">
                    {edu.school} · {edu.location}
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
                {edu.period}
              </span>
            </div>
          ))}
        </Reveal>
      )}
    </section>
  );
}
