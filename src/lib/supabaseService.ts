import type { SupabaseClient } from '@supabase/supabase-js';

type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      contact_submissions: {
        Row: {
          id: string;
          created_at: string;
          full_name: string;
          email: string;
          phone: string;
          company: string;
          address: string | null;
          country: string;
          services: string;
          message: string | null;
          selected_plan: Json | null;
        };
      };
      leads: {
        Row: {
          id: string;
          created_at: string;
          full_name: string;
          email: string;
          phone: string;
          company: string;
          address: string | null;
          country: string;
          services: string;
          message: string | null;
          selected_plan: Json | null;
          source: string | null;
        };
      };
      blog_comments: {
        Row: {
          id: string;
          blog_id: string;
          name: string;
          email: string;
          comment: string;
          created_at: string;
        };
      };
      blog_comment_likes: {
        Row: {
          id: string;
          comment_id: string;
          created_at: string;
        };
      };
      blog_post_likes: {
        Row: {
          id: string;
          blog_id: string;
          created_at: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, Json | Json[]>;
  };
}

let cachedServiceClient: SupabaseClient<Database> | null = null;

export async function getSupabaseServiceClient(): Promise<SupabaseClient<Database>> {
  if (cachedServiceClient) return cachedServiceClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("Missing SUPABASE env for service client");
  }

  // Use dynamic import to avoid bundling in client-side code
  const { createClient } = await import("@supabase/supabase-js");
  cachedServiceClient = createClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return cachedServiceClient;
}


