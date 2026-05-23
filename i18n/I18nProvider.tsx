"use client";

import { useMemo } from "react";
import i18next, { type i18n as I18nInstance } from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { en } from "./locales/en";
import { id } from "./locales/id";
import { type Language, SUPPORTED_LANGUAGES } from "./config";

/**
 * Build a fresh i18next instance scoped to the current locale.
 *
 * We don't initialize a global singleton because the locale is driven by the
 * Next.js path segment ([lang]). Each route mount carries the lang prop and
 * Provider unmount/remount on language change keeps state predictable.
 */
function buildI18n(lang: Language): I18nInstance {
  const instance = i18next.createInstance();
  void instance.use(initReactI18next).init({
    lng: lang,
    fallbackLng: "en",
    supportedLngs: [...SUPPORTED_LANGUAGES],
    resources: {
      en: { translation: en },
      id: { translation: id },
    },
    interpolation: { escapeValue: false },
    returnNull: false,
    react: { useSuspense: false },
  });
  return instance;
}

export default function I18nProvider({
  lang,
  children,
}: {
  lang: Language;
  children: React.ReactNode;
}) {
  const i18n = useMemo(() => buildI18n(lang), [lang]);
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
