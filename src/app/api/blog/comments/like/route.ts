export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  const supabase = getSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  const { searchParams } = new URL(request.url);
  const commentId = searchParams.get("commentId");
  if (!commentId) return NextResponse.json({ error: "Missing commentId" }, { status: 400 });

  const { count, error } = await supabase
    .from("blog_comment_likes")
    .select("id", { count: "exact", head: true })
    .eq("comment_id", commentId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ count: count ?? 0 });
}

export async function POST(request: Request) {
  const supabase = getSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  try {
    const body = (await request.json()) as { commentId?: string; action?: 'like' | 'unlike' };
    const { commentId, action } = body;
    if (!commentId) return NextResponse.json({ error: "Missing commentId" }, { status: 400 });

    if (action === 'unlike') {
      // Remove a single like row for this comment (best-effort decrement by 1)
      const { data: rows, error: selectError } = await supabase
        .from("blog_comment_likes")
        .select("id")
        .eq("comment_id", commentId)
        .order('created_at', { ascending: false })
        .limit(1);
      if (selectError) return NextResponse.json({ error: selectError.message }, { status: 500 });
      const normalizedRows = ((rows ?? []) as Array<{ id: string | number }>).map((row) => ({
        id: String(row.id),
      }));
      const [latest] = normalizedRows;
      if (latest?.id) {
        const { error: deleteError } = await supabase
          .from("blog_comment_likes")
          .delete()
          .eq("id", latest.id);
        if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });
      }
    } else {
      // Default to like
      const { error: insertError } = await supabase
        .from("blog_comment_likes")
        .insert([{ comment_id: commentId }]);
      if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Get updated count
    const { count } = await supabase
      .from("blog_comment_likes")
      .select("id", { count: "exact", head: true })
      .eq("comment_id", commentId);

    return NextResponse.json({ count: count ?? 0 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


