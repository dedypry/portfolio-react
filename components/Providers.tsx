"use client";

import I18nProvider from "@/i18n/I18nProvider";
import { ThemeProvider } from "@/hooks/useTheme";
import type { Language } from "@/i18n";

export default function Providers({
  lang,
  children,
}: {
  lang: Language;
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <I18nProvider lang={lang}>{children}</I18nProvider>
    </ThemeProvider>
  );
}
