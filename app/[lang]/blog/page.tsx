import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { id as dfId, enUS } from "date-fns/locale";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { isLanguage, type Language } from "@/i18n/config";
import { getProfile, getPublishedBlogs } from "@/lib/queries";

export const dynamic = "force-dynamic";

const LABELS = {
  en: {
    eyebrow: "Blog",
    title: "Notes from the keyboard.",
    description:
      "Practical engineering write-ups — backend architecture, frontend craft, leadership, and the occasional war story.",
    minRead: "min read",
    empty: "No posts yet. Check back soon.",
  },
  id: {
    eyebrow: "Blog",
    title: "Catatan dari keyboard.",
    description:
      "Tulisan engineering praktis — arsitektur backend, frontend, leadership, dan sesekali cerita perang.",
    minRead: "menit baca",
    empty: "Belum ada artikel. Cek lagi nanti.",
  },
} as const satisfies Record<Language, Record<string, string>>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  if (!isLanguage(rawLang)) return {};
  const lang: Language = rawLang;
  const labels = LABELS[lang];

  return {
    title: labels.title,
    description: labels.description,
    alternates: {
      canonical: `/${lang}/blog`,
      languages: { en: "/en/blog", id: "/id/blog" },
    },
  };
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  if (!isLanguage(rawLang)) notFound();
  const lang: Language = rawLang;
  const labels = LABELS[lang];
  const dateLocale = lang === "id" ? dfId : enUS;

  const [posts, profile] = await Promise.all([
    getPublishedBlogs(lang),
    getProfile(lang),
  ]);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <ScrollProgress />
      <Navigation />

      <main className="container-x pb-24 pt-32 sm:pt-36">
        <header className="max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-accent-soft">
            {labels.eyebrow}
          </span>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {labels.title}
          </h1>
          <p className="mt-4 text-lg text-white/70">{labels.description}</p>
        </header>

        {posts.length === 0 ? (
          <div className="mt-12 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-20 text-center text-sm text-white/50">
            {labels.empty}
          </div>
        ) : (
          <ul className="mt-12 grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/${lang}/blog/${post.slug}`}
                  className="group block h-full overflow-hidden rounded-3xl border border-white/10 bg-ink-900/60 transition hover:-translate-y-1 hover:border-white/20"
                >
                  {post.coverImage && (
                    <div className="relative aspect-[16/9] w-full overflow-hidden">
                      <Image
                        src={post.coverImage}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/50">
                      {post.publishedAt && (
                        <time dateTime={post.publishedAt.toISOString()}>
                          {format(post.publishedAt, "dd MMM yyyy", {
                            locale: dateLocale,
                          })}
                        </time>
                      )}
                      {post.readingTime && (
                        <>
                          <span>·</span>
                          <span>
                            {post.readingTime} {labels.minRead}
                          </span>
                        </>
                      )}
                    </div>
                    <h2 className="mt-3 font-display text-xl font-semibold text-white transition group-hover:text-accent-soft">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-white/65">
                      {post.excerpt}
                    </p>
                    {post.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {post.tags.map((tag) => (
                          <span key={tag} className="chip">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>

      <Footer name={profile.name} />
    </div>
  );
}
