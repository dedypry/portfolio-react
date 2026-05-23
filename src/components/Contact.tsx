import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";
import { profile } from "../data/portfolio";
import { useT } from "../i18n/useT";

export default function Contact() {
  const { t } = useT();
  return (
    <section id="contact" className="container-x py-28">
      <SectionHeader
        eyebrow={t.contact.eyebrow}
        title={t.contact.title}
        description={t.contact.description}
      />

      <div className="grid gap-5 lg:grid-cols-[1.1fr,1fr]">
        <Reveal>
          <div className="glass relative overflow-hidden rounded-3xl p-8">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-12 h-72 w-72 rounded-full bg-cyan-neon/15 blur-3xl" />

            <div className="relative">
              <h3 className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl">
                {t.contact.cardTitle}
              </h3>
              <p className="mt-3 max-w-md text-white/70">
                {t.contact.cardDescription}
              </p>

              <a href={`mailto:${profile.email}`} className="btn-primary mt-6">
                {t.contact.emailMe} <ArrowRight size={16} />
              </a>

              <div className="mt-8 grid gap-3 text-sm">
                <a
                  href={`mailto:${profile.email}`}
                  className="group flex items-center gap-3 text-white/80 hover:text-white"
                >
                  <Mail size={16} className="text-accent-soft" />
                  {profile.email}
                </a>
                <a
                  href={`tel:${profile.phone.replace(/[^+\d]/g, "")}`}
                  className="group flex items-center gap-3 text-white/80 hover:text-white"
                >
                  <Phone size={16} className="text-accent-soft" />
                  {profile.phone}
                </a>
                <div className="group flex items-center gap-3 text-white/80">
                  <MapPin size={16} className="text-accent-soft" />
                  {profile.location}
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="glass flex h-full flex-col justify-between gap-6 rounded-3xl p-8">
            <div>
              <h3 className="font-display text-xl font-semibold text-white">
                {t.contact.elsewhereTitle}
              </h3>
              <p className="mt-2 text-sm text-white/60">
                {t.contact.elsewhereDescription}
              </p>
            </div>

            <div className="grid gap-3">
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
              >
                <span className="flex items-center gap-3 text-white/85">
                  <FaLinkedin size={18} className="text-accent-soft" />
                  LinkedIn
                </span>
                <ArrowRight
                  size={16}
                  className="text-white/40 transition-transform group-hover:translate-x-1 group-hover:text-white"
                />
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
              >
                <span className="flex items-center gap-3 text-white/85">
                  <FaGithub size={18} className="text-accent-soft" />
                  GitHub
                </span>
                <ArrowRight
                  size={16}
                  className="text-white/40 transition-transform group-hover:translate-x-1 group-hover:text-white"
                />
              </a>
            </div>

            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4 text-sm text-emerald-200/90">
              <span className="mr-2 inline-flex h-2 w-2 rounded-full bg-emerald-400 align-middle" />
              {t.contact.statusOpen}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
