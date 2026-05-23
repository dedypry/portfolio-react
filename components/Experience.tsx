"use client";

import { Briefcase, MapPin } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import {
  experienceIds,
  experiencesMeta,
  type ExperienceId,
} from "@/data/portfolio";
import { useT } from "@/i18n/useT";

export default function Experience() {
  const { t } = useT();
  return (
    <section id="experience" className="container-x py-28">
      <SectionHeader
        eyebrow={t.experience.eyebrow}
        title={t.experience.title}
        description={t.experience.description}
      />

      <ol className="relative">
        <span className="absolute left-[15px] top-0 h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent sm:left-[19px]" />
        {experienceIds.map((id: ExperienceId, i) => {
          const meta = experiencesMeta[id];
          const copy = t.experience.items[id];
          return (
            <Reveal as="li" key={id} delay={i * 0.04}>
              <div className="relative flex gap-5 pb-10 sm:gap-7">
                <div className="relative z-10 mt-1.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-ink-900 sm:h-10 sm:w-10">
                  <span className="absolute inset-0 -z-10 rounded-full bg-accent/20 blur-md" />
                  <Briefcase size={14} className="text-accent-soft sm:hidden" />
                  <Briefcase
                    size={16}
                    className="hidden text-accent-soft sm:block"
                  />
                </div>

                <div className="glass flex-1 rounded-2xl p-5 sm:p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-display text-lg font-semibold text-white sm:text-xl">
                      {copy.role}
                    </h3>
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">
                      {copy.period}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                    <span className="text-white/80">{copy.company}</span>
                    <span className="text-white/30">·</span>
                    <span className="inline-flex items-center gap-1 text-white/50">
                      <MapPin size={12} /> {copy.location}
                    </span>
                    <span className="chip">
                      {t.experience.types[meta.type]}
                    </span>
                  </div>

                  <ul className="mt-4 space-y-2">
                    {copy.highlights.slice(0, 5).map((h, idx) => (
                      <li
                        key={idx}
                        className="flex gap-3 text-sm leading-relaxed text-white/70"
                      >
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  {meta.stack && meta.stack.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {meta.stack.map((s) => (
                        <span key={s} className="chip">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          );
        })}
      </ol>
    </section>
  );
}
