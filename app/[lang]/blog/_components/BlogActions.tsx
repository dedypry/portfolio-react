"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Heart, Loader2, Share2 } from "lucide-react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";

import type { Language } from "@/i18n/config";

interface BlogActionsProps {
  slug: string;
  title: string;
  url: string;
  initialFavoriteCount: number;
  initialIsFavorited: boolean;
  initialShareCount: number;
  lang: Language;
}

const LABELS = {
  en: {
    favorite: "Favorite",
    favorited: "Favorited",
    share: "Share",
    shareOnTwitter: "Share on X (Twitter)",
    shareOnFacebook: "Share on Facebook",
    shareOnLinkedin: "Share on LinkedIn",
    shareOnWhatsapp: "Share on WhatsApp",
    copyLink: "Copy link",
    linkCopied: "Link copied!",
  },
  id: {
    favorite: "Favoritkan",
    favorited: "Sudah difavoritkan",
    share: "Bagikan",
    shareOnTwitter: "Bagikan ke X (Twitter)",
    shareOnFacebook: "Bagikan ke Facebook",
    shareOnLinkedin: "Bagikan ke LinkedIn",
    shareOnWhatsapp: "Bagikan ke WhatsApp",
    copyLink: "Salin tautan",
    linkCopied: "Tautan disalin!",
  },
} as const;

type ShareChannel =
  | "twitter"
  | "facebook"
  | "linkedin"
  | "whatsapp"
  | "copy"
  | "other";

/**
 * Pinned action bar shown under the article body. Owns:
 *   - Favorite toggle (cookie-tied; persists across refreshes)
 *   - Share menu with 4 channels + copy-link, each pings the share endpoint
 *
 * The displayed counts are seeded from the server so the page is correct on
 * first paint, then updated optimistically on click.
 */
export function BlogActions({
  slug,
  title,
  url,
  initialFavoriteCount,
  initialIsFavorited,
  initialShareCount,
  lang,
}: BlogActionsProps) {
  const labels = LABELS[lang];
  const [favoriteCount, setFavoriteCount] = useState(initialFavoriteCount);
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [favPending, setFavPending] = useState(false);

  const [shareCount, setShareCount] = useState(initialShareCount);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close the share menu on outside click / Esc.
  useEffect(() => {
    if (!shareOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setShareOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShareOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [shareOpen]);

  const handleFavorite = async () => {
    if (favPending) return;
    setFavPending(true);

    // Optimistic UI: flip locally then reconcile with server.
    const prevState = isFavorited;
    const prevCount = favoriteCount;
    setIsFavorited(!prevState);
    setFavoriteCount(prevCount + (prevState ? -1 : 1));

    try {
      const res = await fetch(
        `/api/blog/${encodeURIComponent(slug)}/favorite`,
        { method: "POST" }
      );
      const data = (await res.json()) as {
        favoriteCount: number;
        isFavorited: boolean;
      };
      setFavoriteCount(data.favoriteCount);
      setIsFavorited(data.isFavorited);
    } catch {
      // Roll back if the request failed.
      setIsFavorited(prevState);
      setFavoriteCount(prevCount);
    } finally {
      setFavPending(false);
    }
  };

  const recordShare = async (channel: ShareChannel) => {
    setShareCount((c) => c + 1);
    try {
      const res = await fetch(`/api/blog/${encodeURIComponent(slug)}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel }),
      });
      if (res.ok) {
        const data = (await res.json()) as { shareCount: number };
        setShareCount(data.shareCount);
      }
    } catch {
      // Best effort — counter already bumped optimistically.
    }
  };

  const openShareWindow = (target: string, channel: ShareChannel) => {
    void recordShare(channel);
    window.open(target, "_blank", "noopener,noreferrer,width=600,height=600");
    setShareOpen(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      void recordShare("copy");
    } catch {
      // Clipboard blocked — fall back to selecting in a hidden input.
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        void recordShare("copy");
      } catch {
        /* give up silently */
      } finally {
        ta.remove();
      }
    }
  };

  const text = encodeURIComponent(title);
  const u = encodeURIComponent(url);

  const channels: {
    id: ShareChannel;
    label: string;
    icon: React.ReactNode;
    href: string;
  }[] = [
    {
      id: "twitter",
      label: labels.shareOnTwitter,
      icon: <FaTwitter size={13} />,
      href: `https://twitter.com/intent/tweet?text=${text}&url=${u}`,
    },
    {
      id: "facebook",
      label: labels.shareOnFacebook,
      icon: <FaFacebookF size={12} />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    },
    {
      id: "linkedin",
      label: labels.shareOnLinkedin,
      icon: <FaLinkedinIn size={12} />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
    },
    {
      id: "whatsapp",
      label: labels.shareOnWhatsapp,
      // wa.me is more reliable than api.whatsapp.com on both mobile + desktop.
      icon: <FaWhatsapp size={13} />,
      href: `https://wa.me/?text=${text}%20${u}`,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-ink-900/40 px-4 py-3">
      <button
        type="button"
        onClick={handleFavorite}
        disabled={favPending}
        aria-pressed={isFavorited}
        className={[
          "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition disabled:opacity-60",
          isFavorited
            ? "border-rose-400/60 bg-rose-500/15 text-rose-200 hover:bg-rose-500/25"
            : "border-white/15 bg-white/5 text-white/80 hover:border-rose-400/40 hover:text-rose-200",
        ].join(" ")}
      >
        {favPending ? (
          <Loader2 size={14} className="animate-spin" aria-hidden />
        ) : (
          <Heart
            size={14}
            className={isFavorited ? "fill-current" : ""}
            aria-hidden
          />
        )}
        <span>{isFavorited ? labels.favorited : labels.favorite}</span>
        <span className="rounded-full bg-black/30 px-1.5 py-0.5 text-[11px] tabular-nums">
          {favoriteCount}
        </span>
      </button>

      <div ref={menuRef} className="relative">
        <button
          type="button"
          onClick={() => setShareOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={shareOpen}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-medium text-white/80 transition hover:border-accent-soft/40 hover:text-white"
        >
          <Share2 size={14} aria-hidden />
          <span>{labels.share}</span>
          <span className="rounded-full bg-black/30 px-1.5 py-0.5 text-[11px] tabular-nums">
            {shareCount}
          </span>
        </button>

        {shareOpen && (
          <div
            role="menu"
            className="absolute left-0 top-full z-30 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-ink-900/95 p-1 shadow-xl backdrop-blur"
          >
            {channels.map((c) => (
              <button
                key={c.id}
                type="button"
                role="menuitem"
                onClick={() => openShareWindow(c.href, c.id)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-white/85 transition hover:bg-white/5"
              >
                <span className="text-white/60">{c.icon}</span>
                <span>{c.label}</span>
              </button>
            ))}
            <div className="my-1 h-px bg-white/10" />
            <button
              type="button"
              role="menuitem"
              onClick={handleCopyLink}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-white/85 transition hover:bg-white/5"
            >
              <span className="text-white/60">
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </span>
              <span>{copied ? labels.linkCopied : labels.copyLink}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

