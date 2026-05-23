"use client";

import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

const fieldClass =
  "w-full rounded-lg border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30";

interface BaseProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

interface TextFieldProps
  extends BaseProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    { label, hint, error, required, className, ...rest },
    ref
  ) {
    return (
      <label className={["block space-y-1.5", className].filter(Boolean).join(" ")}>
        <span className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-slate-300">
          {label}
          {required && <span className="text-rose-400">*</span>}
        </span>
        <input ref={ref} className={fieldClass} {...rest} />
        {hint && !error && <span className="block text-xs text-slate-500">{hint}</span>}
        {error && <span className="block text-xs text-rose-400">{error}</span>}
      </label>
    );
  }
);

interface TextAreaProps
  extends BaseProps,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> {}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea({ label, hint, error, required, className, ...rest }, ref) {
    return (
      <label className={["block space-y-1.5", className].filter(Boolean).join(" ")}>
        <span className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-slate-300">
          {label}
          {required && <span className="text-rose-400">*</span>}
        </span>
        <textarea
          ref={ref}
          rows={4}
          className={`${fieldClass} resize-y leading-relaxed`}
          {...rest}
        />
        {hint && !error && <span className="block text-xs text-slate-500">{hint}</span>}
        {error && <span className="block text-xs text-rose-400">{error}</span>}
      </label>
    );
  }
);

interface SelectProps
  extends BaseProps,
    React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
}

export const SelectField = forwardRef<HTMLSelectElement, SelectProps>(
  function SelectField(
    { label, hint, error, required, options, className, ...rest },
    ref
  ) {
    return (
      <label className={["block space-y-1.5", className].filter(Boolean).join(" ")}>
        <span className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-slate-300">
          {label}
          {required && <span className="text-rose-400">*</span>}
        </span>
        <select ref={ref} className={fieldClass} {...rest}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {hint && !error && <span className="block text-xs text-slate-500">{hint}</span>}
        {error && <span className="block text-xs text-rose-400">{error}</span>}
      </label>
    );
  }
);

interface CheckboxProps extends Omit<BaseProps, "label"> {
  label: string;
  description?: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
}

export function Checkbox({
  label,
  description,
  error,
  ...rest
}: CheckboxProps) {
  return (
    <label className="flex items-start gap-3 rounded-lg border border-white/10 bg-slate-900/60 p-3 cursor-pointer hover:bg-slate-900/80 transition">
      <input
        type="checkbox"
        className="mt-0.5 h-4 w-4 rounded border-white/20 bg-slate-800 text-indigo-500 focus:ring-indigo-500/40"
        {...rest}
      />
      <div className="flex-1">
        <span className="block text-sm font-medium text-slate-200">{label}</span>
        {description && (
          <span className="block text-xs text-slate-500 mt-0.5">{description}</span>
        )}
        {error && <span className="block text-xs text-rose-400 mt-1">{error}</span>}
      </div>
    </label>
  );
}
