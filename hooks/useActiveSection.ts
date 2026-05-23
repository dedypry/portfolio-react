"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which section ID is currently in view based on scroll position.
 * Uses a manual scroll calculation (not IntersectionObserver) because we
 * want a single "active" section even when multiple are partially visible.
 */
export function useActiveSection(ids: string[], offset = 120): string {
  const [active, setActive] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    const compute = () => {
      const scrollY = window.scrollY + offset;
      let current = ids[0] ?? "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.offsetTop;
        if (scrollY >= top) current = id;
      }

      // Edge case: scrolled to the very bottom — pick the last section.
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4
      ) {
        current = ids[ids.length - 1] ?? current;
      }

      setActive(current);
    };

    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [ids, offset]);

  return active;
}
