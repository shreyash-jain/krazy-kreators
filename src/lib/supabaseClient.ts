// dynamic import at runtime to avoid lint/type resolution issues in some envs
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createClient } = require("@supabase/supabase-js");

type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

type TableDef<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: never[];
};

type BlogCommentRow = {
  id: string;
  blog_id: string;
  name: string;
  email: string;
  comment: string;
  created_at: string;
};

type BlogCommentInsert = {
  id?: string;
  blog_id: string;
  name: string;
  email: string;
  comment: string;
  created_at?: string;
};

type BlogCommentLikeRow = {
  id: string;
  comment_id: string;
  created_at: string;
};

type BlogCommentLikeInsert = {
  id?: string;
  comment_id: string;
  created_at?: string;
};

type BlogPostLikeRow = {
  id: string;
  blog_id: string;
  created_at: string;
};

type BlogPostLikeInsert = {
  id?: string;
  blog_id: string;
  created_at?: string;
};

type ContactSubmissionRow = {
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

type ContactSubmissionInsert = {
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

type LeadRow = {
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

type LeadInsert = {
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

interface Database {
  public: {
    Tables: {
      blog_comments: TableDef<BlogCommentRow, BlogCommentInsert>;
      blog_comment_likes: TableDef<BlogCommentLikeRow, BlogCommentLikeInsert>;
      blog_post_likes: TableDef<BlogPostLikeRow, BlogPostLikeInsert>;
      contact_submissions: TableDef<
        ContactSubmissionRow,
        ContactSubmissionInsert
      >;
      leads: TableDef<LeadRow, LeadInsert>;
      blogs: TableDef<
        {
          id: string;
          created_at: string;
          title: string;
          slug: string;
          category: string | null;
          excerpt: string | null;
          author: string | null;
          image: string | null;
          published_at: string | null;
          content_md: string | null;
          content_json: Json | null;
        },
        Partial<{
          id: string;
          created_at: string;
          title: string;
          slug: string;
          category: string | null;
          excerpt: string | null;
          author: string | null;
          image: string | null;
          published_at: string | null;
          content_md: string | null;
          content_json: Json | null;
        }>,
        Partial<{
          id: string;
          created_at: string;
          title: string;
          slug: string;
          category: string | null;
          excerpt: string | null;
          author: string | null;
          image: string | null;
          published_at: string | null;
          content_md: string | null;
          content_json: Json | null;
        }>
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, Json | Json[]>;
  };
}

let cachedClient: any | null = null;

export function getSupabaseClient(): any | null {
  if (cachedClient) return cachedClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;

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


