"use client";

import { FaPlus, FaTimes, FaArrowUp, FaArrowDown } from "react-icons/fa";

interface HighlightsInputProps {
  value: string[];
  onChange: (next: string[]) => void;
  label?: string;
  hint?: string;
  error?: string;
}

export function HighlightsInput({
  value,
  onChange,
  label,
  hint,
  error,
}: HighlightsInputProps) {
  const update = (idx: number, text: string) => {
    onChange(value.map((item, i) => (i === idx ? text : item)));
  };
  const remove = (idx: number) => onChange(value.filter((_, i) => i !== idx));
  const add = () => onChange([...value, ""]);
  const move = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <span className="block text-xs font-medium uppercase tracking-wider text-slate-300">
            {label}
          </span>
          <button
            type="button"
            onClick={add}
            className="inline-flex items-center gap-1 text-xs text-indigo-300 hover:text-indigo-200"
          >
            <FaPlus className="h-2.5 w-2.5" />
            Add
          </button>
        </div>
      )}

      <div className="space-y-2">
        {value.map((highlight, idx) => (
          <div
            key={idx}
            className="flex items-start gap-2 rounded-lg border border-white/10 bg-slate-900/60 p-2"
          >
            <div className="flex flex-col gap-0.5 pt-1">
              <button
                type="button"
                onClick={() => move(idx, -1)}
                disabled={idx === 0}
                className="text-slate-500 hover:text-slate-300 disabled:opacity-30"
                aria-label="Move up"
              >
                <FaArrowUp className="h-2.5 w-2.5" />
              </button>
              <button
                type="button"
                onClick={() => move(idx, 1)}
                disabled={idx === value.length - 1}
                className="text-slate-500 hover:text-slate-300 disabled:opacity-30"
                aria-label="Move down"
              >
                <FaArrowDown className="h-2.5 w-2.5" />
              </button>
            </div>

            <textarea
              value={highlight}
              onChange={(e) => update(idx, e.target.value)}
              rows={2}
              className="flex-1 resize-y bg-transparent px-2 py-1 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
              placeholder={`Highlight ${idx + 1}`}
            />

            <button
              type="button"
              onClick={() => remove(idx)}
              className="mt-1 grid h-6 w-6 place-items-center rounded-md text-slate-500 hover:bg-rose-500/10 hover:text-rose-300"
              aria-label="Remove"
            >
              <FaTimes className="h-3 w-3" />
            </button>
          </div>
        ))}

        {value.length === 0 && (
          <button
            type="button"
            onClick={add}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 px-4 py-3 text-sm text-slate-400 hover:border-indigo-400/40 hover:text-indigo-300"
          >
            <FaPlus className="h-3 w-3" />
            Add first highlight
          </button>
        )}
      </div>

      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
}
