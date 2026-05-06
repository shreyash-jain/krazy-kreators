export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const slugsParam = searchParams.get("slugs") ?? "";

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const slugs = slugsParam
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (slugs.length === 0) {
      return NextResponse.json({ liked: {} });
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    const { data, error } = await supabase
      .from("blog_post_likes")
      .select("blog_id")
      .eq("user_id", userId)
      .in("blog_id", slugs);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const liked: Record<string, boolean> = {};
    for (const slug of slugs) liked[slug] = false;
    for (const row of data ?? []) {
      const id = (row as { blog_id: string }).blog_id;
      liked[id] = true;
    }

    return NextResponse.json({ liked });
  } catch (err) {
    console.error("Blog likes /me API: Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
