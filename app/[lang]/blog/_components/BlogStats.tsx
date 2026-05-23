import { Eye, Heart, MessageCircle, Share2 } from "lucide-react";

import type { Language } from "@/i18n/config";
import type { BlogStats as Stats } from "@/lib/queries";

interface Props extends Stats {
  lang: Language;
  /** Render as a compact pill row (used on the listing) or a roomy strip. */
  variant?: "compact" | "expanded";
}

const LABELS = {
  en: {
    views: "views",
    favorites: "favorites",
    comments: "comments",
    shares: "shares",
  },
  id: {
    views: "dilihat",
    favorites: "favorit",
    comments: "komentar",
    shares: "dibagikan",
  },
} as const;

/**
 * Format integers compactly: 1234 → "1.2K", 1500000 → "1.5M".
 * Falls back to the plain number for < 1000.
 */
function formatCount(n: number): string {
  if (n < 1_000) return String(n);
  if (n < 1_000_000) return `${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}K`;
  return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
}

/**
 * Read-only counter strip for blog views / favorites / comments / shares.
 * Lives on the server side of the page (counts are pre-fetched), so first
 * paint is correct without any JS.
 */
export function BlogStats({
  viewCount,
  favoriteCount,
  shareCount,
  commentCount,
  lang,
  variant = "expanded",
}: Props) {
  const labels = LABELS[lang];
  const compact = variant === "compact";

  const items = [
    { icon: Eye, value: viewCount, label: labels.views },
    { icon: Heart, value: favoriteCount, label: labels.favorites },
    { icon: MessageCircle, value: commentCount, label: labels.comments },
    { icon: Share2, value: shareCount, label: labels.shares },
  ];

  return (
    <div
      className={
        compact
          ? "flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/55"
          : "flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/65"
      }
    >
      {items.map(({ icon: Icon, value, label }) => (
        <span
          key={label}
          className="inline-flex items-center gap-1.5"
          title={`${value} ${label}`}
        >
          <Icon
            size={compact ? 12 : 14}
            className="text-white/45"
            aria-hidden
          />
          <span className="tabular-nums font-medium text-white/85">
            {formatCount(value)}
          </span>
          {!compact && <span className="text-white/45">{label}</span>}
        </span>
      ))}
    </div>
  );
}
