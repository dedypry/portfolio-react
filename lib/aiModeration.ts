/**
 * AI-powered comment moderation + auto-reply for blog posts.
 *
 * Two responsibilities:
 *   1. moderateComment() — judge whether a comment is safe to auto-publish
 *      (no profanity, slurs, harassment, spam, or off-topic abuse).
 *   2. generateBlogReply() — given the blog's content + the visitor's
 *      comment, produce a short friendly reply in the same language.
 *
 * Both use Gemini (same SDK as the public chat). Designed to be called from
 * background jobs after the API route returns 201 — failure modes are
 * intentionally graceful: the comment stays PENDING if AI is unreachable,
 * so the admin can still moderate manually from /admin/comments.
 */
import "server-only";
import { GoogleGenerativeAI } from "@google/generative-ai";

import type { Language } from "@/i18n/config";

export interface ModerationVerdict {
  approved: boolean;
  /** "low" or "high" severity. Only present when approved=false. */
  severity?: "low" | "high";
  /** Short human-readable reason — shown to admins, not visitors. */
  reason?: string;
  /** Suggested status: APPROVED / REJECTED / SPAM. */
  recommendation: "APPROVE" | "REJECT" | "SPAM";
}

const MODEL_NAME = process.env.GEMINI_MODEL || "gemini-2.0-flash";

function getModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY missing");
  }
  return new GoogleGenerativeAI(apiKey).getGenerativeModel({
    model: MODEL_NAME,
  });
}

/* ─── Moderation ────────────────────────────────────────────── */

const MODERATION_PROMPT = (text: string, lang: Language) =>
  [
    "You are a comment moderation classifier for a blog.",
    "Classify the comment below according to whether it should be auto-published.",
    "",
    "REJECT (set approved=false, recommendation='REJECT') if it contains:",
    "- Profanity, slurs, hateful language, or insults",
    "- Personal attacks, harassment, or threats",
    "- Sexual or violent content",
    "- Discriminatory remarks (race, religion, gender, sexuality, etc.)",
    "",
    "MARK AS SPAM (recommendation='SPAM') if it's:",
    "- Pure advertising / unrelated promotion",
    "- Many links + no substance",
    "- Random gibberish / keyboard-mashing",
    "",
    "APPROVE (recommendation='APPROVE') if the comment is normal — questions,",
    "thoughts, light disagreement, or even mild criticism are fine. Be liberal:",
    "only reject when there's a real problem.",
    "",
    `The comment is in ${lang === "id" ? "Bahasa Indonesia" : "English"}.`,
    "",
    "Return ONLY a single JSON object on one line, no prose, no fences:",
    `{"approved":boolean,"recommendation":"APPROVE"|"REJECT"|"SPAM","severity":"low"|"high","reason":"<10 words>"}`,
    "",
    "Comment:",
    text,
  ].join("\n");

/**
 * Run the moderation classifier. Returns a structured verdict; the caller
 * decides what to do with it. NEVER throws on a "yikes, model returned junk"
 * — instead returns a conservative `approved: false` with a "manual review"
 * reason so the comment lands in admin moderation.
 */
export async function moderateComment(
  text: string,
  lang: Language
): Promise<ModerationVerdict> {
  try {
    const result = await getModel().generateContent({
      contents: [
        { role: "user", parts: [{ text: MODERATION_PROMPT(text, lang) }] },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 200,
        responseMimeType: "application/json",
      },
    });

    const raw = result.response.text().trim();
    const cleaned = raw
      .replace(/^```(?:json)?\n?/i, "")
      .replace(/\n?```$/i, "")
      .trim();
    const parsed = JSON.parse(cleaned) as Partial<ModerationVerdict>;

    const recommendation =
      parsed.recommendation === "REJECT" || parsed.recommendation === "SPAM"
        ? parsed.recommendation
        : "APPROVE";

    return {
      approved: recommendation === "APPROVE",
      severity:
        parsed.severity === "high" || parsed.severity === "low"
          ? parsed.severity
          : undefined,
      reason: typeof parsed.reason === "string" ? parsed.reason : undefined,
      recommendation,
    };
  } catch (err) {
    // Don't auto-approve on errors — that would be the unsafe default. Admin
    // can still approve manually from /admin/comments.
    if (process.env.NODE_ENV === "development") {
      console.warn("[aiModeration] failed, falling back to manual:", err);
    }
    return {
      approved: false,
      recommendation: "REJECT",
      reason: "Classifier unavailable; awaiting manual review.",
    };
  }
}

/* ─── AI reply ──────────────────────────────────────────────── */

interface BlogContext {
  title: string;
  excerpt: string;
  /** Plain-text version of the blog body (HTML stripped). Truncated upstream. */
  contentPlain: string;
  authorName: string;
}

const REPLY_PROMPT = (
  blog: BlogContext,
  comment: { authorName: string; body: string },
  lang: Language
) =>
  [
    `You are ${blog.authorName}'s AI assistant, replying as a friendly stand-in while ${blog.authorName} is away.`,
    "Your job: write a short, warm reply to a visitor's comment based on the blog post they read.",
    "",
    "VOICE",
    lang === "id"
      ? "- Bahasa Indonesia santai tapi sopan. Pakai 'kamu' (bukan 'Anda'). Boleh sedikit humor ringan."
      : "- Casual but professional English. Contractions are fine. A touch of warmth, no corporate-speak.",
    "- Sound human, not like a chatbot reciting bullet points.",
    "- Acknowledge the visitor's point first, then add a thought of your own.",
    "- 1–3 short sentences. Never longer than 80 words.",
    "- Don't open with 'Great question!' or 'Thanks for your comment!' — boring.",
    "- Don't sign off with the author's name.",
    "",
    "RULES",
    "- Stay grounded in the blog content below — don't invent facts the post doesn't support.",
    "- If the comment is just a hello / emoji / thanks, give a quick warm reply (1 sentence).",
    "- If the visitor asks a question the blog doesn't answer, say you're not sure and suggest they reach out to the author directly.",
    "- Plain text only — NO Markdown, NO HTML, NO code fences, NO @mentions.",
    "- DISCLOSE you're the AI assistant if it's natural, but don't lead with it.",
    "",
    "BLOG POST",
    `Title: ${blog.title}`,
    `Excerpt: ${blog.excerpt}`,
    "Body excerpt:",
    blog.contentPlain,
    "",
    `Visitor (${comment.authorName}):`,
    comment.body,
    "",
    "Reply:",
  ].join("\n");

/**
 * Strip HTML to plain text and clamp length. We pass at most ~1500 chars of
 * the blog body to keep the prompt small (faster + cheaper).
 */
export function htmlToPlainExcerpt(html: string, max = 1500): string {
  const stripped = html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
  return stripped.length <= max ? stripped : stripped.slice(0, max) + "…";
}

/**
 * Generate a reply for the given comment, grounded in the blog context.
 * Returns null if Gemini is unavailable or returns empty — caller should
 * skip creating the reply row in that case.
 */
export async function generateBlogReply(args: {
  blog: BlogContext;
  comment: { authorName: string; body: string };
  lang: Language;
}): Promise<string | null> {
  const { blog, comment, lang } = args;
  try {
    const result = await getModel().generateContent({
      contents: [
        { role: "user", parts: [{ text: REPLY_PROMPT(blog, comment, lang) }] },
      ],
      generationConfig: {
        temperature: 0.75,
        topP: 0.95,
        maxOutputTokens: 300,
      },
    });

    const text = result.response.text().trim();
    // Strip stray fences / leading quote characters that sometimes slip in.
    const clean = text
      .replace(/^```(?:text|md|markdown)?\n?/i, "")
      .replace(/\n?```$/i, "")
      .replace(/^["'`]+|["'`]+$/g, "")
      .trim();

    return clean.length > 0 ? clean : null;
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[aiModeration] reply generation failed:", err);
    }
    return null;
  }
}

/** Detect whether comment text is more likely Indonesian. Cheap heuristic. */
export function detectLanguage(text: string): Language {
  // Short list of high-signal Indonesian words. Not perfect but good enough
  // to bias the reply tone toward whatever language the visitor wrote in.
  const idHits =
    /\b(yang|dan|saya|aku|kamu|dia|itu|ini|tidak|nggak|gak|ya|sih|dong|deh|banget|bgt|gimana|kenapa|udah|sudah|bisa|kalau|kalo|terima\s*kasih|makasih|halo|hai)\b/i.test(
      text
    );
  return idHits ? "id" : "en";
}
