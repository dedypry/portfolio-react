import Link from "next/link";
import {
  FaArrowRight,
  FaBriefcase,
  FaBlog,
  FaCommentDots,
  FaGraduationCap,
  FaInbox,
  FaProjectDiagram,
  FaCogs,
  FaUserEdit,
} from "react-icons/fa";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { PageHeader } from "./_components/PageHeader";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const session = await auth();
  const [
    blogCount,
    publishedCount,
    expCount,
    eduCount,
    projectCount,
    skillCount,
    pendingCommentCount,
    approvedCommentCount,
    unreadMessageCount,
    totalMessageCount,
  ] = await Promise.all([
    prisma.blog.count(),
    prisma.blog.count({ where: { status: "PUBLISHED" } }),
    prisma.experience.count(),
    prisma.education.count(),
    prisma.project.count(),
    prisma.skill.count(),
    prisma.comment.count({ where: { status: "PENDING" } }),
    prisma.comment.count({ where: { status: "APPROVED" } }),
    prisma.message.count({ where: { status: "UNREAD" } }),
    prisma.message.count(),
  ]);

  const stats = [
    {
      label: "Inbox",
      value: unreadMessageCount,
      sublabel:
        unreadMessageCount > 0
          ? `${unreadMessageCount} unread · ${totalMessageCount} total`
          : totalMessageCount > 0
            ? `${totalMessageCount} total · inbox zero ✦`
            : "no messages yet",
      icon: FaInbox,
      href: "/admin/messages",
      color: "from-sky-500 to-indigo-500",
    },
    {
      label: "Blog posts",
      value: blogCount,
      sublabel: `${publishedCount} published`,
      icon: FaBlog,
      href: "/admin/blogs",
      color: "from-indigo-500 to-fuchsia-500",
    },
    {
      label: "Comments",
      value: pendingCommentCount,
      sublabel:
        pendingCommentCount > 0
          ? `${pendingCommentCount} pending review · ${approvedCommentCount} live`
          : `${approvedCommentCount} live · all caught up`,
      icon: FaCommentDots,
      href: "/admin/comments",
      color: "from-amber-500 to-rose-500",
    },
    {
      label: "Experiences",
      value: expCount,
      sublabel: "career timeline",
      icon: FaBriefcase,
      href: "/admin/experiences",
      color: "from-emerald-500 to-teal-500",
    },
    {
      label: "Education",
      value: eduCount,
      sublabel: "degrees & courses",
      icon: FaGraduationCap,
      href: "/admin/education",
      color: "from-amber-500 to-orange-500",
    },
    {
      label: "Projects",
      value: projectCount,
      sublabel: "portfolio entries",
      icon: FaProjectDiagram,
      href: "/admin/projects",
      color: "from-rose-500 to-pink-500",
    },
    {
      label: "Skills",
      value: skillCount,
      sublabel: "across all groups",
      icon: FaCogs,
      href: "/admin/skills",
      color: "from-cyan-500 to-blue-500",
    },
    {
      label: "Profile",
      value: "Edit",
      sublabel: "hero, about, contact",
      icon: FaUserEdit,
      href: "/admin/profile",
      color: "from-violet-500 to-purple-500",
    },
  ];

  return (
    <>
      <PageHeader
        title={`Welcome back, ${session?.user?.name?.split(" ")[0] ?? "Admin"}.`}
        subtitle="Snapshot of everything you currently manage."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(({ label, value, sublabel, icon: Icon, href, color }) => (
          <Link
            key={label}
            href={href}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20 hover:bg-white/10"
          >
            <div
              className={`absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${color} opacity-20 blur-2xl transition group-hover:opacity-40`}
            />
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  {label}
                </div>
                <div className="mt-2 text-3xl font-semibold tracking-tight">
                  {value}
                </div>
                <div className="mt-1 text-xs text-slate-500">{sublabel}</div>
              </div>
              <div
                className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${color} text-white shadow-lg`}
              >
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs text-slate-400 transition group-hover:text-white">
              Manage
              <FaArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
