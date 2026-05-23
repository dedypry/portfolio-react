/**
 * Server-side AI assist utilities for the admin panel.
 *
 * Wraps Google Gemini (same SDK we use for the public chat feature) with
 * carefully scoped prompts for portfolio copywriting:
 *   - improveText:        polish an existing string
 *   - generateField:      synthesize a field value from sibling-field context
 *   - translateText:      bilingual translation between EN/ID
 *
 * All callers MUST be auth-checked first. This module does NOT re-check auth.
 */
import { GoogleGenerativeAI } from "@google/generative-ai";

import type { Language } from "@/i18n/config";

const LANG_LABEL: Record<Language, string> = {
  en: "English",
  id: "Bahasa Indonesia",
};

/**
 * Per-field guidance the model uses to keep voice consistent. Add new field
 * types here as we wire AI into more forms (blog, experience, etc).
 */
export type FieldType =
  | "project.name"
  | "project.tagline"
  | "project.description"
  | "blog.title"
  | "blog.excerpt"
  | "blog.content"
  | "experience.role"
  | "experience.highlight"
  | "education.degree"
  | "education.description"
  | "profile.role"
  | "profile.headlineLine"
  | "profile.headlineHighlight"
  | "profile.tagline"
  | "profile.description"
  | "freeform";

const FIELD_GUIDE: Record<FieldType, string> = {
  "project.name": "A short product/project name. 2–5 words. No punctuation.",
  "project.tagline":
    "A one-line tagline (max ~80 chars). Punchy, descriptive, no marketing fluff.",
  "project.description":
    "2–3 sentences describing what the project is, who it's for, and what makes it interesting. No bullet points.",
  "blog.title": "A blog post title. Concise, specific, max ~70 chars.",
  "blog.excerpt":
    "A 1–2 sentence summary that hooks the reader. ~140–180 chars.",
  "blog.content":
    "A blog post body in clean HTML. Use <h2>/<h3>, <p>, <ul>, <li>, <code>. No <script>.",
  "experience.role":
    "Job title (e.g. 'Lead E-commerce Engineer'). Title-case, no marketing fluff.",
  "experience.highlight":
    "One bullet point describing an accomplishment. Past tense, action verb first, ~15–25 words.",
  "education.degree":
    "Formal degree name (e.g. \"Bachelor's Degree, Computer Science\").",
  "education.description":
    "1–2 sentences. Optional notes on the program or thesis.",
  "profile.role":
    "Concise role headline shown beside the name (e.g. 'Engineering Lead · Full-Stack Architect'). Use ' · ' to separate two facets. No trailing period.",
  "profile.headlineLine":
    "The opening of a hero headline. ~3-6 words, verb-led, ends WITHOUT punctuation so a separate highlight phrase completes it. Example: 'I build software'.",
  "profile.headlineHighlight":
    "The closing 1-3 words of the hero headline. Punchy, completes the opening line. Lowercase unless it's a proper noun. Example: 'that ships.'",
  "profile.tagline":
    "1–2 sentences (max ~200 chars) explaining what kind of work the person does. First-person, present tense.",
  "profile.description":
    "A short paragraph (3–5 sentences) introducing the engineer's philosophy and approach. First-person.",
  freeform: "Maintain the original intent. Improve clarity and grammar.",
};

interface GeminiCallOpts {
  /** Lower = more deterministic. 0.4 is a good default for copywriting. */
  temperature?: number;
  /** Max output tokens. Bigger fields (blog.content) need more. */
  maxOutputTokens?: number;
}

/**
 * Low-level helper: send a prompt to Gemini and return the trimmed text
 * response. Throws if the API key is missing or the upstream call fails.
 */
async function callGemini(
  prompt: string,
  { temperature = 0.4, maxOutputTokens = 600 }: GeminiCallOpts = {}
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Add it to your environment."
    );
  }

  const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature,
      topP: 0.9,
      maxOutputTokens,
    },
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  // Strip common LLM wrappers that sometimes slip through despite explicit
  // instructions (markdown code fences, surrounding quotes).
  return text
    .replace(/^```(?:html|md|markdown|text)?\n?/i, "")
    .replace(/\n?```$/i, "")
    .replace(/^["'`](.*)["'`]$/s, "$1")
    .trim();
}

/* ─────────────────────────────────────────────── Improve ─── */

/**
 * Polish an existing piece of copy. Keeps the original meaning but tightens
 * grammar, voice, and word choice for the given field type and language.
 */
export async function improveText(args: {
  text: string;
  lang: Language;
  fieldType: FieldType;
}): Promise<string> {
  const { text, lang, fieldType } = args;
  const guide = FIELD_GUIDE[fieldType];

  const prompt = [
    `You are a senior copy editor for a software engineer's portfolio.`,
    `Improve the following ${fieldType} written in ${LANG_LABEL[lang]}.`,
    `Constraints:`,
    `- ${guide}`,
    `- Keep the original meaning and any specific facts unchanged.`,
    `- Match the existing tone (confident, professional, no hype).`,
    `- Output ONLY the improved text. No preface, no quotes, no markdown fences, no explanation.`,
    ``,
    `Original:`,
    text,
  ].join("\n");

  return callGemini(prompt, {
    temperature: 0.4,
    maxOutputTokens: fieldType === "blog.content" ? 4000 : 700,
  });
}

/* ─────────────────────────────────────────── Generate ─── */

/**
 * Generate a field value from scratch using sibling-field context. Useful for
 * "auto-fill description" once name + tagline + stack are filled in.
 */
export async function generateField(args: {
  fieldType: FieldType;
  lang: Language;
  context: Record<string, string | string[] | undefined>;
}): Promise<string> {
  const { fieldType, lang, context } = args;
  const guide = FIELD_GUIDE[fieldType];

  const ctxLines = Object.entries(context)
    .filter(([, v]) => v && (Array.isArray(v) ? v.length : true))
    .map(([k, v]) => `- ${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
    .join("\n");

  const prompt = [
    `You are a senior copywriter for a software engineer's portfolio.`,
    `Write the ${fieldType} field in ${LANG_LABEL[lang]} based on the context below.`,
    `Constraints:`,
    `- ${guide}`,
    `- Be specific. Avoid generic marketing language ("revolutionary", "cutting-edge").`,
    `- Output ONLY the generated text. No preface, no quotes, no markdown fences.`,
    ``,
    `Context:`,
    ctxLines || "(none)",
  ].join("\n");

  return callGemini(prompt, {
    temperature: 0.6,
    maxOutputTokens: fieldType === "blog.content" ? 4000 : 700,
  });
}

/* ──────────────────────────────────────────── Translate ─── */

/**
 * Translate `text` from `fromLang` to `toLang`, preserving technical terms
 * and field-specific tone.
 */
export async function translateText(args: {
  text: string;
  fromLang: Language;
  toLang: Language;
  fieldType: FieldType;
}): Promise<string> {
  const { text, fromLang, toLang, fieldType } = args;
  if (fromLang === toLang) return text;

  const guide = FIELD_GUIDE[fieldType];

  const prompt = [
    `You are a professional translator working on a software engineer's portfolio website.`,
    `Translate the following ${fieldType} from ${LANG_LABEL[fromLang]} to ${LANG_LABEL[toLang]}.`,
    `Constraints:`,
    `- ${guide}`,
    `- Preserve technical terms ("backend", "API", framework names) — do not over-translate.`,
    `- Match the original tone and length.`,
    `- Output ONLY the translation. No preface, no notes, no markdown fences, no quotes.`,
    ``,
    `Source (${LANG_LABEL[fromLang]}):`,
    text,
  ].join("\n");

  return callGemini(prompt, {
    temperature: 0.3,
    maxOutputTokens: fieldType === "blog.content" ? 4000 : 700,
  });
}
