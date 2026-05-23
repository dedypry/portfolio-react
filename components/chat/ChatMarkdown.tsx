"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = { children: string };

export default function ChatMarkdown({ children }: Props) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ ...props }) => (
          <a
            {...props}
            target="_blank"
            rel="noreferrer"
            className="text-accent-soft underline decoration-accent/40 underline-offset-2 hover:text-white"
          />
        ),
        p: ({ ...props }) => (
          <p {...props} className="mb-2 last:mb-0 leading-relaxed" />
        ),
        ul: ({ ...props }) => (
          <ul {...props} className="my-2 list-disc space-y-1 pl-5" />
        ),
        ol: ({ ...props }) => (
          <ol {...props} className="my-2 list-decimal space-y-1 pl-5" />
        ),
        li: ({ ...props }) => <li {...props} className="leading-relaxed" />,
        strong: ({ ...props }) => (
          <strong {...props} className="font-semibold text-white" />
        ),
        em: ({ ...props }) => <em {...props} className="text-white/85" />,
        code: ({ children, ...props }) => (
          <code
            {...props}
            className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.85em] text-cyan-neon"
          >
            {children}
          </code>
        ),
        h1: ({ ...props }) => (
          <p {...props} className="mb-2 font-display text-base font-semibold" />
        ),
        h2: ({ ...props }) => (
          <p {...props} className="mb-2 font-display text-base font-semibold" />
        ),
        h3: ({ ...props }) => (
          <p {...props} className="mb-2 font-display text-sm font-semibold" />
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
