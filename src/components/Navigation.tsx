import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, Menu, X } from "lucide-react";
import { profile } from "../data/portfolio";
import { useActiveSection } from "../hooks/useActiveSection";
import { downloadCV } from "../utils/downloadCV";
import { useT } from "../i18n/useT";
import LanguageSwitcher from "./LanguageSwitcher";

const SECTION_IDS = ["top", "about", "experience", "projects", "skills", "contact"];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const { t, lang } = useT();
  const active = useActiveSection(SECTION_IDS, 140);

  const links = [
    { id: "about", label: t.nav.about },
    { id: "experience", label: t.nav.experience },
    { id: "projects", label: t.nav.projects },
    { id: "skills", label: t.nav.skills },
    { id: "contact", label: t.nav.contact },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/5 bg-ink-950/70 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between gap-4">
        <a
          href="#top"
          className="group inline-flex items-center gap-2 font-display text-sm font-bold tracking-tight"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-accent to-cyan-neon text-ink-950 shadow-glow transition-transform group-hover:rotate-3">
            {profile.initials}
          </span>
          <span className="hidden sm:inline">{profile.name}</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const isActive = active === l.id;
            return (
              <li key={l.id} className="relative">
                <a
                  href={`#${l.id}`}
                  className={`relative inline-flex rounded-full px-4 py-2 text-sm transition-colors ${
                    isActive ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-white/[0.07] ring-1 ring-white/10"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                    />
                  )}
                  {l.label}
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gradient-to-r from-accent to-cyan-neon shadow-[0_0_10px_rgba(124,92,255,0.9)]" />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="btn-ghost hidden !px-4 !py-2 text-xs disabled:cursor-wait disabled:opacity-60 md:inline-flex"
          >
            <Download size={14} />
            {downloading ? t.nav.generating : t.nav.downloadCV}
          </button>
          <a
            href="#contact"
            className="btn-primary hidden !px-5 !py-2 text-xs md:inline-flex"
          >
            {t.nav.letsTalk}
          </a>

          <button
            className="rounded-lg border border-white/10 bg-white/5 p-2 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={t.nav.toggleMenu}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-white/5 bg-ink-950/95 backdrop-blur-xl md:hidden">
          <div className="container-x flex flex-col gap-1 py-3">
            {links.map((l) => {
              const isActive = active === l.id;
              return (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between rounded-lg px-3 py-3 text-sm transition-colors ${
                    isActive
                      ? "bg-white/[0.06] text-white"
                      : "text-white/80 hover:bg-white/5"
                  }`}
                >
                  {l.label}
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-accent to-cyan-neon shadow-[0_0_10px_rgba(124,92,255,0.9)]" />
                  )}
                </a>
              );
            })}

            <div className="mt-2 px-2">
              <LanguageSwitcher variant="full" />
            </div>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                handleDownload();
              }}
              disabled={downloading}
              className="btn-ghost mt-2"
            >
              <Download size={14} />
              {downloading ? t.nav.generating : t.nav.downloadCV}
            </button>
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="btn-primary mt-2"
            >
              {t.nav.letsTalk}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
