import { z } from "zod";

import { SUPPORTED_LANGUAGES } from "@/i18n/config";

const localeKeys = SUPPORTED_LANGUAGES;

/**
 * Helper: build a JSON-shaped translations object validator from a single
 * locale schema. Produces e.g. `{ en: schema, id: schema }`.
 */
function translationsOf<T extends z.ZodTypeAny>(schema: T) {
  const shape = Object.fromEntries(
    localeKeys.map((key) => [key, schema] as const)
  ) as Record<(typeof localeKeys)[number], T>;
  return z.object(shape);
}

/* ─── Profile ──────────────────────────────────────────────── */

export const profileTxSchema = z.object({
  role: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  headlineLine1: z.string().min(1),
  headlineHighlight: z.string().min(1),
});

export const profileSchema = z.object({
  name: z.string().min(1, "Required"),
  initials: z.string().min(1).max(4),
  email: z.string().email(),
  phone: z.string().min(1),
  location: z.string().min(1),
  linkedin: z.string().min(1),
  github: z.string().min(1),
  available: z.boolean(),
  translations: translationsOf(profileTxSchema),
});

export type ProfileInput = z.infer<typeof profileSchema>;

/* ─── Experience ───────────────────────────────────────────── */

export const experienceTxSchema = z.object({
  role: z.string().min(1),
  highlights: z.array(z.string().min(1)).min(1),
});

export const experienceSchema = z.object({
  company: z.string().min(1),
  location: z.string().min(1),
  period: z.string().min(1),
  type: z.enum(["FULL_TIME", "CONTRACT", "FREELANCE", "INTERNSHIP"]),
  stack: z.array(z.string()),
  order: z.number().int(),
  translations: translationsOf(experienceTxSchema),
});

export type ExperienceInput = z.infer<typeof experienceSchema>;

/* ─── Education ────────────────────────────────────────────── */

export const educationTxSchema = z.object({
  degree: z.string().min(1),
  description: z.string(),
});

export const educationSchema = z.object({
  school: z.string().min(1),
  location: z.string().min(1),
  period: z.string().min(1),
  order: z.number().int(),
  translations: translationsOf(educationTxSchema),
});

export type EducationInput = z.infer<typeof educationSchema>;

/* ─── Project ──────────────────────────────────────────────── */

export const projectTxSchema = z.object({
  name: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
});

export const projectSchema = z.object({
  category: z.string().min(1),
  accent: z.string(),
  link: z.string(),
  stack: z.array(z.string()),
  coverImage: z.string(),
  order: z.number().int(),
  featured: z.boolean(),
  translations: translationsOf(projectTxSchema),
});

export type ProjectInput = z.infer<typeof projectSchema>;

/* ─── Skill group / skill ──────────────────────────────────── */

export const skillGroupTxSchema = z.object({
  title: z.string().min(1),
});

export const skillGroupSchema = z.object({
  key: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "lowercase letters, digits, hyphens only"),
  order: z.number().int(),
  translations: translationsOf(skillGroupTxSchema),
});

export type SkillGroupInput = z.infer<typeof skillGroupSchema>;

export const skillSchema = z.object({
  name: z.string().min(1),
  proficiency: z.number().int().min(1).max(5).nullable(),
  order: z.number().int(),
  groupId: z.string().min(1),
});

export type SkillInput = z.infer<typeof skillSchema>;

/* ─── Blog ─────────────────────────────────────────────────── */

export const blogTxSchema = z.object({
  title: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string().min(1),
});

export const blogSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "lowercase letters, digits, hyphens only"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  publishedAt: z.string().nullable(),
  coverImage: z.string(),
  tags: z.array(z.string()),
  translations: translationsOf(blogTxSchema),
});

export type BlogInput = z.infer<typeof blogSchema>;

/* ─── Auth ─────────────────────────────────────────────────── */

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Minimum 6 karakter"),
});

export type LoginInput = z.infer<typeof loginSchema>;
