"use client";

import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { usePathname, useRouter } from "next/navigation";
import {
  DEFAULT_LANGUAGE,
  isLanguage,
  type Language,
  SUPPORTED_LANGUAGES,
} from "./config";
import type { TranslationShape } from "./locales/en";

/**
 * Strongly-typed access to the current translation tree, plus a helper to
 * switch language by navigating to the corresponding [lang] route segment.
 *
 *   const { t, lang, setLang } = useT();
 *   t.nav.about        // typed as string
 *   setLang("id")      // routes to /id/<rest of path>
 */
export function useT(): {
  t: TranslationShape;
  lang: Language;
  setLang: (next: Language) => void;
} {
  const { i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname() ?? "/";

  const detected = (i18n.resolvedLanguage ?? i18n.language ?? DEFAULT_LANGUAGE) as string;
  const lang: Language = isLanguage(detected) ? detected : DEFAULT_LANGUAGE;

  const t =
    (i18n.getResourceBundle(lang, "translation") as TranslationShape | undefined) ??
    (i18n.getResourceBundle("en", "translation") as TranslationShape);

  const setLang = useCallback(
    (next: Language) => {
      if (next === lang) return;
      const segments = pathname.split("/").filter(Boolean);
      if (segments.length > 0 && SUPPORTED_LANGUAGES.includes(segments[0] as Language)) {
        segments[0] = next;
      } else {
        segments.unshift(next);
      }
      const target = "/" + segments.join("/");
      router.push(target);
    },
    [lang, pathname, router]
  );

  return { t, lang, setLang };
}
