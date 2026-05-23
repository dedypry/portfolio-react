import { Compass, Layers, Rocket } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import { philosophy, profile } from "../data/portfolio";

const icons = [Layers, Compass, Rocket];

export default function About() {
  return (
    <section id="about" className="container-x py-28">
      <SectionHeader
        eyebrow="About"
        title="A pragmatic engineer who leads from the keyboard."
        description={profile.intro}
      />

      <div className="grid gap-4 md:grid-cols-3">
        {philosophy.map((p, i) => {
          const Icon = icons[i % icons.length];
          return (
            <Reveal key={p.title} delay={i * 0.08}>
              <article className="glass group relative h-full overflow-hidden rounded-3xl p-6 transition-colors hover:border-white/15">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/10 blur-3xl transition-opacity group-hover:bg-accent/20" />
                <div className="relative">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-accent/30 to-cyan-neon/20 ring-1 ring-white/10">
                    <Icon size={20} className="text-white" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold text-white">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    {p.body}
                  </p>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
