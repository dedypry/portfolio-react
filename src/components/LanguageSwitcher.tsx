import { motion } from "framer-motion";
import { Languages } from "lucide-react";
import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES } from "../i18n";
import { useT } from "../i18n/useT";

type Variant = "compact" | "full";

export default function LanguageSwitcher({
  variant = "compact",
}: {
  variant?: Variant;
}) {
  const { lang, setLang, t } = useT();

  if (variant === "full") {
    return (
      <div className="flex flex-col gap-2">
        <span className="flex items-center gap-2 px-3 text-xs uppercase tracking-[0.18em] text-white/40">
          <Languages size={14} /> {t.nav.languageLabel}
        </span>
        <div className="flex gap-2">
          {SUPPORTED_LANGUAGES.map((l) => {
            const isActive = lang === l;
            return (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={`flex-1 rounded-xl border px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "border-accent/60 bg-accent/15 text-white"
                    : "border-white/10 bg-white/[0.02] text-white/70 hover:border-white/20 hover:text-white"
                }`}
              >
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.18em]">
                  {LANGUAGE_LABELS[l].code}
                </span>
                <span className="ml-2 text-xs text-white/60">
                  {LANGUAGE_LABELS[l].name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative flex items-center gap-0.5 rounded-full border border-white/10 bg-white/[0.03] p-0.5"
      role="group"
      aria-label={t.nav.languageLabel}
    >
      {SUPPORTED_LANGUAGES.map((l) => {
        const isActive = lang === l;
        return (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            aria-pressed={isActive}
            aria-label={LANGUAGE_LABELS[l].name}
            className={`relative z-10 rounded-full px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${
              isActive ? "text-ink-950" : "text-white/60 hover:text-white"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-accent to-cyan-neon"
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
              />
            )}
            {LANGUAGE_LABELS[l].code}
          </button>
        );
      })}
    </div>
  );
}
