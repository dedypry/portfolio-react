import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import { LoginForm } from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  const params = await searchParams;

  if (session?.user) {
    redirect(params.callbackUrl ?? "/admin");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 grid place-items-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white text-xl font-semibold shadow-lg shadow-indigo-900/30">
            DP
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin Sign In</h1>
          <p className="text-sm text-slate-400">
            Masuk untuk mengelola konten portfolio &amp; blog.
          </p>
        </div>

        <LoginForm
          callbackUrl={params.callbackUrl ?? "/admin"}
          initialError={params.error}
        />

        <p className="text-center text-xs text-slate-500">
          Lupa password? Reset langsung di database.
        </p>
      </div>
    </div>
  );
}
