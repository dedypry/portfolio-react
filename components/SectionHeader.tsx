"use client";

import Reveal from "./Reveal";

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
}: Props) {
  return (
    <Reveal
      className={`mb-12 flex flex-col gap-3 ${
        align === "center" ? "items-center text-center" : "items-start"
      }`}
    >
      <span className="section-eyebrow">{eyebrow}</span>
      <h2 className="section-title text-white">{title}</h2>
      {description && (
        <p className="max-w-2xl text-white/60 sm:text-lg">{description}</p>
      )}
    </Reveal>
  );
}
