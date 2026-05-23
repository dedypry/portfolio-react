"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useRef } from "react";
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaCode,
  FaListUl,
  FaListOl,
  FaQuoteLeft,
  FaLink,
  FaImage,
  FaUndo,
  FaRedo,
  FaHeading,
} from "react-icons/fa";

interface EditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const buttonClass =
  "grid h-8 w-8 place-items-center rounded-md text-slate-400 transition hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed";

export function Editor({ value, onChange, placeholder }: EditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-indigo-400 underline" },
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-lg my-4" },
      }),
      Placeholder.configure({
        placeholder: placeholder ?? "Start writing your post…",
      }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert prose-sm sm:prose-base max-w-none min-h-[280px] focus:outline-none px-4 py-3",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  // Keep editor in sync if `value` changes externally (e.g. form reset).
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  const handleAddLink = () => {
    if (!editor) return;
    const url = window.prompt("Enter URL");
    if (!url) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const handleImageUpload = async (file: File) => {
    if (!editor) return;
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      window.alert("Upload failed");
      return;
    }
    const { url } = (await res.json()) as { url: string };
    editor.chain().focus().setImage({ src: url }).run();
  };

  if (!editor) {
    return (
      <div className="rounded-lg border border-white/10 bg-slate-900/60 p-4 text-sm text-slate-500">
        Loading editor…
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-slate-900/60">
      <div className="flex flex-wrap items-center gap-1 border-b border-white/10 bg-slate-950/40 p-1.5">
        <button
          type="button"
          aria-label="Heading 2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`${buttonClass} ${editor.isActive("heading", { level: 2 }) ? "bg-white/10 text-white" : ""}`}
        >
          <FaHeading className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          aria-label="Bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${buttonClass} ${editor.isActive("bold") ? "bg-white/10 text-white" : ""}`}
        >
          <FaBold className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          aria-label="Italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${buttonClass} ${editor.isActive("italic") ? "bg-white/10 text-white" : ""}`}
        >
          <FaItalic className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          aria-label="Strikethrough"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`${buttonClass} ${editor.isActive("strike") ? "bg-white/10 text-white" : ""}`}
        >
          <FaStrikethrough className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          aria-label="Inline code"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`${buttonClass} ${editor.isActive("code") ? "bg-white/10 text-white" : ""}`}
        >
          <FaCode className="h-3.5 w-3.5" />
        </button>

        <span className="mx-1 h-5 w-px bg-white/10" />

        <button
          type="button"
          aria-label="Bullet list"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${buttonClass} ${editor.isActive("bulletList") ? "bg-white/10 text-white" : ""}`}
        >
          <FaListUl className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          aria-label="Ordered list"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`${buttonClass} ${editor.isActive("orderedList") ? "bg-white/10 text-white" : ""}`}
        >
          <FaListOl className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          aria-label="Blockquote"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`${buttonClass} ${editor.isActive("blockquote") ? "bg-white/10 text-white" : ""}`}
        >
          <FaQuoteLeft className="h-3.5 w-3.5" />
        </button>

        <span className="mx-1 h-5 w-px bg-white/10" />

        <button
          type="button"
          aria-label="Add link"
          onClick={handleAddLink}
          className={buttonClass}
        >
          <FaLink className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          aria-label="Add image"
          onClick={() => fileInputRef.current?.click()}
          className={buttonClass}
        >
          <FaImage className="h-3.5 w-3.5" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleImageUpload(file);
            e.target.value = "";
          }}
        />

        <span className="mx-1 h-5 w-px bg-white/10" />

        <button
          type="button"
          aria-label="Undo"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={buttonClass}
        >
          <FaUndo className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          aria-label="Redo"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={buttonClass}
        >
          <FaRedo className="h-3.5 w-3.5" />
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
