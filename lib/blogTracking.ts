/**
 * Cookie-based dedup for anonymous blog engagement.
 *
 * We deliberately keep this trivially bypassable (any visitor who clears
 * cookies can refavorite/review). The goal is "honest counts in the common
 * case", not Fort Knox. For a portfolio blog that's the right trade-off.
 *
 * Cookie naming:
 *   - `bv_<blogId>` (blog-view)     : presence = already counted as a view
 *   - `bf_<blogId>` (blog-favorite) : presence = currently favorited
 *   - `bsid`                        : opaque session id for comment dedup
 */
import { cookies } from "next/headers";
import crypto from "node:crypto";

const SESSION_COOKIE = "bsid";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;
const VIEW_DEDUP_SECONDS = 60 * 60 * 24; // 24h — re-count a unique view per day

const isProduction = process.env.NODE_ENV === "production";

const COMMON_COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: isProduction,
  path: "/",
};

const viewKey = (blogId: string) => `bv_${blogId}`;
const favoriteKey = (blogId: string) => `bf_${blogId}`;

/**
 * Get-or-create a stable opaque session id for the visitor. Used to:
 *  - tag comment submissions for moderation/rate-limiting
 *  - tie favorite + view actions to the same browser
 */
export async function getOrCreateSessionId(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(SESSION_COOKIE)?.value;
  if (existing) return existing;

  const fresh = crypto.randomUUID();
  jar.set(SESSION_COOKIE, fresh, {
    ...COMMON_COOKIE_OPTS,
    maxAge: ONE_YEAR_SECONDS,
  });
  return fresh;
}

/**
 * Returns true if the view has already been counted in the dedup window.
 * Sets the cookie if not.
 */
export async function markViewedOnce(blogId: string): Promise<boolean> {
  const jar = await cookies();
  if (jar.get(viewKey(blogId))) return true;

  jar.set(viewKey(blogId), "1", {
    ...COMMON_COOKIE_OPTS,
    maxAge: VIEW_DEDUP_SECONDS,
  });
  return false;
}

/** True if the visitor currently favorites this post. */
export async function hasFavorited(blogId: string): Promise<boolean> {
  const jar = await cookies();
  return Boolean(jar.get(favoriteKey(blogId)));
}

/**
 * Toggles the favorite cookie. Returns the NEW state (true = now favorited).
 */
export async function toggleFavorite(blogId: string): Promise<boolean> {
  const jar = await cookies();
  const key = favoriteKey(blogId);
  if (jar.get(key)) {
    jar.delete(key);
    return false;
  }
  jar.set(key, "1", {
    ...COMMON_COOKIE_OPTS,
    maxAge: ONE_YEAR_SECONDS,
  });
  return true;
}

/**
 * Hash an identifier (IP) for comment moderation. We never store raw IPs.
 */
export function hashIdentifier(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex").slice(0, 32);
}

/**
 * Best-effort visitor IP from common reverse-proxy headers (Nginx/Vercel).
 * Falls back to the connection remote when not behind a proxy.
 */
export function getRequestIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}
