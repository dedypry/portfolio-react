"use client";

import { profile } from "@/data/portfolio";
import { useT } from "@/i18n/useT";

export default function Footer() {
  const { t } = useT();
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="container-x flex flex-col items-start justify-between gap-3 text-xs text-white/50 sm:flex-row sm:items-center">
        <div>
          © {new Date().getFullYear()} {profile.name}. {t.footer.crafted}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          {t.footer.location}
        </div>
      </div>
    </footer>
  );
}
