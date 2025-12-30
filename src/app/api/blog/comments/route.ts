export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabaseClient";

export async function GET(request: Request) {
  const supabase = getSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const { searchParams } = new URL(request.url);
  const blogId = searchParams.get("blogId");
  if (!blogId) return NextResponse.json({ error: "Missing blogId" }, { status: 400 });

  const { data: comments, error: commentsError } = await supabase
    .from("blog_comments")
    .select("id, created_at, blog_id, name, email, comment")
    .eq("blog_id", blogId)
    .order("created_at", { ascending: false });
  if (commentsError) return NextResponse.json({ error: commentsError.message }, { status: 500 });

  const commentIds = (comments ?? []).map((c: { id: string }) => c.id);
  if (commentIds.length === 0) return NextResponse.json({ comments: [] });

  const { data: likeCounts, error: likesError } = await supabase
    .from("blog_comment_likes")
    .select("comment_id")
    .in("comment_id", commentIds);
  if (likesError) return NextResponse.json({ error: likesError.message }, { status: 500 });

  const counts = new Map<string, number>();
  for (const row of likeCounts ?? []) {
    counts.set(row.comment_id as string, (counts.get(row.comment_id as string) ?? 0) + 1);
  }

  const payload = (comments ?? []).map((c: Record<string, unknown> & { id: string }) => ({
    ...c,
    likes: counts.get(c.id) ?? 0,
  }));

  return NextResponse.json({ comments: payload });
}

export async function POST(request: Request) {
  const supabase = getSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  try {
    const body = (await request.json()) as { blogId?: string; name?: string; email?: string; comment?: string };
    const { blogId, name, email, comment } = body;
    if (!blogId || !name || !email || !comment) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const { data, error } = await supabase
      .from("blog_comments")
      .insert([{ blog_id: blogId, name, email, comment }])
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ comment: { ...data, likes: 0 } });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const supabase = getSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("commentId");
    if (!commentId) {
      return NextResponse.json({ error: "Missing commentId" }, { status: 400 });
    }
    
    // First delete comment likes associated with this comment
    const { error: likesError } = await supabase
      .from("blog_comment_likes")
      .delete()
      .eq("comment_id", commentId);
    
    if (likesError) {
      console.warn("Error deleting comment likes:", likesError);
      // Continue with comment deletion even if likes deletion fails
    }
    
    // Then delete the comment
    const { error } = await supabase
      .from("blog_comments")
      .delete()
      .eq("id", commentId);
    
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


