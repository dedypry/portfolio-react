"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Download, Mail, Sparkles } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { downloadCV } from "@/utils/downloadCV";
import { useT } from "@/i18n/useT";
import type { ProfileView } from "@/lib/queries";

interface HeroProps {
  profile: ProfileView;
}

export default function Hero({ profile }: HeroProps) {
  const [downloading, setDownloading] = useState(false);
  const { t, lang } = useT();

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      await downloadCV(lang);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section
      id="top"
      className="relative overflow-hidden pb-24 pt-36 sm:pt-40 lg:pt-44"
    >
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-[0.18] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_30%,#000_40%,transparent_75%)] animate-gridmove" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-0 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-accent/30 blur-[140px]" />
      <div className="pointer-events-none absolute right-0 top-20 -z-0 h-72 w-72 rounded-full bg-cyan-neon/20 blur-[120px]" />

      <div className="container-x relative">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-start gap-6 lg:col-span-7"
          >
            <span className="chip">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              {profile.available ? t.hero.statusOpen : t.hero.statusBusy}
            </span>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.1,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-display text-[clamp(2.2rem,5vw,4.4rem)] font-bold leading-[1.05] tracking-tight"
            >
              {t.hero.greeting}{" "}
              <span className="gradient-text">{profile.name}</span>.
              <br />
              {profile.headlineLine1}
              <span className="relative ml-3 inline-block">
                <span className="gradient-text">{profile.headlineHighlight}</span>
                <Sparkles
                  className="absolute -right-7 -top-3 text-cyan-neon"
                  size={22}
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="max-w-2xl text-lg text-white/70 sm:text-xl"
            >
              {profile.tagline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="mt-2 flex flex-wrap items-center gap-3"
            >
              <a href="#contact" className="btn-primary">
                {t.hero.primaryCta} <ArrowRight size={16} />
              </a>
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="btn-ghost disabled:cursor-wait disabled:opacity-60"
              >
                <Download size={16} />
                {downloading ? t.nav.generating : t.nav.downloadCV}
              </button>
              <div className="ml-auto flex items-center gap-1 sm:ml-2">
                <a
                  href={`mailto:${profile.email}`}
                  className="rounded-full p-3 text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                  aria-label="Email"
                >
                  <Mail size={18} />
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full p-3 text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin size={18} />
                </a>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full p-3 text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                  aria-label="GitHub"
                >
                  <FaGithub size={18} />
                </a>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-sm lg:col-span-5 lg:mx-0 lg:max-w-none"
          >
            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.4rem] bg-gradient-to-br from-accent/40 via-fuchsia-500/10 to-cyan-neon/30 opacity-60 blur-3xl" />

            <div className="relative aspect-[4/5] w-full">
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-accent via-fuchsia-500 to-cyan-neon p-[1.5px] shadow-[0_30px_80px_-20px_rgba(124,92,255,0.5)]">
                <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-ink-900">
                  <Image
                    src="/profile.png"
                    alt={profile.name}
                    fill
                    sizes="(max-width: 1024px) 90vw, 36rem"
                    priority
                    className="object-cover [filter:saturate(1.05)_contrast(1.02)]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/10 to-transparent" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-accent/20 via-transparent to-cyan-neon/15 mix-blend-overlay" />

                  <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl border border-white/10 bg-ink-950/60 px-4 py-3 backdrop-blur-md">
                    <div>
                      <div className="text-xs uppercase tracking-[0.2em] text-white/50">
                        {t.hero.portraitNowLabel}
                      </div>
                      <div className="text-sm font-medium text-white">
                        {t.hero.portraitNowValue}
                      </div>
                    </div>
                    <span className="flex h-2 w-2">
                      <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 12, y: -10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="absolute -right-3 -top-3 hidden rotate-3 sm:block"
              >
                <div className="glass rounded-2xl px-3 py-2 text-xs">
                  <div className="font-mono uppercase tracking-[0.18em] text-white/50">
                    {t.hero.chipSinceLabel}
                  </div>
                  <div className="font-display text-sm font-semibold text-white">
                    {t.hero.chipSinceValue}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -12, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="absolute -left-4 top-10 hidden -rotate-6 sm:block"
              >
                <div className="glass rounded-2xl px-3 py-2 text-xs">
                  <div className="font-mono uppercase tracking-[0.18em] text-white/50">
                    {t.hero.chipStackLabel}
                  </div>
                  <div className="font-display text-sm font-semibold text-white">
                    {t.hero.chipStackValue}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
        >
          {t.hero.stats.map((s) => (
            <div
              key={s.label}
              className="glass relative overflow-hidden rounded-2xl p-5"
            >
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
              <div className="font-display text-3xl font-bold tracking-tight gradient-text">
                {s.value}
              </div>
              <div className="mt-1 text-xs uppercase tracking-[0.18em] text-white/50">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
