export const SUPPORTED_LANGUAGES = ["en", "id"] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];
export const DEFAULT_LANGUAGE: Language = "en";

export const LANGUAGE_LABELS: Record<Language, { code: string; name: string }> = {
  en: { code: "EN", name: "English" },
  id: { code: "ID", name: "Bahasa Indonesia" },
};

export function isLanguage(value: unknown): value is Language {
  return value === "en" || value === "id";
}
