import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabaseClient";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return NextResponse.json({ leads: [] });
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("id, created_at, full_name, email, phone, company, country, services")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    type Row = {
      id: string;
      created_at: string;
      full_name: string;
      email: string;
      phone: string;
      company: string;
      country: string;
      services: string;
    };
    const leads = (data ?? []).map((row: Row) => ({
      id: row.id,
      created_at: row.created_at,
      full_name: row.full_name,
      email: row.email,
      phone: row.phone,
      company: row.company,
      country: row.country,
      services: row.services,
      source: null as string | null,
    }));
    return NextResponse.json({ leads });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


