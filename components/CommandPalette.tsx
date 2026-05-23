"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Download,
  Languages,
  Mail,
  Moon,
  Navigation as NavigationIcon,
  Search,
  Sun,
  X,
} from "lucide-react";
import { profile } from "@/data/portfolio";
import type { Language } from "@/i18n";
import { downloadCV } from "@/utils/downloadCV";
import { useT } from "@/i18n/useT";
import { useTheme } from "@/hooks/useTheme";

type CommandItem = {
  id: string;
  group: string;
  title: string;
  keywords: string;
  icon: ReactNode;
  run: () => void | Promise<void>;
};

function normalize(value: string) {
  return value.toLowerCase().trim();
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t, lang, setLang } = useT();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isCommand = event.metaKey || event.ctrlKey;
      if (isCommand && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(timer);
  }, [open]);

  const commands = useMemo<CommandItem[]>(() => {
    const navigation = [
      ["about", t.nav.about],
      ["experience", t.nav.experience],
      ["projects", t.nav.projects],
      ["case-study", t.caseStudy.eyebrow],
      ["skills", t.nav.skills],
      ["contact", t.nav.contact],
    ] as const;

    return [
      ...navigation.map(([id, label]) => ({
        id: `go-${id}`,
        group: t.command.groups.navigation,
        title: label,
        keywords: `${id} ${label}`,
        icon: <NavigationIcon size={16} />,
        run: () => {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
          setOpen(false);
        },
      })),
      {
        id: "download-cv",
        group: t.command.groups.actions,
        title: t.command.actions.downloadCv,
        keywords: "download cv pdf resume",
        icon: <Download size={16} />,
        run: async () => {
          await downloadCV(lang);
          setOpen(false);
        },
      },
      {
        id: "copy-email",
        group: t.command.groups.actions,
        title: copied ? t.command.actions.emailCopied : t.command.actions.copyEmail,
        keywords: "copy email contact mail",
        icon: copied ? <Check size={16} /> : <Mail size={16} />,
        run: async () => {
          await navigator.clipboard.writeText(profile.email);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1400);
        },
      },
      {
        id: "toggle-theme",
        group: t.command.groups.preferences,
        title: t.command.actions.toggleTheme,
        keywords: "theme dark light mode",
        icon: theme === "dark" ? <Sun size={16} /> : <Moon size={16} />,
        run: () => {
          toggleTheme();
          setOpen(false);
        },
      },
      {
        id: "switch-language",
        group: t.command.groups.preferences,
        title: `${t.command.actions.switchLanguage}: ${
          lang === "en" ? "Bahasa Indonesia" : "English"
        }`,
        keywords: "language bahasa english indonesia translate i18n",
        icon: <Languages size={16} />,
        run: () => {
          setLang((lang === "en" ? "id" : "en") as Language);
          setOpen(false);
        },
      },
    ];
  }, [copied, lang, setLang, t, theme, toggleTheme]);

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return commands;
    return commands.filter((item) =>
      normalize(`${item.title} ${item.group} ${item.keywords}`).includes(q)
    );
  }, [commands, query]);

  const grouped = useMemo(() => {
    return filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
      acc[item.group] ??= [];
      acc[item.group].push(item);
      return acc;
    }, {});
  }, [filtered]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-medium text-white/65 transition-colors hover:border-white/25 hover:bg-white/[0.06] hover:text-white lg:inline-flex"
        aria-label={t.nav.commandPalette}
      >
        <Search size={14} />
        <span>{t.nav.commandPalette}</span>
        <kbd className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-white/45">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-start justify-center bg-ink-950/70 px-4 pt-24 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              className="absolute inset-0 cursor-default"
              aria-label="Close command palette"
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="glass relative w-full max-w-2xl overflow-hidden rounded-3xl shadow-[0_24px_100px_-35px_rgba(0,0,0,0.85)]"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
                <Search size={18} className="text-accent-soft" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t.command.placeholder}
                  className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35"
                />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full p-2 text-white/50 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-3">
                {Object.entries(grouped).map(([group, items]) => (
                  <div key={group} className="mb-3 last:mb-0">
                    <div className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
                      {group}
                    </div>
                    <div className="space-y-1">
                      {items.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => void item.run()}
                          className="group flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left transition-colors hover:bg-white/[0.06]"
                        >
                          <span className="flex items-center gap-3">
                            <span className="grid h-8 w-8 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-white/60 group-hover:text-white">
                              {item.icon}
                            </span>
                            <span className="text-sm font-medium text-white/85">
                              {item.title}
                            </span>
                          </span>
                          <ArrowRight
                            size={15}
                            className="text-white/30 transition-transform group-hover:translate-x-1 group-hover:text-white"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 px-4 py-3 text-xs text-white/35">
                {t.command.hint}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
