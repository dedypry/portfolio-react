"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  FaTachometerAlt,
  FaUserEdit,
  FaBriefcase,
  FaGraduationCap,
  FaProjectDiagram,
  FaCogs,
  FaBlog,
  FaSignOutAlt,
  FaArrowLeft,
} from "react-icons/fa";

interface SidebarProps {
  user: { name: string; email: string; avatarUrl: string | null };
  onSignOutAction: () => Promise<void>;
}

interface NavItem {
  href: string;
  label: string;
  icon: typeof FaTachometerAlt;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: FaTachometerAlt, exact: true },
  { href: "/admin/profile", label: "Profile", icon: FaUserEdit },
  { href: "/admin/blogs", label: "Blogs", icon: FaBlog },
  { href: "/admin/experiences", label: "Experience", icon: FaBriefcase },
  { href: "/admin/education", label: "Education", icon: FaGraduationCap },
  { href: "/admin/projects", label: "Projects", icon: FaProjectDiagram },
  { href: "/admin/skills", label: "Skills", icon: FaCogs },
];

export function Sidebar({ user, onSignOutAction }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-white/10 bg-slate-950/95 backdrop-blur">
      <div className="px-5 py-6">
        <Link
          href="/admin"
          className="flex items-center gap-3 text-sm font-semibold tracking-tight"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-900/30">
            DP
          </span>
          <span className="leading-tight">
            dedypry
            <span className="block text-xs font-normal text-slate-400">
              Admin Panel
            </span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={[
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                active
                  ? "bg-white/10 text-white shadow-inner"
                  : "text-slate-400 hover:bg-white/5 hover:text-white",
              ].join(" ")}
            >
              <Icon
                className={[
                  "h-4 w-4 shrink-0 transition",
                  active
                    ? "text-indigo-300"
                    : "text-slate-500 group-hover:text-slate-300",
                ].join(" ")}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-3 py-3 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-slate-400 hover:bg-white/5 hover:text-white"
        >
          <FaArrowLeft className="h-3.5 w-3.5" />
          View site
        </Link>

        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-xs font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-medium text-white">
              {user.name}
            </div>
            <div className="truncate text-[10px] text-slate-500">
              {user.email}
            </div>
          </div>
        </div>

        <form action={onSignOutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs text-rose-300 transition hover:bg-rose-500/10"
          >
            <FaSignOutAlt className="h-3.5 w-3.5" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
