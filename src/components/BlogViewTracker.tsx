"use client";

import { useEffect } from "react";
import { recordBlogView } from "@/lib/blogApi";
import {
  hasViewedThisSession,
  markViewedThisSession,
  recordBlogViewUpdate,
} from "@/lib/blogViewSync";

type Props = {
  slug: string;
};

export default function BlogViewTracker({ slug }: Props) {
  useEffect(() => {
    if (!slug) return;
    if (hasViewedThisSession(slug)) return;
    markViewedThisSession(slug);

    let cancelled = false;
    (async () => {
      try {
        const count = await recordBlogView(slug);
        if (!cancelled) recordBlogViewUpdate(slug, count);
      } catch {
        // Ignore tracking errors silently
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return null;
}
