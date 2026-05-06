export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { checkSupabaseConfig } from "@/lib/envCheck";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get("blogId");
    const userId = searchParams.get("userId");
    if (!blogId) {
      return NextResponse.json({ error: "Missing blogId" }, { status: 400 });
    }

    const envCheck = checkSupabaseConfig();
    console.log("Blog likes API: Environment check:", envCheck);

    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    const countQuery = supabase
      .from("blog_post_likes")
      .select("id", { count: "exact", head: true })
      .eq("blog_id", blogId);

    if (userId) {
      const [{ count, error: countError }, { data: userRows, error: userError }] = await Promise.all([
        countQuery,
        supabase
          .from("blog_post_likes")
          .select("id")
          .eq("blog_id", blogId)
          .eq("user_id", userId)
          .limit(1),
      ]);

      if (countError) {
        return NextResponse.json({ error: countError.message }, { status: 500 });
      }
      if (userError) {
        return NextResponse.json({ error: userError.message }, { status: 500 });
      }

      return NextResponse.json({ count: count ?? 0, liked: (userRows?.length ?? 0) > 0 });
    }

    const { count, error } = await countQuery;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ count: count ?? 0 });
  } catch (err) {
    console.error("Blog likes API: Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    const body = (await request.json()) as { blogId?: string; userId?: string; action?: 'like' | 'unlike' };
    const blogId = body.blogId;
    const userId = body.userId;
    const action = body.action ?? 'like';

    if (!blogId) {
      return NextResponse.json({ error: "Missing blogId" }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const { data: existingRows, error: existingError } = await supabase
      .from("blog_post_likes")
      .select("id")
      .eq("blog_id", blogId)
      .eq("user_id", userId)
      .limit(1);

    if (existingError) {
      return NextResponse.json({ error: existingError.message }, { status: 500 });
    }

    const alreadyLiked = (existingRows?.length ?? 0) > 0;
    let liked = alreadyLiked;

    if (action === 'like' && !alreadyLiked) {
      const { error: insertError } = await supabase
        .from("blog_post_likes")
        .insert([{ blog_id: blogId, user_id: userId }]);
      // Treat unique-violation as a benign race (concurrent like for same user)
      if (insertError && insertError.code !== '23505') {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
      liked = true;
    } else if (action === 'unlike' && alreadyLiked) {
      const { error: deleteError } = await supabase
        .from("blog_post_likes")
        .delete()
        .eq("blog_id", blogId)
        .eq("user_id", userId);
      if (deleteError) {
        return NextResponse.json({ error: deleteError.message }, { status: 500 });
      }
      liked = false;
    }

    const { count, error: countError } = await supabase
      .from("blog_post_likes")
      .select("id", { count: "exact", head: true })
      .eq("blog_id", blogId);

    if (countError) {
      return NextResponse.json({ error: countError.message }, { status: 500 });
    }

    return NextResponse.json({ count: count ?? 0, liked });
  } catch (err) {
    console.error("Blog likes API POST: Unexpected error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
