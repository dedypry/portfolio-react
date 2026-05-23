"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { FaUpload, FaTrash, FaSpinner } from "react-icons/fa";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  hint?: string;
}

export function ImageUpload({ value, onChange, label, hint }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleFile = (file: File) => {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("File must be an image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Max 5MB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    startTransition(async () => {
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) {
          const body = await res.text();
          setError(body || "Upload failed");
          return;
        }
        const { url } = (await res.json()) as { url: string };
        onChange(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      }
    });
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <span className="block text-xs font-medium uppercase tracking-wider text-slate-300">
          {label}
        </span>
      )}

      {value ? (
        <div className="relative overflow-hidden rounded-lg border border-white/10">
          <Image
            src={value}
            alt=""
            width={800}
            height={400}
            className="aspect-[2/1] w-full object-cover"
            unoptimized
          />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/80 to-transparent p-3">
            <span className="truncate text-xs text-slate-300">{value}</span>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="inline-flex items-center gap-1.5 rounded-md bg-rose-500/20 px-2 py-1 text-xs text-rose-200 hover:bg-rose-500/30"
            >
              <FaTrash className="h-3 w-3" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
          className="group flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/15 bg-slate-900/40 px-4 py-8 text-sm text-slate-400 transition hover:border-indigo-400/40 hover:bg-slate-900/60 hover:text-indigo-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? (
            <>
              <FaSpinner className="h-4 w-4 animate-spin" />
              Uploading…
            </>
          ) : (
            <>
              <FaUpload className="h-4 w-4" />
              Click to upload an image
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
}
