import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import {
  projectCategories,
  projectIds,
  projectsMeta,
  type ProjectAccent,
  type ProjectCategory,
} from "../data/portfolio";
import { useT } from "../i18n/useT";

const accentMap: Record<ProjectAccent, string> = {
  violet: "from-violet-500/30 via-violet-500/10 to-transparent",
  cyan: "from-cyan-400/30 via-cyan-400/10 to-transparent",
  emerald: "from-emerald-400/30 via-emerald-400/10 to-transparent",
  amber: "from-amber-400/30 via-amber-400/10 to-transparent",
  rose: "from-rose-400/30 via-rose-400/10 to-transparent",
};

const dotMap: Record<ProjectAccent, string> = {
  violet: "bg-violet-400",
  cyan: "bg-cyan-300",
  emerald: "bg-emerald-400",
  amber: "bg-amber-300",
  rose: "bg-rose-400",
};

type Filter = "all" | ProjectCategory;

export default function Projects() {
  const { t } = useT();
  const [filter, setFilter] = useState<Filter>("all");

  const filteredIds = useMemo(() => {
    if (filter === "all") return projectIds;
    return projectIds.filter((id) => projectsMeta[id].category === filter);
  }, [filter]);

  const filterEntries: { key: Filter; label: string }[] = [
    { key: "all", label: t.projects.filters.all },
    ...projectCategories.map((c) => ({
      key: c as Filter,
      label: t.projects.filters[c],
    })),
  ];

  return (
    <section id="projects" className="container-x py-28">
      <SectionHeader
        eyebrow={t.projects.eyebrow}
        title={t.projects.title}
        description={t.projects.description}
      />

      <Reveal className="mb-8 flex flex-wrap gap-2">
        {filterEntries.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
              filter === f.key
                ? "border-accent/60 bg-accent/15 text-white"
                : "border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20 hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </Reveal>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredIds.map((id, i) => {
          const meta = projectsMeta[id];
          const copy = t.projects.items[id];
          return (
            <Reveal key={id} delay={i * 0.05}>
              <article className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-ink-900/60 p-6 transition-all hover:-translate-y-1 hover:border-white/20">
                <div
                  className={`pointer-events-none absolute -inset-px -z-10 bg-gradient-to-br opacity-60 transition-opacity duration-500 group-hover:opacity-100 ${
                    accentMap[meta.accent]
                  }`}
                />
                <div className="pointer-events-none absolute inset-0 -z-10 bg-ink-900/80" />

                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/50">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${dotMap[meta.accent]}`}
                    />
                    {t.projects.filters[meta.category]}
                  </span>
                  {meta.link && (
                    <a
                      href={meta.link}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Open link"
                      className="rounded-full border border-white/10 p-2 text-white/60 transition-colors hover:border-white/30 hover:text-white"
                    >
                      <ArrowUpRight size={14} />
                    </a>
                  )}
                </div>

                <h3 className="mt-5 font-display text-xl font-semibold text-white">
                  {copy.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-white/70">
                  {copy.tagline}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  {copy.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {meta.stack.map((s) => (
                    <span key={s} className="chip">
                      {s}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
