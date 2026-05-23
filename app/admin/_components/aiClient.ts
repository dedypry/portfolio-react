import type { Language } from "@/i18n/config";
import type { FieldType } from "@/lib/aiAssist";

/** Re-exported here so client components don't need to reach into lib/. */
export type { FieldType } from "@/lib/aiAssist";

interface ApiError {
  error: string;
}

interface ApiSuccess {
  result: string;
}

async function postAi(payload: unknown): Promise<string> {
  const res = await fetch("/api/admin/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await res.json().catch(() => ({}))) as Partial<
    ApiError & ApiSuccess
  >;

  if (!res.ok) {
    throw new Error(data.error ?? `AI request failed (${res.status})`);
  }
  if (!data.result) {
    throw new Error("AI response was empty");
  }
  return data.result;
}

export function aiImprove(args: {
  text: string;
  lang: Language;
  fieldType: FieldType;
}): Promise<string> {
  return postAi({ action: "improve", ...args });
}

export function aiTranslate(args: {
  text: string;
  fromLang: Language;
  toLang: Language;
  fieldType: FieldType;
}): Promise<string> {
  return postAi({ action: "translate", ...args });
}

export function aiGenerate(args: {
  fieldType: FieldType;
  lang: Language;
  context: Record<string, string | string[] | undefined>;
}): Promise<string> {
  return postAi({ action: "generate", ...args });
}
