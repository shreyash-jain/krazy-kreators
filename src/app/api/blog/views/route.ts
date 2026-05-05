export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get("blogId");
    if (!blogId) {
      return NextResponse.json({ error: "Missing blogId" }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    const { count, error } = await supabase
      .from("blog_post_views")
      .select("id", { count: "exact", head: true })
      .eq("blog_id", blogId);

    if (error) {
      console.error("Blog views API: Database error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ count: count ?? 0 });
  } catch (err) {
    console.error("Blog views API: Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    const body = (await request.json()) as { blogId?: string };
    const blogId = body.blogId;
    if (!blogId) {
      return NextResponse.json({ error: "Missing blogId" }, { status: 400 });
    }

    const { error: insertError } = await supabase
      .from("blog_post_views")
      .insert([{ blog_id: blogId }]);
    if (insertError) {
      console.error("Blog views API POST: Insert error:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    const { count } = await supabase
      .from("blog_post_views")
      .select("id", { count: "exact", head: true })
      .eq("blog_id", blogId);

    return NextResponse.json({ count: count ?? 0 });
  } catch (err) {
    console.error("Blog views API POST: Unexpected error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
