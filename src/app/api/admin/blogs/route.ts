import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabaseClient";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return NextResponse.json({ blogs: [] });
    const { data, error } = await supabase
      .from("blogs")
      .select("id, created_at, title, slug, category, excerpt, author, image, published_at, content_json")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) {
      // Fallback for instances where content_json column hasn't been added yet
      const retry = await supabase
        .from("blogs")
        .select("id, created_at, title, slug, category, excerpt, author, image, published_at")
        .order("created_at", { ascending: false })
        .limit(500);
      if (retry.error) {
        console.error('[admin/blogs] GET error', retry.error.message);
        return NextResponse.json({ blogs: [] });
      }
      const withNullContent = (retry.data ?? []).map((b: Record<string, unknown>) => ({ ...b, content_json: null }));
      return NextResponse.json({ blogs: withNullContent });
    }
    return NextResponse.json({ blogs: data ?? [] });
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
    const withContent = payload.content_json !== undefined
      ? { ...baseInsert, content_json: payload.content_json }
      : baseInsert;

    const { data, error } = await supabase
      .from("blogs")
      .insert(withContent)
      .select("id, created_at, title, slug, category, excerpt, author, image, published_at, content_json")
      .single();
    if (error) {
      // Fallback if content_json column doesn't exist yet
      const retry = await supabase
        .from("blogs")
        .insert(baseInsert)
        .select("id, created_at, title, slug, category, excerpt, author, image, published_at")
        .single();
      if (retry.error) return NextResponse.json({ error: retry.error.message }, { status: 400 });
      return NextResponse.json({ blog: { ...retry.data, content_json: null } });
    }
    return NextResponse.json({ blog: data });
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
    const withContent = payload.content_json !== undefined
      ? { ...baseUpdates, content_json: payload.content_json }
      : baseUpdates;

    const { data, error } = await supabase
      .from("blogs")
      .update(withContent)
      .eq("id", id)
      .select("id, created_at, title, slug, category, excerpt, author, image, published_at, content_json")
      .single();
    if (error) {
      // Fallback if content_json column doesn't exist yet
      const retry = await supabase
        .from("blogs")
        .update(baseUpdates)
        .eq("id", id)
        .select("id, created_at, title, slug, category, excerpt, author, image, published_at")
        .single();
      if (retry.error) return NextResponse.json({ error: retry.error.message }, { status: 400 });
      return NextResponse.json({ blog: { ...retry.data, content_json: null } });
    }
    return NextResponse.json({ blog: data });
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


