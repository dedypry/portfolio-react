"use client";

import { lazy, Suspense, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, Sparkles, X } from "lucide-react";
import { useT } from "@/i18n/useT";

// Lazy-load the chat panel + its dependencies (react-markdown, etc.) so the
// initial page bundle stays lean. The panel is only fetched the first time
// the visitor actually opens the chat.
const ChatPanel = lazy(() => import("./ChatPanel"));

const HINT_STORAGE_KEY = "dedypry.chat.hintDismissed";

export default function ChatBubble() {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(HINT_STORAGE_KEY)) return;
    const timer = window.setTimeout(() => setShowHint(true), 4500);
    return () => window.clearTimeout(timer);
  }, []);

  const dismissHint = () => {
    setShowHint(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(HINT_STORAGE_KEY, "1");
    }
  };

  const toggleOpen = () => {
    setOpen((value) => {
      const next = !value;
      if (next) {
        setHasMounted(true);
        if (showHint) dismissHint();
      }
      return next;
    });
  };

  return (
    <>
      <div className="fixed bottom-5 right-5 z-[65] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
        <AnimatePresence>
          {showHint && !open && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className="glass relative max-w-[260px] rounded-2xl px-3.5 py-3 pr-9 text-sm text-white/85 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.6)]"
            >
              <button
                type="button"
                onClick={dismissHint}
                aria-label="Dismiss"
                className="absolute right-1.5 top-1.5 rounded-full p-1 text-white/45 hover:bg-white/10 hover:text-white"
              >
                <X size={12} />
              </button>
              <div className="flex items-start gap-2">
                <Sparkles size={14} className="mt-0.5 text-accent-soft" />
                <span className="leading-snug">{t.chat.greeting}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={toggleOpen}
          aria-label={t.chat.bubbleLabel}
          aria-expanded={open}
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="group relative grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-accent to-cyan-neon text-ink-950 shadow-[0_18px_50px_-12px_rgba(124,92,255,0.7)] transition-transform hover:-translate-y-0.5 active:scale-95"
        >
          <span className="absolute inset-0 -z-10 rounded-full bg-accent/40 blur-xl transition-opacity group-hover:bg-accent/60" />
          <AnimatePresence mode="wait">
            {open ? (
              <motion.span
                key="x"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.15 }}
              >
                <X size={20} strokeWidth={2.5} />
              </motion.span>
            ) : (
              <motion.span
                key="msg"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                transition={{ duration: 0.15 }}
              >
                <MessageSquare size={20} strokeWidth={2.5} />
              </motion.span>
            )}
          </AnimatePresence>

          {!open && (
            <span
              aria-hidden
              className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5"
            >
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-ink-900 bg-emerald-400" />
            </span>
          )}
        </motion.button>
      </div>

      {hasMounted && (
        <Suspense fallback={null}>
          <ChatPanel open={open} onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
