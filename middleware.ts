import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_LANGUAGE,
  isLanguage,
  SUPPORTED_LANGUAGES,
  type Language,
} from "@/i18n/config";

const LOCALE_COOKIE = "dedypry.lang";
const LOCALE_HEADER = "x-locale";

/**
 * Routes that live OUTSIDE the localized `/[lang]` shell. Visited as-is.
 * Auth.js session validation for `/admin/*` happens in `app/admin/layout.tsx`
 * (server component) — middleware only takes care of routing.
 */
const NON_LOCALIZED_PREFIXES = ["/admin", "/login"];

function detectLocale(request: NextRequest): Language {
  const cookieValue = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookieValue && isLanguage(cookieValue)) return cookieValue;

  const acceptLanguage = request.headers.get("accept-language") || "";
  const ranked = acceptLanguage
    .split(",")
    .map((entry) => entry.split(";")[0].trim().toLowerCase());

  for (const tag of ranked) {
    if (tag.startsWith("id")) return "id";
    if (tag.startsWith("en")) return "en";
  }
  return DEFAULT_LANGUAGE;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Pass-through: admin/login/blog are not locale-prefixed.
  if (NON_LOCALIZED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // If the URL already starts with a supported locale, propagate it via header.
  const localeMatch = pathname.match(/^\/([a-z]{2})(\/|$)/);
  if (localeMatch && isLanguage(localeMatch[1])) {
    const response = NextResponse.next();
    response.headers.set(LOCALE_HEADER, localeMatch[1]);
    response.cookies.set(LOCALE_COOKIE, localeMatch[1], {
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      path: "/",
    });
    return response;
  }

  // Otherwise redirect to the detected locale, preserving search params.
  const detected = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${detected}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\.).*)"],
};

export const _supportedLanguages = SUPPORTED_LANGUAGES;
