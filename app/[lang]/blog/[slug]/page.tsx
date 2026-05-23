import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { id as dfId, enUS } from "date-fns/locale";
import { ArrowLeft } from "lucide-react";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { isLanguage, type Language } from "@/i18n/config";
import {
  getApprovedComments,
  getBlogBySlug,
  getProfile,
} from "@/lib/queries";
import { hasFavorited } from "@/lib/blogTracking";

import { BlogActions } from "../_components/BlogActions";
import { BlogStats } from "../_components/BlogStats";
import { Comments } from "../_components/Comments";
import { ViewTracker } from "../_components/ViewTracker";

export const dynamic = "force-dynamic";

const LABELS = {
  en: { backToBlog: "All posts", minRead: "min read" },
  id: { backToBlog: "Semua tulisan", minRead: "menit baca" },
} as const satisfies Record<Language, Record<string, string>>;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang: rawLang, slug } = await params;
  if (!isLanguage(rawLang)) return {};
  const lang: Language = rawLang;

  const post = await getBlogBySlug(slug, lang);
  if (!post) return { title: "Not found" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: post.authorName ? [post.authorName] : undefined,
      images: post.coverImage ? [post.coverImage] : undefined,
      url: `/${lang}/blog/${post.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
    alternates: {
      canonical: `/${lang}/blog/${slug}`,
      languages: {
        en: `/en/blog/${slug}`,
        id: `/id/blog/${slug}`,
      },
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: rawLang, slug } = await params;
  if (!isLanguage(rawLang)) notFound();
  const lang: Language = rawLang;
  const labels = LABELS[lang];
  const dateLocale = lang === "id" ? dfId : enUS;

  const [post, profile] = await Promise.all([
    getBlogBySlug(slug, lang),
    getProfile(lang),
  ]);

  if (!post) notFound();

  // Run two more reads in parallel: the comment tree + the visitor's own
  // favorite state (cookie-based, server-side so first paint is correct).
  const [comments, isFavorited] = await Promise.all([
    getApprovedComments(post.id),
    hasFavorited(post.id),
  ]);

  // Absolute URL for share links — falls back to a relative path if the
  // site URL env var isn't configured (dev).
  const shareUrl = SITE_URL
    ? `${SITE_URL}/${lang}/blog/${post.slug}`
    : `/${lang}/blog/${post.slug}`;

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <ScrollProgress />
      <Navigation />
      <ViewTracker slug={post.slug} />

      <main className="container-x pb-24 pt-32 sm:pt-36">
        <div className="mx-auto max-w-3xl">
          <Link
            href={`/${lang}/blog`}
            className="group mb-8 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-white"
          >
            <ArrowLeft size={14} className="transition group-hover:-translate-x-0.5" />
            {labels.backToBlog}
          </Link>

          <article>
            <header>
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/50">
                {post.publishedAt && (
                  <time dateTime={post.publishedAt.toISOString()}>
                    {format(post.publishedAt, "dd MMMM yyyy", {
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
              <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="mt-4 text-lg text-white/70">{post.excerpt}</p>
              )}
              {post.tags.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {post.tags.map((tag) => (
                    <span key={tag} className="chip">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-6">
                <BlogStats
                  viewCount={post.viewCount}
                  favoriteCount={post.favoriteCount}
                  shareCount={post.shareCount}
                  commentCount={post.commentCount}
                  lang={lang}
                />
              </div>
            </header>

            {post.coverImage && (
              <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-3xl border border-white/10">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 768px"
                  priority
                  className="object-cover"
                />
              </div>
            )}

            <div
              className="prose prose-invert prose-lg mt-12 max-w-none prose-headings:font-display prose-headings:tracking-tight prose-a:text-accent-soft prose-img:rounded-2xl"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mt-10">
              <BlogActions
                slug={post.slug}
                title={post.title}
                url={shareUrl}
                initialFavoriteCount={post.favoriteCount}
                initialIsFavorited={isFavorited}
                initialShareCount={post.shareCount}
                lang={lang}
              />
            </div>

            {post.authorName && (
              <footer className="mt-12 border-t border-white/10 pt-8 text-sm text-white/55">
                Written by{" "}
                <span className="font-medium text-white">{post.authorName}</span>.
              </footer>
            )}

            <Comments
              slug={post.slug}
              initialComments={comments}
              initialCount={post.commentCount}
              lang={lang}
            />
          </article>
        </div>
      </main>

      <Footer name={profile.name} />
    </div>
  );
}
