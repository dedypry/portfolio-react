import { z } from "zod";

import { auth } from "@/lib/auth";
import {
  generateField,
  improveText,
  translateText,
  type FieldType,
} from "@/lib/aiAssist";

// Auth + Prisma + Gemini SDK all need Node runtime.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FIELD_TYPES = [
  "project.name",
  "project.tagline",
  "project.description",
  "blog.title",
  "blog.excerpt",
  "blog.content",
  "experience.role",
  "experience.highlight",
  "education.degree",
  "education.description",
  "profile.role",
  "profile.headlineLine",
  "profile.headlineHighlight",
  "profile.tagline",
  "profile.description",
  "freeform",
] as const satisfies readonly FieldType[];

const langSchema = z.enum(["en", "id"]);
const fieldTypeSchema = z.enum(FIELD_TYPES);

const bodySchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("improve"),
    text: z.string().min(1).max(8000),
    lang: langSchema,
    fieldType: fieldTypeSchema,
  }),
  z.object({
    action: z.literal("translate"),
    text: z.string().min(1).max(8000),
    fromLang: langSchema,
    toLang: langSchema,
    fieldType: fieldTypeSchema,
  }),
  z.object({
    action: z.literal("generate"),
    fieldType: fieldTypeSchema,
    lang: langSchema,
    context: z
      .record(z.string(), z.union([z.string(), z.array(z.string())]).optional())
      .optional(),
  }),
]);

function jsonError(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req: Request): Promise<Response> {
  const session = await auth();
  if (!session?.user) {
    return jsonError(401, "Unauthorized");
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return jsonError(400, "Invalid JSON body");
  }

  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return jsonError(400, parsed.error.issues[0]?.message ?? "Invalid request");
  }

  try {
    let result: string;
    switch (parsed.data.action) {
      case "improve":
        result = await improveText({
          text: parsed.data.text,
          lang: parsed.data.lang,
          fieldType: parsed.data.fieldType,
        });
        break;
      case "translate":
        result = await translateText({
          text: parsed.data.text,
          fromLang: parsed.data.fromLang,
          toLang: parsed.data.toLang,
          fieldType: parsed.data.fieldType,
        });
        break;
      case "generate":
        result = await generateField({
          fieldType: parsed.data.fieldType,
          lang: parsed.data.lang,
          context: (parsed.data.context ?? {}) as Record<
            string,
            string | string[] | undefined
          >,
        });
        break;
    }

    if (!result.trim()) {
      return jsonError(502, "AI returned an empty response. Try again.");
    }

    return new Response(JSON.stringify({ result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unexpected upstream error";
    return jsonError(500, message);
  }
}
