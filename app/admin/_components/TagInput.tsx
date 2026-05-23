"use client";

import { useState, type KeyboardEvent } from "react";
import { FaTimes } from "react-icons/fa";

interface TagInputProps {
  value: string[];
  onChange: (next: string[]) => void;
  label?: string;
  placeholder?: string;
  hint?: string;
  error?: string;
}

export function TagInput({
  value,
  onChange,
  label,
  placeholder = "Type and press Enter…",
  hint,
  error,
}: TagInputProps) {
  const [draft, setDraft] = useState("");

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (!tag) return;
    if (value.includes(tag)) {
      setDraft("");
      return;
    }
    onChange([...value, tag]);
    setDraft("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(draft);
    } else if (e.key === "Backspace" && !draft && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <span className="block text-xs font-medium uppercase tracking-wider text-slate-300">
          {label}
        </span>
      )}

      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900/60 px-2 py-1.5 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-400/30">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-xs text-slate-200"
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(value.filter((t) => t !== tag))}
              className="text-slate-500 hover:text-rose-300"
              aria-label={`Remove ${tag}`}
            >
              <FaTimes className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => draft && addTag(draft)}
          placeholder={value.length === 0 ? placeholder : ""}
          className="min-w-[120px] flex-1 bg-transparent px-1 py-0.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
        />
      </div>

      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
}
