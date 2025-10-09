export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { checkSupabaseConfig } from "@/lib/envCheck";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get("blogId");
    if (!blogId) {
      console.error("Blog likes API: Missing blogId parameter");
      return NextResponse.json({ error: "Missing blogId" }, { status: 400 });
    }
    
    // Check environment configuration
    const envCheck = checkSupabaseConfig();
    console.log("Blog likes API: Environment check:", envCheck);
    
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error("Blog likes API: Supabase client not configured");
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }

    console.log(`Blog likes API: Fetching likes for blogId: ${blogId}`);
    
    const { count, error } = await supabase
      .from("blog_post_likes")
      .select("id", { count: "exact", head: true })
      .eq("blog_id", blogId);

    if (error) {
      console.error("Blog likes API: Database error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`Blog likes API: Found ${count ?? 0} likes for blogId: ${blogId}`);
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
      console.error("Blog likes API POST: Supabase client not configured");
      return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
    }
    
    const body = (await request.json()) as { blogId?: string; action?: 'like' | 'unlike' };
    const blogId = body.blogId;
    if (!blogId) {
      console.error("Blog likes API POST: Missing blogId in request body");
      return NextResponse.json({ error: "Missing blogId" }, { status: 400 });
    }
    const action = body.action ?? 'like';

    console.log(`Blog likes API POST: ${action} for blogId: ${blogId}`);

    if (action === 'unlike') {
      // Remove a single like row for this blog (best-effort decrement by 1)
      const { data: rows, error: selectError } = await supabase
        .from("blog_post_likes")
        .select("id")
        .eq("blog_id", blogId)
        .order('created_at', { ascending: false })
        .limit(1);
      if (selectError) {
        console.error("Blog likes API POST: Error selecting like to remove:", selectError);
        return NextResponse.json({ error: selectError.message }, { status: 500 });
      }
      if (rows && rows.length > 0) {
        const { error: deleteError } = await supabase
          .from("blog_post_likes")
          .delete()
          .eq("id", rows[0].id);
        if (deleteError) {
          console.error("Blog likes API POST: Error deleting like:", deleteError);
          return NextResponse.json({ error: deleteError.message }, { status: 500 });
        }
      }
    } else {
      const { error: insertError } = await supabase
        .from("blog_post_likes")
        .insert([{ blog_id: blogId }]);
      if (insertError) {
        console.error("Blog likes API POST: Error inserting like:", insertError);
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
    }

    const { count } = await supabase
      .from("blog_post_likes")
      .select("id", { count: "exact", head: true })
      .eq("blog_id", blogId);
    
    console.log(`Blog likes API POST: Updated count for blogId ${blogId}: ${count ?? 0}`);
    return NextResponse.json({ count: count ?? 0 });
  } catch (err) {
    console.error("Blog likes API POST: Unexpected error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


