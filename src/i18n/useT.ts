import { useTranslation } from "react-i18next";
import type { TranslationShape } from "./locales/en";
import type { Language } from "./index";

/**
 * Strongly-typed access to the current translation tree.
 * `t.path.to.key` instead of stringly-typed `t('path.to.key')`.
 */
export function useT(): { t: TranslationShape; lang: Language; setLang: (l: Language) => void } {
  const { i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage ?? i18n.language ?? "en") as Language;
  const t = (i18n.getResourceBundle(lang, "translation") ??
    i18n.getResourceBundle("en", "translation")) as TranslationShape;

  return {
    t,
    lang,
    setLang: (l: Language) => {
      void i18n.changeLanguage(l);
    },
  };
}
