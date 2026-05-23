import { redirect } from "next/navigation";

import { auth, signOut } from "@/lib/auth";

import { Sidebar } from "./_components/Sidebar";

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

  const handleSignOut = async () => {
    "use server";
    await signOut({ redirectTo: "/login" });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex">
        <Sidebar
          user={{
            name: session.user.name ?? session.user.email ?? "Admin",
            email: session.user.email ?? "",
            avatarUrl: session.user.image ?? null,
          }}
          onSignOutAction={handleSignOut}
        />
        <main className="flex-1 min-w-0">
          <div className="mx-auto max-w-6xl px-6 py-8 lg:px-10 lg:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
