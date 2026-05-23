"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Mail,
  RotateCcw,
  Send,
  Sparkles,
  Square,
  X,
} from "lucide-react";
import { FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { profile } from "@/data/portfolio";
import { useT } from "@/i18n/useT";
import { useChat } from "@/hooks/useChat";
import ChatMessageBubble from "./ChatMessageBubble";

type Props = {
  open: boolean;
  onClose: () => void;
};

const WHATSAPP_NUMBER = profile.phone.replace(/[^\d]/g, "");

export default function ChatPanel({ open, onClose }: Props) {
  const { t, lang } = useT();
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, isStreaming, error, hasMessages, sendMessage, stop, reset } =
    useChat({
      lang,
      errorRateLimit: t.chat.errorRateLimit,
      errorGeneric: t.chat.errorGeneric,
    });

  // Focus input when opened.
  useEffect(() => {
    if (open) {
      const timer = window.setTimeout(() => inputRef.current?.focus(), 80);
      return () => window.clearTimeout(timer);
    }
  }, [open]);

  // Auto-scroll to bottom when messages stream / change.
  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
  }, [messages, isStreaming]);

  // Esc-to-close.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleSubmit = async (event?: React.FormEvent) => {
    event?.preventDefault();
    const text = draft.trim();
    if (!text || isStreaming) return;
    setDraft("");
    await sendMessage(text);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSubmit();
    }
  };

  const whatsappUrl = useMemo(() => {
    const text = encodeURIComponent(
      lang === "id"
        ? `Halo Dedy, saya mampir dari portofolio Anda dan ingin ngobrol.`
        : `Hi Dedy, I came across your portfolio and would love to chat.`
    );
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  }, [lang]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            onClick={onClose}
            aria-label={t.chat.closeLabel}
            className="fixed inset-0 z-[70] cursor-default bg-ink-950/55 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="fixed inset-x-3 bottom-3 z-[71] flex max-h-[88vh] flex-col overflow-hidden rounded-3xl border border-white/10 bg-ink-900/95 shadow-[0_30px_120px_-30px_rgba(0,0,0,0.85)] backdrop-blur-xl sm:inset-x-auto sm:right-5 sm:bottom-24 sm:max-h-[640px] sm:w-[420px]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="chat-panel-title"
          >
            <header className="relative flex items-center gap-3 border-b border-white/10 px-4 py-3.5">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-accent to-cyan-neon text-ink-950 shadow-glow">
                <Sparkles size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <h3
                  id="chat-panel-title"
                  className="font-display text-sm font-semibold text-white"
                >
                  {t.chat.title}
                </h3>
                <div className="flex items-center gap-1.5 text-[11px] text-white/55">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  {t.chat.online} · {t.chat.subtitle}
                </div>
              </div>
              {hasMessages && (
                <button
                  type="button"
                  onClick={reset}
                  aria-label={t.chat.reset}
                  title={t.chat.reset}
                  className="rounded-full p-2 text-white/55 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <RotateCcw size={15} />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label={t.chat.closeLabel}
                className="rounded-full p-2 text-white/55 transition-colors hover:bg-white/5 hover:text-white"
              >
                <X size={16} />
              </button>
            </header>

            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 [scrollbar-width:thin]"
            >
              {!hasMessages && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed text-white/85">
                    {t.chat.greeting}
                  </div>

                  <div>
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                      {t.chat.suggestionLabel}
                    </div>
                    <div className="grid gap-2">
                      {t.chat.suggestions.map((s) => (
                        <button
                          key={s.label}
                          type="button"
                          onClick={() => void sendMessage(s.prompt)}
                          disabled={isStreaming}
                          className="group flex items-start justify-between gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-3 text-left text-sm text-white/80 transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:bg-accent/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="font-display text-sm font-semibold text-white">
                              {s.label}
                            </div>
                            <div className="mt-0.5 line-clamp-2 text-xs text-white/55">
                              {s.prompt}
                            </div>
                          </div>
                          <Send
                            size={14}
                            className="mt-1 shrink-0 text-white/30 transition-transform group-hover:translate-x-0.5 group-hover:text-accent-soft"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {hasMessages && (
                <div className="flex flex-col gap-4">
                  {messages.map((message, index) => (
                    <ChatMessageBubble
                      key={message.id}
                      message={message}
                      isStreaming={
                        isStreaming &&
                        index === messages.length - 1 &&
                        message.role === "assistant"
                      }
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-white/10 bg-ink-900/85">
              {error && (
                <div className="mx-4 mt-3 rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="flex items-end gap-2 px-4 py-3"
              >
                <textarea
                  ref={inputRef}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder={t.chat.inputPlaceholder}
                  rows={1}
                  className="max-h-32 min-h-[44px] flex-1 resize-none rounded-2xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
                />
                {isStreaming ? (
                  <button
                    type="button"
                    onClick={stop}
                    aria-label={t.chat.stop}
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-rose-400/30 bg-rose-500/15 text-rose-200 transition-colors hover:bg-rose-500/25"
                  >
                    <Square size={14} fill="currentColor" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!draft.trim()}
                    aria-label={t.chat.send}
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-accent to-cyan-neon text-ink-950 shadow-glow transition-all hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                  >
                    <Send size={16} />
                  </button>
                )}
              </form>

              <div className="border-t border-white/5 px-4 py-2.5">
                <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                  {t.chat.quickActionsTitle}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/75 transition-colors hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
                  >
                    <Mail size={12} /> {t.chat.quickActions.email}
                  </a>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200 transition-colors hover:bg-emerald-400/20"
                  >
                    <FaWhatsapp size={12} /> {t.chat.quickActions.whatsapp}
                  </a>
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/75 transition-colors hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
                  >
                    <FaLinkedin size={12} /> {t.chat.quickActions.linkedin}
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 px-4 py-2 text-[10px] text-white/35">
                <span className="inline-flex items-center gap-1">
                  <Sparkles size={11} /> {t.chat.poweredBy}
                </span>
                <span className="truncate pl-3">{t.chat.disclaimer}</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
