/**
 * Server-side content queries: read from Prisma and return view-shaped data
 * for each section. Falls back gracefully to the static data in
 * `data/portfolio.ts` + `i18n/locales/*` when the DB is empty (e.g. first
 * deploy, before `npm run db:seed` ran).
 */
import { prisma } from "@/lib/prisma";
import {
  pickT,
  type ExperienceTx,
  type EducationTx,
  type ProfileTx,
  type ProjectTx,
  type SkillGroupTx,
  type BlogTx,
  type Translations,
} from "@/lib/translations";
import {
  experienceIds,
  experiencesMeta,
  profile as staticProfile,
  projectIds,
  projectsMeta,
  skillGroupIds,
  skillGroupItems,
} from "@/data/portfolio";
import { en as enLocale } from "@/i18n/locales/en";
import { id as idLocale } from "@/i18n/locales/id";
import type { Language } from "@/i18n/config";

const LOCALE_MAP = { en: enLocale, id: idLocale };

const TYPE_LABEL_FALLBACK: Record<string, "fulltime" | "freelance" | "projectBased"> = {
  FULL_TIME: "fulltime",
  FREELANCE: "freelance",
  CONTRACT: "projectBased",
  INTERNSHIP: "fulltime",
};

/* ─── Profile ─────────────────────────────────────────────── */

export interface ProfileView {
  name: string;
  initials: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  available: boolean;
  role: string;
  tagline: string;
  description: string;
  headlineLine1: string;
  headlineHighlight: string;
}

export async function getProfile(lang: Language): Promise<ProfileView> {
  const t = LOCALE_MAP[lang];

  try {
    const dbProfile = await prisma.profile.findFirst();
    if (dbProfile) {
      const tx = pickT<ProfileTx>(dbProfile.translations, lang, {
        role: t.about.role,
        tagline: t.about.tagline,
        description: t.about.description,
        headlineLine1: t.hero.headlineLine1,
        headlineHighlight: t.hero.headlineHighlight,
      });
      return {
        name: dbProfile.name,
        initials: dbProfile.initials,
        email: dbProfile.email,
        phone: dbProfile.phone,
        location: dbProfile.location,
        linkedin: dbProfile.linkedin,
        github: dbProfile.github,
        available: dbProfile.available,
        ...tx,
      };
    }
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[queries.getProfile] DB unavailable, using static fallback.", err);
    }
  }

  return {
    ...staticProfile,
    role: t.about.role,
    tagline: t.about.tagline,
    description: t.about.description,
    headlineLine1: t.hero.headlineLine1,
    headlineHighlight: t.hero.headlineHighlight,
  };
}

/* ─── Experience ─────────────────────────────────────────── */

export interface ExperienceView {
  id: string;
  company: string;
  location: string;
  period: string;
  type: "fulltime" | "freelance" | "projectBased";
  stack: string[];
  role: string;
  highlights: string[];
}

export async function getExperiences(lang: Language): Promise<ExperienceView[]> {
  const t = LOCALE_MAP[lang];

  try {
    const items = await prisma.experience.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    if (items.length > 0) {
      return items.map((item) => {
        const tx = pickT<ExperienceTx>(item.translations, lang, {
          role: "",
          highlights: [],
        });
        return {
          id: item.id,
          company: item.company,
          location: item.location,
          period: item.period,
          type: TYPE_LABEL_FALLBACK[item.type] ?? "fulltime",
          stack: item.stack,
          role: tx.role,
          highlights: tx.highlights,
        };
      });
    }
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[queries.getExperiences] DB unavailable, using static fallback.", err);
    }
  }

  return experienceIds.map((id) => {
    const meta = experiencesMeta[id];
    const copy = t.experience.items[id];
    return {
      id,
      company: copy.company,
      location: copy.location,
      period: copy.period,
      type: meta.type,
      stack: meta.stack ?? [],
      role: copy.role,
      highlights: copy.highlights,
    };
  });
}

/* ─── Projects ─────────────────────────────────────────── */

export interface ProjectView {
  id: string;
  category: string;
  accent: string | null;
  link: string | null;
  stack: string[];
  coverImage: string | null;
  featured: boolean;
  name: string;
  tagline: string;
  description: string;
}

export async function getProjects(lang: Language): Promise<ProjectView[]> {
  const t = LOCALE_MAP[lang];

  try {
    const items = await prisma.project.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    if (items.length > 0) {
      return items.map((item) => {
        const tx = pickT<ProjectTx>(item.translations, lang, {
          name: "",
          tagline: "",
          description: "",
        });
        return {
          id: item.id,
          category: item.category,
          accent: item.accent,
          link: item.link,
          stack: item.stack,
          coverImage: item.coverImage,
          featured: item.featured,
          ...tx,
        };
      });
    }
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[queries.getProjects] DB unavailable, using static fallback.", err);
    }
  }

  return projectIds.map((id) => {
    const meta = projectsMeta[id];
    const copy = t.projects.items[id];
    return {
      id,
      category: meta.category,
      accent: meta.accent,
      link: meta.link ?? null,
      stack: meta.stack,
      coverImage: null,
      featured: false,
      ...copy,
    };
  });
}

/* ─── Education ────────────────────────────────────────── */

export interface EducationView {
  id: string;
  school: string;
  location: string;
  period: string;
  degree: string;
  description: string;
}

export async function getEducation(lang: Language): Promise<EducationView[]> {
  const t = LOCALE_MAP[lang];

  try {
    const items = await prisma.education.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    if (items.length > 0) {
      return items.map((item) => {
        const tx = pickT<EducationTx>(item.translations, lang, {
          degree: "",
          description: "",
        });
        return {
          id: item.id,
          school: item.school,
          location: item.location,
          period: item.period,
          degree: tx.degree,
          description: tx.description ?? "",
        };
      });
    }
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[queries.getEducation] DB unavailable, using static fallback.", err);
    }
  }

  return [
    {
      id: "static",
      school: t.skills.education.school,
      location: t.skills.education.location,
      period: t.skills.education.period,
      degree: t.skills.education.degree,
      description: "",
    },
  ];
}

/* ─── Skills ────────────────────────────────────────────── */

export interface SkillGroupView {
  id: string;
  key: string;
  title: string;
  skills: string[];
}

export async function getSkillGroups(lang: Language): Promise<SkillGroupView[]> {
  const t = LOCALE_MAP[lang];

  try {
    const groups = await prisma.skillGroup.findMany({
      orderBy: [{ order: "asc" }],
      include: {
        skills: { orderBy: [{ order: "asc" }, { name: "asc" }] },
      },
    });
    if (groups.length > 0) {
      return groups.map((group) => {
        const tx = pickT<SkillGroupTx>(group.translations, lang, {
          title: group.key,
        });
        return {
          id: group.id,
          key: group.key,
          title: tx.title,
          skills: group.skills.map((s) => s.name),
        };
      });
    }
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[queries.getSkillGroups] DB unavailable, using static fallback.", err);
    }
  }

  return skillGroupIds.map((key) => ({
    id: key,
    key,
    title: t.skills.groupTitles[key],
    skills: key === "practices" ? t.skills.practices : skillGroupItems[key],
  }));
}

/* ─── Blogs ─────────────────────────────────────────────── */

/** Engagement counters surfaced on the public site. */
export interface BlogStats {
  viewCount: number;
  favoriteCount: number;
  shareCount: number;
  commentCount: number;
}

export interface BlogListItem extends BlogStats {
  id: string;
  slug: string;
  publishedAt: Date | null;
  readingTime: number | null;
  coverImage: string | null;
  tags: string[];
  title: string;
  excerpt: string;
}

export interface BlogDetail extends BlogListItem {
  content: string;
  authorName: string | null;
}

const tryDb = async <T>(run: () => Promise<T>, fallback: T): Promise<T> => {
  try {
    return await run();
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[queries] DB query failed, using fallback.", err);
    }
    return fallback;
  }
};

export async function getPublishedBlogs(lang: Language): Promise<BlogListItem[]> {
  const fallback: Translations<BlogTx> = {
    en: { title: "", excerpt: "", content: "" },
    id: { title: "", excerpt: "", content: "" },
  };

  return tryDb(
    async () => {
      const blogs = await prisma.blog.findMany({
        where: { status: "PUBLISHED", publishedAt: { lte: new Date() } },
        orderBy: { publishedAt: "desc" },
        include: {
          // Per-blog count of approved (publicly visible) comments.
          _count: { select: { comments: { where: { status: "APPROVED" } } } },
        },
      });

      return blogs.map((b) => {
        const tx = pickT<BlogTx>(b.translations, lang, fallback[lang]);
        return {
          id: b.id,
          slug: b.slug,
          publishedAt: b.publishedAt,
          readingTime: b.readingTime,
          coverImage: b.coverImage,
          tags: b.tags,
          title: tx.title,
          excerpt: tx.excerpt,
          viewCount: b.viewCount,
          favoriteCount: b.favoriteCount,
          shareCount: b.shareCount,
          commentCount: b._count.comments,
        };
      });
    },
    []
  );
}

export async function getBlogBySlug(
  slug: string,
  lang: Language
): Promise<BlogDetail | null> {
  return tryDb(
    async () => {
      const blog = await prisma.blog.findUnique({
        where: { slug },
        include: {
          author: { select: { name: true } },
          _count: { select: { comments: { where: { status: "APPROVED" } } } },
        },
      });
      if (!blog || blog.status !== "PUBLISHED") return null;

      const tx = pickT<BlogTx>(blog.translations, lang, {
        title: "",
        excerpt: "",
        content: "",
      });

      return {
        id: blog.id,
        slug: blog.slug,
        publishedAt: blog.publishedAt,
        readingTime: blog.readingTime,
        coverImage: blog.coverImage,
        tags: blog.tags,
        title: tx.title,
        excerpt: tx.excerpt,
        content: tx.content,
        authorName: blog.author?.name ?? null,
        viewCount: blog.viewCount,
        favoriteCount: blog.favoriteCount,
        shareCount: blog.shareCount,
        commentCount: blog._count.comments,
      };
    },
    null
  );
}

/* ─── Comments ─────────────────────────────────────────── */

/**
 * Public-shape comment node for rendering. Only fields that are safe to
 * expose to all visitors. authorEmail is never sent to the client.
 */
export interface CommentNode {
  id: string;
  parentId: string | null;
  authorName: string;
  authorWebsite: string | null;
  body: string;
  createdAt: Date;
  isAiReply: boolean;
  replies: CommentNode[];
}

/**
 * Build a nested comment tree from the flat list returned by Prisma.
 * Children are sorted oldest-first so the conversation reads top-down.
 */
function buildCommentTree(
  rows: {
    id: string;
    parentId: string | null;
    authorName: string;
    authorWebsite: string | null;
    body: string;
    createdAt: Date;
    isAiReply: boolean;
  }[]
): CommentNode[] {
  const byId = new Map<string, CommentNode>();
  const roots: CommentNode[] = [];

  for (const row of rows) {
    byId.set(row.id, { ...row, replies: [] });
  }

  for (const row of rows) {
    const node = byId.get(row.id)!;
    if (row.parentId && byId.has(row.parentId)) {
      byId.get(row.parentId)!.replies.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

/**
 * Fetch all approved comments for a blog as a tree. Returns an empty array
 * if the post has no approved comments yet (or the DB is unreachable).
 */
export async function getApprovedComments(
  blogId: string
): Promise<CommentNode[]> {
  return tryDb(
    async () => {
      const rows = await prisma.comment.findMany({
        where: { blogId, status: "APPROVED" },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          parentId: true,
          authorName: true,
          authorWebsite: true,
          body: true,
          createdAt: true,
          isAiReply: true,
        },
      });
      return buildCommentTree(rows);
    },
    []
  );
}
