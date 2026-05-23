import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import {
  getOrCreateSessionId,
  getRequestIp,
  hashIdentifier,
} from "@/lib/blogTracking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const submitSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(120),
  subject: z
    .string()
    .trim()
    .max(160)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  body: z.string().trim().min(5).max(4000),
  // Honeypot: legitimate visitors leave this blank. Bots happily fill it.
  // We accept the request silently to avoid teaching the bot it failed,
  // but never persist the row.
  website: z.string().optional(),
});

const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_MAX = 5;

export async function POST(req: Request) {
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

  // Honeypot: pretend success without saving anything.
  if (parsed.data.website && parsed.data.website.trim().length > 0) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const sessionId = await getOrCreateSessionId();
  const ipHash = hashIdentifier(getRequestIp(req));

  // Rate limit: 5 messages per hour per session — generous for legitimate
  // back-and-forth but tight enough to deter scripted spam.
  const recent = await prisma.message.count({
    where: {
      sessionId,
      createdAt: { gte: new Date(Date.now() - RATE_WINDOW_MS) },
    },
  });
  if (recent >= RATE_MAX) {
    return NextResponse.json(
      {
        error:
          "You've sent a lot of messages recently. Please try again in a bit.",
      },
      { status: 429 }
    );
  }

  await prisma.message.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      subject: parsed.data.subject ?? null,
      body: parsed.data.body,
      status: "UNREAD",
      sessionId,
      ipHash,
      userAgent: req.headers.get("user-agent")?.slice(0, 300) ?? null,
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
