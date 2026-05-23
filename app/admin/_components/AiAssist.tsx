"use client";

import { useState, type ReactNode } from "react";
import { Languages, Loader2, Sparkles, Wand2 } from "lucide-react";

import type { Language } from "@/i18n/config";

import { aiGenerate, aiImprove, aiTranslate, type FieldType } from "./aiClient";

const LANG_LABEL: Record<Language, string> = {
  en: "EN",
  id: "ID",
};

/* ─────────────────────────────────────────────────── Button shell ─── */

interface AiButtonProps {
  /** Async work that returns the new text. */
  run: () => Promise<string>;
  /** Called with the AI result on success. */
  onResult: (text: string) => void;
  /** Visible label. Optional — pass null/undefined for icon-only. */
  label?: string;
  /** Tooltip text. */
  title?: string;
  /** Override the default sparkle icon. */
  icon?: ReactNode;
  /** Larger/primary styling for prominent buttons. */
  variant?: "ghost" | "solid";
  /** Disable when prerequisites are missing. */
  disabled?: boolean;
  /** Reason shown in tooltip when disabled. */
  disabledReason?: string;
  className?: string;
}

/**
 * Generic AI action button. Handles loading state, error display, and result
 * application. Intentionally tiny so it can sit next to any form field label.
 */
export function AiButton({
  run,
  onResult,
  label,
  title,
  icon,
  variant = "ghost",
  disabled,
  disabledReason,
  className,
}: AiButtonProps) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handle = async () => {
    if (disabled || pending) return;
    setError(null);
    setPending(true);
    try {
      const text = await run();
      onResult(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI request failed");
      // Auto-clear after a few seconds so it doesn't linger.
      setTimeout(() => setError(null), 5000);
    } finally {
      setPending(false);
    }
  };

  const base =
    variant === "solid"
      ? "inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-2.5 py-1 text-xs font-medium text-white shadow-sm transition hover:from-indigo-400 hover:to-fuchsia-400 disabled:opacity-50"
      : "inline-flex items-center gap-1 rounded-md border border-white/10 bg-slate-800/60 px-2 py-1 text-[11px] font-medium text-slate-300 transition hover:border-indigo-400/40 hover:bg-slate-800 hover:text-white disabled:opacity-50";

  return (
    <span className={["inline-flex items-center gap-1.5", className].filter(Boolean).join(" ")}>
      <button
        type="button"
        onClick={handle}
        disabled={disabled || pending}
        title={disabled && disabledReason ? disabledReason : title}
        className={base}
      >
        {pending ? (
          <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
        ) : (
          icon ?? <Sparkles className="h-3 w-3" aria-hidden />
        )}
        {label && <span>{label}</span>}
      </button>
      {error && (
        <span
          role="alert"
          className="rounded-md bg-rose-500/15 px-2 py-0.5 text-[11px] text-rose-300"
        >
          {error}
        </span>
      )}
    </span>
  );
}

/* ───────────────────────────────────────────────── Concrete buttons ─── */

interface ImproveButtonProps {
  getText: () => string;
  lang: Language;
  fieldType: FieldType;
  onResult: (text: string) => void;
}

export function AiImproveButton({
  getText,
  lang,
  fieldType,
  onResult,
}: ImproveButtonProps) {
  return (
    <AiButton
      label="Improve"
      title="Polish wording with AI"
      run={async () => {
        const text = getText().trim();
        if (!text) throw new Error("Type something first.");
        return aiImprove({ text, lang, fieldType });
      }}
      onResult={onResult}
    />
  );
}

interface TranslateButtonProps {
  getSourceText: () => string;
  fromLang: Language;
  toLang: Language;
  fieldType: FieldType;
  onResult: (text: string) => void;
}

export function AiTranslateButton({
  getSourceText,
  fromLang,
  toLang,
  fieldType,
  onResult,
}: TranslateButtonProps) {
  return (
    <AiButton
      label={`From ${LANG_LABEL[fromLang]}`}
      title={`Translate from ${fromLang === "en" ? "English" : "Bahasa Indonesia"}`}
      icon={<Languages className="h-3 w-3" aria-hidden />}
      run={async () => {
        const text = getSourceText().trim();
        if (!text)
          throw new Error(`Fill the ${LANG_LABEL[fromLang]} version first.`);
        return aiTranslate({ text, fromLang, toLang, fieldType });
      }}
      onResult={onResult}
    />
  );
}

interface GenerateButtonProps {
  getContext: () => Record<string, string | string[] | undefined>;
  lang: Language;
  fieldType: FieldType;
  onResult: (text: string) => void;
  /** Names of context keys that must be non-empty for the button to enable. */
  requireKeys?: string[];
  label?: string;
}

export function AiGenerateButton({
  getContext,
  lang,
  fieldType,
  onResult,
  requireKeys,
  label = "Generate",
}: GenerateButtonProps) {
  return (
    <AiButton
      label={label}
      title="Generate from sibling fields"
      icon={<Wand2 className="h-3 w-3" aria-hidden />}
      run={async () => {
        const ctx = getContext();
        const missing = (requireKeys ?? []).filter((k) => {
          const v = ctx[k];
          if (Array.isArray(v)) return v.length === 0;
          return !v || v.trim().length === 0;
        });
        if (missing.length > 0) {
          throw new Error(`Fill ${missing.join(", ")} first.`);
        }
        return aiGenerate({ fieldType, lang, context: ctx });
      }}
      onResult={onResult}
    />
  );
}

/* ─────────────────────────────────── Bulk-translate-all-fields button ─── */

export interface TranslateAllField {
  value: string;
  fieldType: FieldType;
}

interface TranslateAllProps {
  /**
   * Lazy getter for the source-locale field map. Called at click time so the
   * latest form values are used (react-hook-form's `register`-bound inputs
   * don't trigger parent re-renders, so a snapshot would go stale).
   */
  getSource: () => Record<string, TranslateAllField>;
  fromLang: Language;
  toLang: Language;
  /** Called once per field with the translated text, in input order. */
  onResult: (id: string, text: string) => void;
  /** Override the default label. */
  label?: string;
}

/**
 * Translates every provided field sequentially. Sequential (not parallel)
 * keeps us within Gemini's free-tier rate limits and lets the user watch
 * progress field-by-field.
 */
export function AiTranslateAllButton({
  getSource,
  fromLang,
  toLang,
  onResult,
  label,
}: TranslateAllProps) {
  return (
    <AiButton
      variant="solid"
      icon={<Languages className="h-3.5 w-3.5" aria-hidden />}
      label={
        label ??
        `Translate all from ${LANG_LABEL[fromLang]} → ${LANG_LABEL[toLang]}`
      }
      title="Sends each filled field through Gemini one by one"
      run={async () => {
        const entries = Object.entries(getSource()).filter(
          ([, v]) => v.value.trim().length > 0
        );
        if (entries.length === 0) {
          throw new Error(
            `Fill at least one ${LANG_LABEL[fromLang]} field first.`
          );
        }
        for (const [id, { value, fieldType }] of entries) {
          const result = await aiTranslate({
            text: value,
            fromLang,
            toLang,
            fieldType,
          });
          onResult(id, result);
        }
        return `Translated ${entries.length} field(s).`;
      }}
      onResult={() => {
        // The bulk button doesn't apply a single string anywhere; the per-field
        // onResult callbacks above already updated the form. We swallow the
        // summary string from `run()`.
      }}
    />
  );
}
