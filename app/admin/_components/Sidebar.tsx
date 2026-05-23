"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaTachometerAlt,
  FaUserEdit,
  FaBriefcase,
  FaGraduationCap,
  FaProjectDiagram,
  FaCogs,
  FaBlog,
  FaCommentDots,
  FaInbox,
} from "react-icons/fa";

interface SidebarProps {
  pendingCommentCount?: number;
  unreadMessageCount?: number;
}

interface NavItem {
  href: string;
  label: string;
  icon: typeof FaTachometerAlt;
  exact?: boolean;
  /** Source key for the badge counter — see SidebarProps. */
  badgeKey?: "pendingComments" | "unreadMessages";
}

interface NavGroup {
  /** Section label rendered above the items, uppercase + small. */
  title: string | null;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: null,
    items: [
      {
        href: "/admin",
        label: "Dashboard",
        icon: FaTachometerAlt,
        exact: true,
      },
    ],
  },
  {
    title: "Engagement",
    items: [
      {
        href: "/admin/messages",
        label: "Inbox",
        icon: FaInbox,
        badgeKey: "unreadMessages",
      },
      {
        href: "/admin/comments",
        label: "Comments",
        icon: FaCommentDots,
        badgeKey: "pendingComments",
      },
    ],
  },
  {
    title: "Content",
    items: [
      { href: "/admin/blogs", label: "Blog posts", icon: FaBlog },
      { href: "/admin/projects", label: "Projects", icon: FaProjectDiagram },
    ],
  },
  {
    title: "Identity",
    items: [
      { href: "/admin/profile", label: "Profile", icon: FaUserEdit },
      { href: "/admin/experiences", label: "Experience", icon: FaBriefcase },
      { href: "/admin/education", label: "Education", icon: FaGraduationCap },
      { href: "/admin/skills", label: "Skills", icon: FaCogs },
    ],
  },
];

export function Sidebar({
  pendingCommentCount = 0,
  unreadMessageCount = 0,
}: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const counts = {
    pendingComments: pendingCommentCount,
    unreadMessages: unreadMessageCount,
  };

  return (
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-white/10 bg-slate-950/95 backdrop-blur">
      <div className="px-5 py-5">
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

      <nav
        aria-label="Admin sections"
        className="flex-1 overflow-y-auto px-3 pb-6 pt-2"
      >
        {NAV_GROUPS.map((group, idx) => (
          <div key={group.title ?? `group-${idx}`} className="mb-4 last:mb-0">
            {group.title && (
              <div className="px-3 pb-1.5 pt-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                {group.title}
              </div>
            )}
            <ul className="space-y-0.5">
              {group.items.map(
                ({ href, label, icon: Icon, exact, badgeKey }) => {
                  const active = isActive(href, exact);
                  const badgeCount = badgeKey ? counts[badgeKey] : 0;
                  const showBadge = badgeCount > 0;
                  return (
                    <li key={href}>
                      <Link
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
                        <span className="flex-1">{label}</span>
                        {showBadge && (
                          <span
                            className="grid h-5 min-w-[20px] place-items-center rounded-full bg-rose-500/90 px-1.5 text-[10px] font-semibold tabular-nums text-white"
                            aria-label={`${badgeCount} awaiting attention`}
                            title={`${badgeCount} awaiting attention`}
                          >
                            {badgeCount > 99 ? "99+" : badgeCount}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                }
              )}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
