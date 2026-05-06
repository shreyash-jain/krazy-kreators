import { createClient, SupabaseClient } from "@supabase/supabase-js";

type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type TableDef<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: never[];
};

export type BlogCommentRow = {
  id: string;
  blog_id: string;
  name: string;
  email: string;
  comment: string;
  created_at: string;
};

export type BlogCommentInsert = {
  id?: string;
  blog_id: string;
  name: string;
  email: string;
  comment: string;
  created_at?: string;
};

export type BlogCommentLikeRow = {
  id: string;
  comment_id: string;
  created_at: string;
};

export type BlogCommentLikeInsert = {
  id?: string;
  comment_id: string;
  created_at?: string;
};

export type BlogPostLikeRow = {
  id: string;
  blog_id: string;
  user_id: string | null;
  created_at: string;
};

export type BlogPostLikeInsert = {
  id?: string;
  blog_id: string;
  user_id?: string | null;
  created_at?: string;
};

export type BlogPostViewRow = {
  id: string;
  blog_id: string;
  created_at: string;
};

export type BlogPostViewInsert = {
  id?: string;
  blog_id: string;
  created_at?: string;
};

export type ContactSubmissionRow = {
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

export type ContactSubmissionInsert = {
  id?: string;
  created_at?: string;
  full_name: string;
  email: string;
  phone: string;
  company: string;
  address?: string | null;
  country: string;
  services: string;
  message?: string | null;
  selected_plan?: Json | null;
};

export type LeadRow = {
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

export type LeadInsert = {
  id?: string;
  created_at?: string;
  full_name: string;
  email: string;
  phone: string;
  company: string;
  address?: string | null;
  country: string;
  services: string;
  message?: string | null;
  selected_plan?: Json | null;
  source?: string | null;
};


let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Check for both NEXT_PUBLIC_SUPABASE_ANON_KEY (for edge runtime) and SUPABASE_ANON_KEY
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  cachedClient = createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return cachedClient;
}


