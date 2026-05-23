import { GraduationCap } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import {
  skillGroupIds,
  skillGroupItems,
  type SkillGroupId,
} from "../data/portfolio";
import { useT } from "../i18n/useT";

export default function Skills() {
  const { t } = useT();

  const groups: { id: SkillGroupId; title: string; items: readonly string[] }[] =
    skillGroupIds.map((id) => ({
      id,
      title: t.skills.groupTitles[id],
      items: id === "practices" ? t.skills.practices : skillGroupItems[id],
    }));

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
                {g.items.map((it) => (
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

      <Reveal delay={0.15} className="mt-10">
        <div className="glass flex flex-col items-start justify-between gap-4 rounded-3xl p-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-accent/30 to-cyan-neon/20 ring-1 ring-white/10">
              <GraduationCap size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-white">
                {t.skills.education.degree}
              </h3>
              <p className="text-sm text-white/60">
                {t.skills.education.school} · {t.skills.education.location}
              </p>
            </div>
          </div>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
            {t.skills.education.period}
          </span>
        </div>
      </Reveal>
    </section>
  );
}
