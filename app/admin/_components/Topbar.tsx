"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  FaChevronDown,
  FaExternalLinkAlt,
  FaPlus,
  FaSignOutAlt,
  FaUserEdit,
} from "react-icons/fa";

import type { AdminNotifications } from "@/lib/adminNotifications";

import { NotificationBell } from "./NotificationBell";

interface TopbarProps {
  user: { name: string; email: string; avatarUrl: string | null };
  notifications: AdminNotifications;
  onSignOutAction: () => Promise<void>;
}

/**
 * Pretty title derived from the URL. Saves us from threading a `title` prop
 * down through every admin page. The dashboard gets its own friendly label.
 */
function pageTitleFromPath(pathname: string): string {
  if (!pathname || pathname === "/admin") return "Dashboard";
  const segments = pathname.replace(/^\/admin\/?/, "").split("/").filter(Boolean);
  if (segments.length === 0) return "Dashboard";

  const first = segments[0];
  const map: Record<string, string> = {
    blogs: "Blog posts",
    comments: "Comments",
    messages: "Inbox",
    profile: "Profile",
    experiences: "Experience",
    education: "Education",
    projects: "Projects",
    skills: "Skills",
  };
  const base = map[first] ?? first.charAt(0).toUpperCase() + first.slice(1);

  // /admin/blogs/new ⇒ "Blog posts · New"
  if (segments.length > 1) {
    const tail = segments[segments.length - 1];
    if (tail === "new") return `${base} · New`;
    if (segments.includes("edit")) return `${base} · Edit`;
  }
  return base;
}

/** Routes where the "+ New" CTA should appear in the topbar. */
const QUICK_NEW: { matcher: RegExp; href: string; label: string }[] = [
  { matcher: /^\/admin\/blogs/, href: "/admin/blogs/new", label: "New post" },
  {
    matcher: /^\/admin\/projects/,
    href: "/admin/projects/new",
    label: "New project",
  },
  {
    matcher: /^\/admin\/experiences/,
    href: "/admin/experiences/new",
    label: "New experience",
  },
  {
    matcher: /^\/admin\/education/,
    href: "/admin/education/new",
    label: "New entry",
  },
  {
    matcher: /^\/admin\/skills/,
    href: "/admin/skills/new-group",
    label: "New group",
  },
];

export function Topbar({
  user,
  notifications,
  onSignOutAction,
}: TopbarProps) {
  const pathname = usePathname() ?? "";
  const title = pageTitleFromPath(pathname);

  const quickAction = QUICK_NEW.find((q) => q.matcher.test(pathname));

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-white/10 bg-slate-950/80 px-4 backdrop-blur-xl lg:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <h1 className="truncate text-sm font-semibold tracking-tight text-white">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {quickAction && (
          <Link
            href={quickAction.href}
            className="hidden items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-3 py-1.5 text-xs font-medium text-white shadow-md shadow-indigo-900/30 transition hover:from-indigo-400 hover:to-fuchsia-400 sm:inline-flex"
          >
            <FaPlus className="h-3 w-3" />
            {quickAction.label}
          </Link>
        )}

        <Link
          href="/"
          target="_blank"
          rel="noreferrer"
          title="Open public site in new tab"
          className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 transition hover:border-white/20 hover:bg-white/10 hover:text-white sm:inline-flex"
        >
          <FaExternalLinkAlt className="h-3 w-3" />
          View site
        </Link>

        <NotificationBell data={notifications} />

        <UserMenu user={user} onSignOutAction={onSignOutAction} />
      </div>
    </header>
  );
}

/* ─── User menu ───────────────────────────────────────────── */

function UserMenu({
  user,
  onSignOutAction,
}: {
  user: TopbarProps["user"];
  onSignOutAction: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickAway = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClickAway);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClickAway);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={[
          "flex items-center gap-2 rounded-full border px-1.5 py-1 transition",
          open
            ? "border-white/20 bg-white/10"
            : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10",
        ].join(" ")}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt=""
            width={26}
            height={26}
            className="h-[26px] w-[26px] rounded-full object-cover"
          />
        ) : (
          <div className="grid h-[26px] w-[26px] place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-[11px] font-semibold text-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="hidden text-xs font-medium text-white sm:inline">
          {user.name.split(" ")[0]}
        </span>
        <FaChevronDown className="h-2.5 w-2.5 text-slate-400" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-slate-900/95 shadow-2xl shadow-black/40 backdrop-blur"
        >
          <div className="border-b border-white/10 px-4 py-3">
            <div className="truncate text-xs font-semibold text-white">
              {user.name}
            </div>
            <div className="truncate text-[10px] text-slate-500">
              {user.email}
            </div>
          </div>
          <Link
            href="/admin/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2 text-xs text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <FaUserEdit className="h-3.5 w-3.5 text-slate-500" />
            Edit profile
          </Link>
          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2 text-xs text-slate-300 transition hover:bg-white/5 hover:text-white sm:hidden"
          >
            <FaExternalLinkAlt className="h-3 w-3 text-slate-500" />
            View site
          </Link>
          <form action={onSignOutAction} className="border-t border-white/10">
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center gap-3 px-4 py-2 text-xs text-rose-300 transition hover:bg-rose-500/10"
            >
              <FaSignOutAlt className="h-3.5 w-3.5" />
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
