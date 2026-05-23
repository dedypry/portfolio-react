"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useT } from "@/i18n/useT";

type ThemeToggleProps = {
  compact?: boolean;
};

export default function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useT();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={t.nav.themeLabel}
      className={`group inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.03] text-sm font-semibold text-white/80 transition-all hover:border-white/25 hover:bg-white/[0.06] hover:text-white ${
        compact ? "h-9 w-9" : "px-3 py-2"
      }`}
    >
      <span className="relative grid h-4 w-4 place-items-center">
        <Sun
          size={16}
          className={`absolute transition-all ${
            isLight ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-75 opacity-0"
          }`}
        />
        <Moon
          size={16}
          className={`absolute transition-all ${
            isLight ? "rotate-90 scale-75 opacity-0" : "rotate-0 scale-100 opacity-100"
          }`}
        />
      </span>
      {!compact && (
        <span className="hidden text-xs md:inline">
          {isLight ? t.nav.themeLight : t.nav.themeDark}
        </span>
      )}
    </button>
  );
}
