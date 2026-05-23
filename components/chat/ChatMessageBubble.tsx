"use client";

import { motion } from "framer-motion";
import { AlertCircle, Sparkles } from "lucide-react";
import type { ChatMessage } from "@/types/chat";
import { profile } from "@/data/portfolio";
import ChatMarkdown from "./ChatMarkdown";

type Props = {
  message: ChatMessage;
  isStreaming?: boolean;
};

export default function ChatMessageBubble({ message, isStreaming }: Props) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex w-full gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <div
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-semibold ${
          isUser
            ? "bg-white/[0.06] text-white/80 ring-1 ring-white/10"
            : "bg-gradient-to-br from-accent to-cyan-neon text-ink-950 shadow-[0_0_18px_rgba(124,92,255,0.45)]"
        }`}
        aria-hidden
      >
        {isUser ? "You" : <Sparkles size={14} />}
      </div>

      <div
        className={`min-w-0 max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-soft ${
          isUser
            ? "bg-gradient-to-br from-accent/30 to-fuchsia-500/20 text-white ring-1 ring-accent/30"
            : message.error
              ? "bg-rose-500/10 text-rose-100 ring-1 ring-rose-400/30"
              : "bg-white/[0.04] text-white/90 ring-1 ring-white/10"
        }`}
      >
        {message.error && (
          <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-300">
            <AlertCircle size={14} /> {profile.name}
          </div>
        )}

        {message.content.trim().length === 0 && isStreaming ? (
          <span className="inline-flex items-center gap-1.5 text-white/60">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/60 [animation-delay:-0.2s]" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/60 [animation-delay:-0.1s]" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/60" />
          </span>
        ) : (
          <ChatMarkdown>{message.content}</ChatMarkdown>
        )}
      </div>
    </motion.div>
  );
}
