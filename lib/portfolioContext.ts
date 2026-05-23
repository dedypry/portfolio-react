import { en } from "@/i18n/locales/en";
import { id } from "@/i18n/locales/id";
import {
  experienceIds,
  experiencesMeta,
  profile,
  projectIds,
  projectsMeta,
  skillGroupIds,
  skillGroupItems,
} from "@/data/portfolio";

const LOCALES = { en, id };

export type SupportedLanguage = "en" | "id";

/**
 * Compress portfolio + locale into a structured markdown brief.
 *
 * Goals:
 *   - Stay under ~3K tokens (Gemini-Flash context budget is generous,
 *     but smaller prompts = faster + cheaper).
 *   - Be unambiguous: every fact has a clear label so the model can cite it.
 *   - Carry only what the assistant needs to answer common questions.
 */
export function buildPortfolioContext(lang: SupportedLanguage): string {
  const t = LOCALES[lang] ?? LOCALES.en;
  const lines: string[] = [];

  lines.push(`# ${profile.name}`);
  lines.push(`Role: ${t.about.role}`);
  lines.push(`Tagline: ${t.about.tagline}`);
  lines.push(`Location: ${profile.location}`);
  lines.push(`Email: ${profile.email}`);
  lines.push(`Phone: ${profile.phone}`);
  lines.push(`LinkedIn: ${profile.linkedin}`);
  lines.push(`GitHub: ${profile.github}`);
  lines.push(`Open to opportunities: ${profile.available ? "yes" : "no"}`);
  lines.push("");

  lines.push("## Summary");
  lines.push(t.about.description);
  lines.push("");

  lines.push("## Guiding principles");
  for (const item of t.about.items) {
    lines.push(`- **${item.title}**: ${item.body}`);
  }
  lines.push("");

  lines.push("## Experience");
  for (const id of experienceIds) {
    const meta = experiencesMeta[id];
    const copy = t.experience.items[id];
    lines.push(
      `### ${copy.role} @ ${copy.company} (${copy.location}) — ${copy.period} [${t.experience.types[meta.type]}]`
    );
    for (const h of copy.highlights) {
      lines.push(`- ${h}`);
    }
    if (meta.stack && meta.stack.length) {
      lines.push(`Stack: ${meta.stack.join(", ")}`);
    }
    lines.push("");
  }

  lines.push("## Selected projects");
  for (const id of projectIds) {
    const meta = projectsMeta[id];
    const copy = t.projects.items[id];
    lines.push(`### ${copy.name} — ${copy.tagline}`);
    lines.push(copy.description);
    lines.push(
      `Stack: ${meta.stack.join(", ")} · Category: ${meta.category}${meta.link ? ` · Link: ${meta.link}` : ""}`
    );
    lines.push("");
  }

  lines.push("## Featured case study");
  lines.push(`### ${t.caseStudy.title}`);
  lines.push(t.caseStudy.overviewBody);
  lines.push(`Challenges:`);
  for (const c of t.caseStudy.challenges) lines.push(`- ${c}`);
  lines.push(`What Dedy did:`);
  for (const s of t.caseStudy.solutions) lines.push(`- ${s}`);
  lines.push(`Architecture:`);
  for (const a of t.caseStudy.architecture) lines.push(`- ${a.label}: ${a.body}`);
  lines.push(`Impact:`);
  for (const i of t.caseStudy.impact) lines.push(`- ${i}`);
  lines.push("");

  lines.push("## Skills");
  for (const groupId of skillGroupIds) {
    const items =
      groupId === "practices" ? t.skills.practices : skillGroupItems[groupId];
    if (!items.length) continue;
    lines.push(`- ${t.skills.groupTitles[groupId]}: ${items.join(", ")}`);
  }
  lines.push("");

  lines.push("## Education");
  lines.push(
    `${t.skills.education.degree} — ${t.skills.education.school}, ${t.skills.education.location} (${t.skills.education.period})`
  );

  return lines.join("\n");
}
