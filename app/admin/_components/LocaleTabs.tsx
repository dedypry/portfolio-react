"use client";

import { useState } from "react";

import { SUPPORTED_LANGUAGES, type Language } from "@/i18n/config";

interface LocaleTabsProps {
  /**
   * Render function called once per locale. Each call receives the locale key,
   * so you can spread `register("translations.<lang>.field")`.
   */
  render: (lang: Language) => React.ReactNode;
  defaultLang?: Language;
}

const labelMap: Record<Language, string> = {
  en: "English",
  id: "Bahasa Indonesia",
};

export function LocaleTabs({ render, defaultLang = "en" }: LocaleTabsProps) {
  const [active, setActive] = useState<Language>(defaultLang);

  return (
    <div className="space-y-4">
      <div
        role="tablist"
        className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-slate-900/60 p-1"
      >
        {SUPPORTED_LANGUAGES.map((lang) => {
          const selected = active === lang;
          return (
            <button
              key={lang}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(lang)}
              className={[
                "rounded-md px-3 py-1.5 text-xs font-medium transition",
                selected
                  ? "bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white shadow"
                  : "text-slate-400 hover:bg-white/5 hover:text-white",
              ].join(" ")}
            >
              {labelMap[lang]}
            </button>
          );
        })}
      </div>

      {/*
        Render every tab but hide inactive ones with CSS. This keeps form state
        intact across tab switches (vs unmount/remount which would lose any
        unsynced react-hook-form values).
      */}
      <div className="space-y-4">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <div
            key={lang}
            role="tabpanel"
            hidden={lang !== active}
            className="space-y-4"
          >
            {render(lang)}
          </div>
        ))}
      </div>
    </div>
  );
}
