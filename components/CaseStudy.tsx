"use client";

import { CheckCircle2, Cloud, Database, GitBranch, Layers3 } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import { useT } from "@/i18n/useT";

const architectureIcons = [Database, Cloud, GitBranch];

export default function CaseStudy() {
  const { t } = useT();

  return (
    <section id="case-study" className="container-x py-28">
      <SectionHeader
        eyebrow={t.caseStudy.eyebrow}
        title={t.caseStudy.title}
        description={t.caseStudy.description}
      />

      <div className="grid gap-5 lg:grid-cols-[0.85fr,1.15fr]">
        <Reveal>
          <aside className="glass sticky top-24 rounded-3xl p-6 lg:p-8">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-accent/30 to-cyan-neon/20 ring-1 ring-white/10">
              <Layers3 size={22} className="text-white" />
            </div>
            <h3 className="mt-5 font-display text-2xl font-semibold text-white">
              {t.projects.items.juraganmaterial.name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              {t.caseStudy.overviewBody}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {t.caseStudy.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="font-display text-xl font-bold gradient-text">
                    {metric.value}
                  </div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-white/45">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </Reveal>

        <div className="space-y-5">
          <Reveal delay={0.05}>
            <div className="glass rounded-3xl p-6 lg:p-8">
              <h3 className="font-display text-xl font-semibold text-white">
                {t.caseStudy.challengeTitle}
              </h3>
              <ul className="mt-5 grid gap-3">
                {t.caseStudy.challenges.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-white/65">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-rose-400 shadow-[0_0_16px_rgba(251,113,133,0.5)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="glass rounded-3xl p-6 lg:p-8">
              <h3 className="font-display text-xl font-semibold text-white">
                {t.caseStudy.solutionTitle}
              </h3>
              <ul className="mt-5 grid gap-3">
                {t.caseStudy.solutions.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-white/65">
                    <CheckCircle2
                      size={17}
                      className="mt-0.5 shrink-0 text-emerald-300"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="glass rounded-3xl p-6 lg:p-8">
              <h3 className="font-display text-xl font-semibold text-white">
                {t.caseStudy.architectureTitle}
              </h3>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {t.caseStudy.architecture.map((item, index) => {
                  const Icon = architectureIcons[index % architectureIcons.length];
                  return (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                    >
                      <Icon size={18} className="text-accent-soft" />
                      <h4 className="mt-3 font-display text-sm font-semibold text-white">
                        {item.label}
                      </h4>
                      <p className="mt-2 text-xs leading-relaxed text-white/55">
                        {item.body}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="relative overflow-hidden rounded-3xl border border-accent/20 bg-gradient-to-br from-accent/15 via-white/[0.03] to-cyan-neon/10 p-6 lg:p-8">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-neon/20 blur-3xl" />
              <h3 className="relative font-display text-xl font-semibold text-white">
                {t.caseStudy.impactTitle}
              </h3>
              <div className="relative mt-5 grid gap-3">
                {t.caseStudy.impact.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-ink-950/30 p-4 text-sm text-white/70"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
