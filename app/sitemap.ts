import type { MetadataRoute } from "next";
import { SUPPORTED_LANGUAGES } from "@/i18n/config";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dedypry.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return SUPPORTED_LANGUAGES.map((lang) => ({
    url: `${SITE_URL}/${lang}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: lang === "en" ? 1 : 0.9,
    alternates: {
      languages: {
        en: `${SITE_URL}/en`,
        id: `${SITE_URL}/id`,
      },
    },
  }));
}
