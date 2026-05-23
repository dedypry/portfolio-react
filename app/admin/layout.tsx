import { redirect } from "next/navigation";

import { auth, signOut } from "@/lib/auth";
import { getAdminNotifications } from "@/lib/adminNotifications";

import { Sidebar } from "./_components/Sidebar";
import { Topbar } from "./_components/Topbar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  // Single source of truth for the bell, the sidebar badges, and the
  // dashboard tiles. Errors swallowed inside the helper.
  const notifications = await getAdminNotifications();

  const handleSignOut = async () => {
    "use server";
    await signOut({ redirectTo: "/login" });
  };

  const user = {
    name: session.user.name ?? session.user.email ?? "Admin",
    email: session.user.email ?? "",
    avatarUrl: session.user.image ?? null,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex">
        <Sidebar
          pendingCommentCount={notifications.counts.pendingComments}
          unreadMessageCount={notifications.counts.unreadMessages}
        />
        <main className="flex min-h-screen flex-1 min-w-0 flex-col">
          <Topbar
            user={user}
            notifications={notifications}
            onSignOutAction={handleSignOut}
          />
          <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-8 lg:px-10 lg:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
