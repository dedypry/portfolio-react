import { NextResponse } from "next/server";
import { after } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { getApprovedComments } from "@/lib/queries";
import {
  getOrCreateSessionId,
  getRequestIp,
  hashIdentifier,
} from "@/lib/blogTracking";
import {
  blogChannel,
  getPusherServer,
  PUSHER_EVENTS,
} from "@/lib/pusher/server";
import {
  detectLanguage,
  generateBlogReply,
  htmlToPlainExcerpt,
  moderateComment,
} from "@/lib/aiModeration";
import { pickT, type BlogTx, type ProfileTx } from "@/lib/translations";
import type { Language } from "@/i18n/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const submitSchema = z.object({
  authorName: z.string().trim().min(1).max(60),
  authorEmail: z.string().trim().email().max(120),
  authorWebsite: z.preprocess(
    (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
    z.string().trim().url().max(200).optional()
  ),
  body: z.string().trim().min(1).max(2000),
  parentId: z.string().cuid().optional(),
  /** Page locale — used to bias the AI reply tone. Optional + defaulted. */
  lang: z.enum(["en", "id"]).optional(),
});

const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_MAX = 5;

const AI_MODEL_NAME = process.env.GEMINI_MODEL || "gemini-2.0-flash";

/** Public payload shape for Pusher events. Mirrors `PusherCommentPayload`. */
function publicCommentPayload(c: {
  id: string;
  parentId: string | null;
  authorName: string;
  authorWebsite: string | null;
  body: string;
  createdAt: Date;
  isAiReply: boolean;
}) {
  return {
    id: c.id,
    parentId: c.parentId,
    authorName: c.authorName,
    authorWebsite: c.authorWebsite,
    body: c.body,
    createdAt: c.createdAt.toISOString(),
    isAiReply: c.isAiReply,
  };
}

/* ─── GET — public approved tree ───────────────────────────── */

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  const blog = await prisma.blog.findUnique({
    where: { slug },
    select: { id: true, status: true },
  });
  if (!blog || blog.status !== "PUBLISHED") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const comments = await getApprovedComments(blog.id);
  return NextResponse.json({ comments });
}

/* ─── POST — submit a new comment ──────────────────────────── */

/**
 * Submission flow:
 *   1. Validate + rate-limit the request.
 *   2. Insert the comment as PENDING.
 *   3. Return 201 immediately so the visitor doesn't wait for AI calls.
 *   4. Inside `after()`, run AI moderation in the background:
 *      - If clean → flip to APPROVED, broadcast on Pusher, then generate
 *        the AI auto-reply (also broadcast on Pusher).
 *      - If problematic → flip to REJECTED/SPAM, broadcast a rejection
 *        event so the visitor can be told their comment didn't pass.
 *
 * Failure modes are conservative: any AI/network hiccup leaves the comment
 * in PENDING for the admin to review manually from /admin/comments.
 */
export async function POST(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = submitSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const blog = await prisma.blog.findUnique({
    where: { slug },
    select: { id: true, status: true },
  });
  if (!blog || blog.status !== "PUBLISHED") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (parsed.data.parentId) {
    const parent = await prisma.comment.findUnique({
      where: { id: parsed.data.parentId },
      select: { blogId: true },
    });
    if (!parent || parent.blogId !== blog.id) {
      return NextResponse.json(
        { error: "Reply target not found" },
        { status: 400 }
      );
    }
  }

  const sessionId = await getOrCreateSessionId();
  const ipHash = hashIdentifier(getRequestIp(req));

  const recent = await prisma.comment.count({
    where: {
      sessionId,
      createdAt: { gte: new Date(Date.now() - RATE_WINDOW_MS) },
    },
  });
  if (recent >= RATE_MAX) {
    return NextResponse.json(
      {
        error:
          "You're commenting a bit fast. Take a breath and try again in a few minutes.",
      },
      { status: 429 }
    );
  }

  const created = await prisma.comment.create({
    data: {
      blogId: blog.id,
      parentId: parsed.data.parentId,
      authorName: parsed.data.authorName,
      authorEmail: parsed.data.authorEmail.toLowerCase(),
      authorWebsite: parsed.data.authorWebsite,
      body: parsed.data.body,
      status: "PENDING",
      sessionId,
      ipHash,
      userAgent: req.headers.get("user-agent")?.slice(0, 300) ?? null,
    },
  });

  // Lock in the language NOW so the background job doesn't have to guess.
  // Prefer the page's locale if provided, otherwise heuristic on the body.
  const lang: Language = parsed.data.lang ?? detectLanguage(created.body);

  // Schedule AI work after the response is flushed. Next 15's `after()` keeps
  // the function invocation alive on the runtime for this — fire-and-forget
  // `void promise` would also work on long-running Node, but `after()` is the
  // documented way and works on serverless too.
  after(async () => {
    try {
      await runModerationAndReply({
        commentId: created.id,
        blogId: blog.id,
        slug,
        lang,
      });
    } catch (err) {
      console.error("[comments.after] background AI work failed:", err);
    }
  });

  return NextResponse.json(
    {
      pending: true,
      id: created.id,
      message:
        "Thanks! Your comment is being reviewed by our AI moderator and will appear in a moment.",
    },
    { status: 201 }
  );
}

/* ─── Background helpers ───────────────────────────────────── */

interface BackgroundArgs {
  commentId: string;
  blogId: string;
  slug: string;
  lang: Language;
}

/**
 * 1. Run AI moderation on the just-inserted comment.
 * 2. Persist the verdict + broadcast over Pusher.
 * 3. If approved (and the comment isn't itself an AI reply), generate +
 *    persist + broadcast an AI reply.
 */
async function runModerationAndReply({
  commentId,
  blogId,
  slug,
  lang,
}: BackgroundArgs) {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) return;

  const verdict = await moderateComment(comment.body, lang);
  const channel = blogChannel(slug);
  const pusher = getPusherServer();

  if (!verdict.approved) {
    const status =
      verdict.recommendation === "SPAM" ? "SPAM" : "REJECTED";
    await prisma.comment.update({
      where: { id: commentId },
      data: { status },
    });

    if (pusher) {
      await pusher
        .trigger(channel, PUSHER_EVENTS.COMMENT_REJECTED, {
          id: commentId,
          reason:
            verdict.reason ??
            (status === "SPAM"
              ? "Looks like spam. Try without the links?"
              : "Your comment didn't pass automated moderation."),
        })
        .catch((err) => {
          console.warn("[pusher] rejection broadcast failed:", err);
        });
    }
    return;
  }

  // Approved — flip status and broadcast.
  const approved = await prisma.comment.update({
    where: { id: commentId },
    data: { status: "APPROVED" },
  });

  if (pusher) {
    await pusher
      .trigger(channel, PUSHER_EVENTS.COMMENT_NEW, publicCommentPayload(approved))
      .catch((err) => {
        console.warn("[pusher] new-comment broadcast failed:", err);
      });
  }

  // Don't auto-reply to AI replies — prevents reply-loops. (Visitor replies to
  // an AI reply would hit this path with isAiReply=false, which is fine.)
  if (approved.isAiReply) return;

  // Pull just enough blog context for a grounded reply.
  const blog = await prisma.blog.findUnique({
    where: { id: blogId },
    select: { translations: true, author: { select: { name: true } } },
  });
  if (!blog) return;

  const blogTx = pickT<BlogTx>(blog.translations, lang, {
    title: "",
    excerpt: "",
    content: "",
  });

  // Author identity for the AI reply — pulled from the singleton Profile so
  // the reply visually appears to come from "Dedy" with an AI badge.
  const profile = await prisma.profile.findFirst();
  const profileTx = profile
    ? pickT<ProfileTx>(profile.translations, lang, {
        role: "",
        tagline: "",
        description: "",
        headlineLine1: "",
        headlineHighlight: "",
      })
    : null;
  const authorName = profile?.name ?? blog.author?.name ?? "Dedy";
  const authorEmail = profile?.email ?? "ai@dedypry.site";
  const authorWebsite = profile?.linkedin ?? null;
  // Mark unused so eslint doesn't complain — kept for future "personalised
  // tone" work where the AI gets the author's tagline.
  void profileTx;

  const replyText = await generateBlogReply({
    blog: {
      title: blogTx.title,
      excerpt: blogTx.excerpt,
      contentPlain: htmlToPlainExcerpt(blogTx.content),
      authorName,
    },
    comment: { authorName: approved.authorName, body: approved.body },
    lang,
  });

  if (!replyText) return;

  const aiReply = await prisma.comment.create({
    data: {
      blogId,
      parentId: approved.id,
      authorName,
      authorEmail,
      authorWebsite,
      body: replyText,
      status: "APPROVED",
      isAiReply: true,
      aiModel: AI_MODEL_NAME,
      sessionId: "ai-assistant",
      ipHash: null,
      userAgent: null,
    },
  });

  if (pusher) {
    await pusher
      .trigger(channel, PUSHER_EVENTS.COMMENT_NEW, publicCommentPayload(aiReply))
      .catch((err) => {
        console.warn("[pusher] AI reply broadcast failed:", err);
      });
  }
}
