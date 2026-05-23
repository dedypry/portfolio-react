import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import { projects, type Project } from "../data/portfolio";

const accentMap: Record<Project["accent"], string> = {
  violet: "from-violet-500/30 via-violet-500/10 to-transparent",
  cyan: "from-cyan-400/30 via-cyan-400/10 to-transparent",
  emerald: "from-emerald-400/30 via-emerald-400/10 to-transparent",
  amber: "from-amber-400/30 via-amber-400/10 to-transparent",
  rose: "from-rose-400/30 via-rose-400/10 to-transparent",
};

const dotMap: Record<Project["accent"], string> = {
  violet: "bg-violet-400",
  cyan: "bg-cyan-300",
  emerald: "bg-emerald-400",
  amber: "bg-amber-300",
  rose: "bg-rose-400",
};

const filters = ["All", "Web", "Mobile", "Backend", "Landing"] as const;

export default function Projects() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");

  const filtered = useMemo(() => {
    if (filter === "All") return projects;
    return projects.filter((p) => p.category === filter);
  }, [filter]);

  return (
    <section id="projects" className="container-x py-28">
      <SectionHeader
        eyebrow="Selected Work"
        title="Products I've shipped, teams I've helped, problems I've solved."
        description="A curated tour of platforms, mobile apps, and internal tools across e-commerce, B2B, finance, and education."
      />

      <Reveal className="mb-8 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
              filter === f
                ? "border-accent/60 bg-accent/15 text-white"
                : "border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20 hover:text-white"
            }`}
          >
            {f}
          </button>
        ))}
      </Reveal>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.05}>
            <article
              className={`group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-ink-900/60 p-6 transition-all hover:-translate-y-1 hover:border-white/20`}
            >
              <div
                className={`pointer-events-none absolute -inset-px -z-10 bg-gradient-to-br opacity-60 transition-opacity duration-500 group-hover:opacity-100 ${
                  accentMap[p.accent]
                }`}
              />
              <div className="pointer-events-none absolute inset-0 -z-10 bg-ink-900/80" />

              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/50">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${dotMap[p.accent]}`}
                  />
                  {p.category}
                </span>
                {p.link && (
                  <a
                    href={p.link}
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
                {p.name}
              </h3>
              <p className="mt-1 text-sm font-medium text-white/70">
                {p.tagline}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                {p.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <span key={s} className="chip">
                    {s}
                  </span>
                ))}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
