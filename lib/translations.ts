import type { Language } from "@/i18n";

export type Translations<T> = Record<Language, T>;

export function pickT<T>(
  translations: unknown,
  lang: Language,
  fallback: T
): T {
  if (!translations || typeof translations !== "object") return fallback;
  const tx = translations as Translations<T>;
  return tx[lang] ?? tx.en ?? fallback;
}

export interface ProfileTx {
  role: string;
  tagline: string;
  description: string;
  headlineLine1: string;
  headlineHighlight: string;
}

export interface ExperienceTx {
  role: string;
  highlights: string[];
}

export interface EducationTx {
  degree: string;
  description?: string;
}

export interface ProjectTx {
  name: string;
  tagline: string;
  description: string;
}

export interface SkillGroupTx {
  title: string;
}

export interface BlogTx {
  title: string;
  excerpt: string;
  content: string;
}
