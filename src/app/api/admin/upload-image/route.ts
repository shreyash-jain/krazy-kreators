import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabaseClient";

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const slug = String(form.get("slug") || "blog");
    if (!file) return NextResponse.json({ error: "Missing file" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const path = `blogs/${slug}/${fileName}`;

    const supabase = getSupabaseClient();
    if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });

    const { data, error } = await supabase.storage.from("kk-bucket").upload(path, bytes, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const { data: publicUrlData } = supabase.storage.from("kk-bucket").getPublicUrl(path);
    const url = publicUrlData.publicUrl;
    return NextResponse.json({ url, path });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


