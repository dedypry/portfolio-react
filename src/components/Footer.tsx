import { profile } from "../data/portfolio";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="container-x flex flex-col items-start justify-between gap-3 text-xs text-white/50 sm:flex-row sm:items-center">
        <div>
          © {new Date().getFullYear()} {profile.name}. Crafted with React, Vite,
          TypeScript & Tailwind CSS.
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          Designed and shipped from Indonesia.
        </div>
      </div>
    </footer>
  );
}
