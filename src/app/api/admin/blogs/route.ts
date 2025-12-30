import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabaseClient";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return NextResponse.json({ blogs: [] });
    // Try to select content_json first (draft_content_json is known to be missing in some envs)
    const { data, error } = await supabase
      .from("blogs")
      .select("id, created_at, title, slug, category, excerpt, author, image, published_at, content_json")
      .order("created_at", { ascending: false })
      .limit(500);
      
    if (error) {
      // Fallback for instances where content_json column hasn't been added yet or other schema mismatch
      console.log('[admin/blogs] GET error selecting content_json:', error.message);
      const retry = await supabase
        .from("blogs")
        .select("id, created_at, title, slug, category, excerpt, author, image, published_at")
        .order("created_at", { ascending: false })
        .limit(500);
      if (retry.error) {
        console.error('[admin/blogs] GET fatal error', retry.error.message);
        return NextResponse.json({ blogs: [] });
      }
      // Return with null content
      const withNullContent = (retry.data ?? []).map((b: Record<string, unknown>) => ({ 
        ...b, 
        content_json: null,
        draft_content_json: null,
        updated_at: b.created_at || null 
      }));
      return NextResponse.json({ blogs: withNullContent });
    }
    
    // Map data to include standard fields
    const mappedData = (data ?? []).map((b: any) => ({
      ...b,
      updated_at: b.created_at || null,
      draft_content_json: null // Since we didn't select it (it doesn't exist)
    }));
    return NextResponse.json({ blogs: mappedData });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error('[admin/blogs] GET unexpected', message);
    return NextResponse.json({ blogs: [] });
  }
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const supabase = getSupabaseClient();
    if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    
    const baseInsert: Record<string, unknown> = {
      title: String(payload.title ?? '').trim(),
      slug: String(payload.slug ?? '').trim(),
      category: payload.category ?? null,
      excerpt: payload.excerpt ?? null,
      author: payload.author ?? null,
      image: payload.image ?? null,
      published_at: payload.published_at ?? null,
    };
    
    // Attempt to save content_json if provided
    // We avoid draft_content_json as we know it's missing
    const contentToSave = payload.content_json || payload.draft_content_json;
    const withContent = contentToSave !== undefined
      ? { ...baseInsert, content_json: contentToSave }
      : baseInsert;

    // Try insert with content_json
    const { data, error } = await supabase
      .from("blogs")
      .insert(withContent)
      .select("id, created_at, title, slug, category, excerpt, author, image, published_at, content_json")
      .single();
      
    if (error) {
      console.log('[admin/blogs] POST error inserting with content:', error.message);
      // Fallback: insert without content
      const retry = await supabase
        .from("blogs")
        .insert(baseInsert)
        .select("id, created_at, title, slug, category, excerpt, author, image, published_at")
        .single();
        
      if (retry.error) return NextResponse.json({ error: retry.error.message }, { status: 400 });
      
      return NextResponse.json({ 
        blog: { 
          ...retry.data, 
          content_json: null,
          draft_content_json: null,
          updated_at: retry.data?.created_at || null
        } 
      });
    }
    
    return NextResponse.json({ 
      blog: {
        ...data,
        updated_at: data.created_at || null,
        draft_content_json: null
      }
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const payload = await req.json();
    const id = String(payload.id ?? '').trim();
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const supabase = getSupabaseClient();
    if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    
    const baseUpdates: Record<string, unknown> = {};
    for (const key of ["title", "slug", "category", "excerpt", "author", "image", "published_at"]) {
      if (payload[key] !== undefined) baseUpdates[key] = payload[key];
    }
    
    const contentToSave = payload.content_json || payload.draft_content_json;
    const withContent = contentToSave !== undefined
      ? { ...baseUpdates, content_json: contentToSave }
      : baseUpdates;

    // Try update with content_json
    const { data, error } = await supabase
      .from("blogs")
      .update(withContent)
      .eq("id", id)
      .select("id, created_at, title, slug, category, excerpt, author, image, published_at, content_json")
      .single();
      
    if (error) {
      console.log('[admin/blogs] PATCH error updating content:', error.message);
      // Fallback: update without content
      const retry = await supabase
        .from("blogs")
        .update(baseUpdates)
        .eq("id", id)
        .select("id, created_at, title, slug, category, excerpt, author, image, published_at")
        .single();
        
      if (retry.error) return NextResponse.json({ error: retry.error.message }, { status: 400 });
      
      return NextResponse.json({ 
        blog: { 
          ...retry.data, 
          content_json: null,
          draft_content_json: null,
          updated_at: retry.data?.created_at || null
        } 
      });
    }
    
    return NextResponse.json({ 
      blog: {
        ...data,
        updated_at: data.created_at || null,
        draft_content_json: null
      }
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const supabase = getSupabaseClient();
    if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    const { error } = await supabase.from("blogs").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
