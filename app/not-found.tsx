import Link from "next/link";
import { DEFAULT_LANGUAGE } from "@/i18n/config";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-6 py-20 text-center">
      <div className="max-w-md space-y-5">
        <p className="font-mono text-xs uppercase tracking-[0.32em] text-accent-soft">
          404
        </p>
        <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
          Lost in the codebase
        </h1>
        <p className="text-white/60">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.
        </p>
        <Link
          href={`/${DEFAULT_LANGUAGE}`}
          className="btn-primary inline-flex"
        >
          Back to portfolio
        </Link>
      </div>
    </div>
  );
}
