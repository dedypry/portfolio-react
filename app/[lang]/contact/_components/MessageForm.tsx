"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Send } from "lucide-react";

import type { Language } from "@/i18n/config";

type Labels = {
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  subjectLabel: string;
  subjectPlaceholder: string;
  bodyLabel: string;
  bodyPlaceholder: string;
  submit: string;
  submitting: string;
  successTitle: string;
  successBody: string;
  sendAnother: string;
  backHome: string;
  privacyNote: string;
  failed: string;
};

interface MessageFormProps {
  lang: Language;
  labels: Labels;
}

interface Draft {
  name: string;
  email: string;
  subject: string;
  body: string;
}

const EMPTY_DRAFT: Draft = { name: "", email: "", subject: "", body: "" };

/**
 * Single-page message form. Posts to /api/contact, shows a success card on
 * 2xx, surfaces inline errors otherwise. Includes a hidden honeypot field
 * (`website`) — bots happily fill it; legitimate visitors don't see it.
 */
export function MessageForm({ lang, labels }: MessageFormProps) {
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  // Honeypot value lives in its own state so React doesn't strip it.
  const [honeypot, setHoneypot] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const update = (key: keyof Draft, value: string) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pending) return;
    setError(null);
    setPending(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, website: honeypot }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        ok?: boolean;
      };

      if (!res.ok) {
        setError(data.error ?? labels.failed);
        return;
      }

      setSuccess(true);
      setDraft(EMPTY_DRAFT);
    } catch (err) {
      setError(err instanceof Error ? err.message : labels.failed);
    } finally {
      setPending(false);
    }
  };

  if (success) {
    return (
      <div className="glass relative overflow-hidden rounded-3xl p-8 sm:p-10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-500/30 blur-3xl" />
        <div className="relative">
          <CheckCircle2
            size={36}
            className="mb-4 text-emerald-300"
            aria-hidden
          />
          <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {labels.successTitle}
          </h2>
          <p className="mt-3 max-w-md text-white/70">{labels.successBody}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setSuccess(false)}
              className="btn-ghost"
            >
              <Send size={14} />
              {labels.sendAnother}
            </button>
            <Link href={`/${lang}`} className="btn-primary">
              <ArrowLeft size={14} />
              {labels.backHome}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-ink-900/60 px-4 py-3 text-sm text-white placeholder-white/40 transition focus:border-accent-soft/60 focus:outline-none focus:ring-2 focus:ring-accent-soft/20";

  return (
    <form
      onSubmit={submit}
      className="glass space-y-4 rounded-3xl p-6 sm:p-8"
      noValidate
    >
      {/* Honeypot — visually hidden but still in the DOM for naive bots. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[9999px] top-auto h-px w-px overflow-hidden opacity-0"
      >
        <label>
          Website
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-white/55">
            {labels.nameLabel}
          </span>
          <input
            required
            type="text"
            name="name"
            autoComplete="name"
            placeholder={labels.namePlaceholder}
            value={draft.name}
            onChange={(e) => update("name", e.target.value)}
            maxLength={80}
            className={inputClass}
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-white/55">
            {labels.emailLabel}
          </span>
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            placeholder={labels.emailPlaceholder}
            value={draft.email}
            onChange={(e) => update("email", e.target.value)}
            maxLength={120}
            className={inputClass}
          />
        </label>
      </div>

      <label className="block space-y-1.5">
        <span className="text-xs font-medium uppercase tracking-wider text-white/55">
          {labels.subjectLabel}
        </span>
        <input
          type="text"
          name="subject"
          placeholder={labels.subjectPlaceholder}
          value={draft.subject}
          onChange={(e) => update("subject", e.target.value)}
          maxLength={160}
          className={inputClass}
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-xs font-medium uppercase tracking-wider text-white/55">
          {labels.bodyLabel}
        </span>
        <textarea
          required
          name="body"
          rows={6}
          minLength={5}
          maxLength={4000}
          placeholder={labels.bodyPlaceholder}
          value={draft.body}
          onChange={(e) => update("body", e.target.value)}
          className={`${inputClass} resize-y leading-relaxed`}
        />
      </label>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
        >
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <p className="max-w-sm text-xs text-white/45">{labels.privacyNote}</p>
        <button
          type="submit"
          disabled={pending}
          className="btn-primary disabled:cursor-wait disabled:opacity-60"
        >
          {pending ? (
            <Loader2 size={14} className="animate-spin" aria-hidden />
          ) : (
            <Send size={14} aria-hidden />
          )}
          {pending ? labels.submitting : labels.submit}
          {!pending && <ArrowRight size={14} aria-hidden />}
        </button>
      </div>
    </form>
  );
}
