export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const blogId = searchParams.get("blogId");
  if (!blogId) {
    return NextResponse.json({ error: "Missing blogId" }, { status: 400 });
  }
  const supabase = getSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const { count, error } = await supabase
    .from("blog_post_likes")
    .select("id", { count: "exact", head: true })
    .eq("blog_id", blogId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Enforce per-blog baselines first (e.g., marketing wants specific non-zero numbers)
        const BASELINE_BY_BLOG_ID: Record<string, number> = {
          // Marketing baselines per blog card
          "mood-boards-to-manufacturable-garments": 93,
          "print-pattern-prototyping-matters": 84,
          "bridging-gap-designers-factories": 123,
          "why-best-fashion-brands-work-with-dedicated-supply-chain-partners": 64,
          "exporting-apparel-from-india-checklist-first-time-buyers": 87,
          "moq-worries-krazy-kreators-supports-small-brands-flexible-quantities": 98,
          "how-creative-collaboration-fuels-great-fashion-collections": 112,
        };
  const baseline = BASELINE_BY_BLOG_ID[blogId] ?? null;
  if (baseline !== null && (count ?? 0) < baseline) {
    try {
      const needed = baseline - (count ?? 0);
      if (needed > 0) {
        const rows = Array.from({ length: needed }, () => ({ blog_id: blogId }));
        const { error: seedError } = await supabase
          .from("blog_post_likes")
          .insert(rows);
        if (seedError) return NextResponse.json({ count: count ?? 0 });
      }
      const { count: newCount } = await supabase
        .from("blog_post_likes")
        .select("id", { count: "exact", head: true })
        .eq("blog_id", blogId);
      return NextResponse.json({ count: newCount ?? baseline });
    } catch {
      return NextResponse.json({ count: baseline });
    }
  }

  // Lazy seed for other blogs: if no likes exist, insert a random number once
  if ((count ?? 0) === 0) {
    try {
      const seedCount = Math.floor(Math.random() * 16) + 8; // 8..23
      const rows = Array.from({ length: seedCount }, () => ({ blog_id: blogId }));
      const { error: seedError } = await supabase
        .from("blog_post_likes")
        .insert(rows);
      if (seedError) {
        // Best-effort; fall back to returning 0 if seeding fails
        return NextResponse.json({ count: 0 });
      }
      const { count: newCount } = await supabase
        .from("blog_post_likes")
        .select("id", { count: "exact", head: true })
        .eq("blog_id", blogId);
      return NextResponse.json({ count: newCount ?? 0 });
    } catch {
      return NextResponse.json({ count: 0 });
    }
  }

  return NextResponse.json({ count: count ?? 0 });
}

export async function POST(request: Request) {
  const supabase = getSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  try {
    const body = (await request.json()) as { blogId?: string; action?: 'like' | 'unlike' };
    const blogId = body.blogId;
    if (!blogId) return NextResponse.json({ error: "Missing blogId" }, { status: 400 });
    const action = body.action ?? 'like';

    if (action === 'unlike') {
      // Remove a single like row for this blog (best-effort decrement by 1)
      const { data: rows, error: selectError } = await supabase
        .from("blog_post_likes")
        .select("id")
        .eq("blog_id", blogId)
        .order('created_at', { ascending: false })
        .limit(1);
      if (selectError) return NextResponse.json({ error: selectError.message }, { status: 500 });
      if (rows && rows.length > 0) {
        const { error: deleteError } = await supabase
          .from("blog_post_likes")
          .delete()
          .eq("id", rows[0].id);
        if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });
      }
    } else {
      const { error: insertError } = await supabase
        .from("blog_post_likes")
        .insert([{ blog_id: blogId }]);
      if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    const { count } = await supabase
      .from("blog_post_likes")
      .select("id", { count: "exact", head: true })
      .eq("blog_id", blogId);
    return NextResponse.json({ count: count ?? 0 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


