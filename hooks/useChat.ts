"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChatMessage } from "@/types/chat";
import type { Language } from "@/i18n";

const STORAGE_KEY = "dedypry.chat.history.v2";
const STORAGE_LANG_KEY = "dedypry.chat.lang.v2";
const COOLDOWN_MS = 1500;
const ERROR_MARKER = "__ERROR__:";

function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function safeLoadHistory(currentLang: Language): {
  messages: ChatMessage[];
  lang: Language | null;
} {
  if (typeof window === "undefined") return { messages: [], lang: null };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const storedLang = window.localStorage.getItem(STORAGE_LANG_KEY);
    if (!raw) return { messages: [], lang: storedLang as Language | null };
    const parsed = JSON.parse(raw) as ChatMessage[];
    if (!Array.isArray(parsed)) return { messages: [], lang: null };
    if (storedLang && storedLang !== currentLang) {
      // Different language than the saved chat — discard stale history.
      return { messages: [], lang: null };
    }
    const validMessages = parsed.filter(
      (m) =>
        m &&
        typeof m.content === "string" &&
        (m.role === "user" || m.role === "assistant")
    );

    // Gemini requires chat history to begin with a user message. Older builds
    // could leave an assistant-only error message in localStorage, so discard
    // leading assistant messages when restoring a conversation.
    const firstUserIndex = validMessages.findIndex((m) => m.role === "user");
    const messages = firstUserIndex === -1 ? [] : validMessages.slice(firstUserIndex);

    return {
      messages,
      lang: storedLang as Language | null,
    };
  } catch {
    return { messages: [], lang: null };
  }
}

function persist(messages: ChatMessage[], lang: Language) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    window.localStorage.setItem(STORAGE_LANG_KEY, lang);
  } catch {
    /* quota or privacy mode — ignore */
  }
}

interface UseChatOptions {
  lang: Language;
  /** Translated rate-limit / generic error strings. */
  errorRateLimit: string;
  errorGeneric: string;
}

export function useChat({ lang, errorRateLimit, errorGeneric }: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>(
    () => safeLoadHistory(lang).messages
  );
  const [trackedLang, setTrackedLang] = useState<Language>(lang);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastSendAtRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);

  // Derived reset on language change. Setting state during render is allowed
  // when the update is conditional and converges immediately.
  if (trackedLang !== lang) {
    setTrackedLang(lang);
    if (messages.length > 0) setMessages([]);
  }

  // Abort any in-flight stream when the language changes (cleanup runs before
  // the new effect fires for the new lang value).
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      abortRef.current = null;
    };
  }, [lang]);

  // Persist on every change
  useEffect(() => {
    persist(messages, lang);
  }, [messages, lang]);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
    setIsStreaming(false);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem("dedypry.chat.history");
      window.localStorage.removeItem("dedypry.chat.lang");
    }
  }, []);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return;

      const now = Date.now();
      if (now - lastSendAtRef.current < COOLDOWN_MS) {
        setError(errorRateLimit);
        return;
      }
      lastSendAtRef.current = now;
      setError(null);

      const userMessage: ChatMessage = {
        id: uid(),
        role: "user",
        content: trimmed,
        createdAt: now,
      };

      const assistantMessage: ChatMessage = {
        id: uid(),
        role: "assistant",
        content: "",
        createdAt: now,
      };

      const nextMessages = [...messages, userMessage, assistantMessage];
      setMessages(nextMessages);
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lang,
            messages: nextMessages
              .filter((m) => m.role !== "assistant" || m.content.length > 0)
              .map((m) => ({ role: m.role, content: m.content })),
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          let serverMessage = errorGeneric;
          try {
            const data = (await response.json()) as { error?: string };
            if (data?.error) serverMessage = data.error;
          } catch {
            /* ignore */
          }
          throw new Error(serverMessage);
        }

        if (!response.body) throw new Error(errorGeneric);

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffered = "";
        let streamedError: string | null = null;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          if (!chunk) continue;

          buffered += chunk;

          // Detect the in-band error marker the server emits if the upstream
          // generation fails midway.
          const errIndex = buffered.indexOf(ERROR_MARKER);
          let visible = buffered;
          if (errIndex !== -1) {
            visible = buffered.slice(0, errIndex);
            streamedError = buffered.slice(errIndex + ERROR_MARKER.length);
          }

          setMessages((prev) => {
            const updated = [...prev];
            const idx = updated.findIndex((m) => m.id === assistantMessage.id);
            if (idx !== -1) {
              updated[idx] = { ...updated[idx], content: visible };
            }
            return updated;
          });

          if (streamedError !== null) break;
        }

        if (streamedError !== null) {
          setError(streamedError || errorGeneric);
          setMessages((prev) => {
            const updated = [...prev];
            const idx = updated.findIndex((m) => m.id === assistantMessage.id);
            if (idx !== -1 && updated[idx].content.trim() === "") {
              updated[idx] = {
                ...updated[idx],
                content: errorGeneric,
                error: true,
              };
            }
            return updated;
          });
        }
      } catch (err) {
        if ((err as { name?: string })?.name === "AbortError") {
          // user cancelled — leave whatever was streamed in place.
          setIsStreaming(false);
          return;
        }
        const message = err instanceof Error ? err.message : errorGeneric;
        setError(message);
        setMessages((prev) => {
          const updated = [...prev];
          const idx = updated.findIndex((m) => m.id === assistantMessage.id);
          if (idx !== -1 && updated[idx].content.trim() === "") {
            updated[idx] = {
              ...updated[idx],
              content: message,
              error: true,
            };
          }
          return updated;
        });
      } finally {
        abortRef.current = null;
        setIsStreaming(false);
      }
    },
    [messages, isStreaming, lang, errorGeneric, errorRateLimit]
  );

  const hasMessages = useMemo(() => messages.length > 0, [messages]);

  return {
    messages,
    isStreaming,
    error,
    hasMessages,
    sendMessage,
    stop,
    reset,
  };
}
