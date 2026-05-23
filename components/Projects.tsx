"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import { useT } from "@/i18n/useT";
import type { ProjectView } from "@/lib/queries";
import type { ProjectAccent, ProjectCategory } from "@/data/portfolio";

const accentMap: Record<string, string> = {
  violet: "from-violet-500/30 via-violet-500/10 to-transparent",
  cyan: "from-cyan-400/30 via-cyan-400/10 to-transparent",
  emerald: "from-emerald-400/30 via-emerald-400/10 to-transparent",
  amber: "from-amber-400/30 via-amber-400/10 to-transparent",
  rose: "from-rose-400/30 via-rose-400/10 to-transparent",
};

const dotMap: Record<string, string> = {
  violet: "bg-violet-400",
  cyan: "bg-cyan-300",
  emerald: "bg-emerald-400",
  amber: "bg-amber-300",
  rose: "bg-rose-400",
};

const FALLBACK_ACCENT: ProjectAccent = "violet";

type Filter = "all" | string;

interface ProjectsProps {
  items: ProjectView[];
}

export default function Projects({ items }: ProjectsProps) {
  const { t } = useT();
  const [filter, setFilter] = useState<Filter>("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((p) => set.add(p.category));
    return Array.from(set);
  }, [items]);

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((p) => p.category === filter);
  }, [filter, items]);

  const filterEntries: { key: Filter; label: string }[] = [
    { key: "all", label: t.projects.filters.all },
    ...categories.map((c) => ({
      key: c,
      label:
        t.projects.filters[c as ProjectCategory] ?? c,
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
        {filtered.map((item, i) => {
          const accent = item.accent || FALLBACK_ACCENT;
          return (
            <Reveal key={item.id} delay={i * 0.05}>
              <article className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-ink-900/60 p-6 transition-all hover:-translate-y-1 hover:border-white/20">
                <div
                  className={`pointer-events-none absolute -inset-px -z-10 bg-gradient-to-br opacity-60 transition-opacity duration-500 group-hover:opacity-100 ${
                    accentMap[accent] ?? accentMap[FALLBACK_ACCENT]
                  }`}
                />
                <div className="pointer-events-none absolute inset-0 -z-10 bg-ink-900/80" />

                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/50">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${dotMap[accent] ?? dotMap[FALLBACK_ACCENT]}`}
                    />
                    {t.projects.filters[item.category as ProjectCategory] ??
                      item.category}
                  </span>
                  {item.link && (
                    <a
                      href={item.link}
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
                  {item.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-white/70">
                  {item.tagline}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  {item.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {item.stack.map((s) => (
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
