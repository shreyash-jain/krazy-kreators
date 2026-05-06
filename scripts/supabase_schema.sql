-- Supabase schema for kk-landing-page
-- Run this in the Supabase SQL editor for project: https://dlarskurdadrhzfdrlgz.supabase.co
-- This file serves as documentation of the DB shape as well.

-- Required extension (usually enabled by default)
-- Uncomment if needed:
-- create extension if not exists pgcrypto;

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  phone text not null,
  company text not null,
  address text null,
  country text not null,
  services text not null,
  message text null,
  selected_plan jsonb null
);

comment on table public.contact_submissions is 'Contact form submissions captured from the marketing site.';
comment on column public.contact_submissions.full_name is 'Full name provided in contact form';
comment on column public.contact_submissions.services is 'Requested services (string)';
comment on column public.contact_submissions.selected_plan is 'Optional plan object: { name, price, type }';

-- Helpful index for querying by time
create index if not exists contact_submissions_created_at_idx on public.contact_submissions (created_at desc);

-- Row Level Security: allow anonymous inserts from the public website; restrict reads.
alter table public.contact_submissions enable row level security;

-- Allow anonymous insert (website uses anon key)
create policy if not exists contact_submissions_insert_anon
  on public.contact_submissions
  for insert
  to anon
  with check (true);

-- TEMP: Allow anonymous select for admin UI without auth (will restrict later)
create policy if not exists contact_submissions_select_anon
  on public.contact_submissions
  for select
  to anon
  using (true);

-- Optional: allow authenticated users to read their own entries if you add auth later
-- For now, do NOT grant select to anon (service role bypasses RLS for admin access)

-- Revert helper (run manually if needed)
-- drop table if exists public.contact_submissions cascade;

-- Leads table to store all incoming lead data (PII). Prefer not to expose reads to anon.
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  phone text not null,
  company text not null,
  address text null,
  country text not null,
  services text not null,
  message text null,
  selected_plan jsonb null,
  source text null
);

comment on table public.leads is 'Marketing leads captured from contact/lead forms on the site.';

create index if not exists leads_created_at_idx on public.leads (created_at desc);

alter table public.leads enable row level security;

-- Allow anonymous inserts from the website; do not allow anon selects/updates/deletes
create policy if not exists leads_insert_anon
  on public.leads
  for insert
  to anon
  with check (true);

-- TEMP: Allow anonymous select for admin UI without auth (will restrict later)
create policy if not exists leads_select_anon
  on public.leads
  for select
  to anon
  using (true);

-- Blog post views: one row per recorded view (deduped per session client-side)
create table if not exists public.blog_post_views (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  blog_id text not null
);

create index if not exists blog_post_views_blog_id_idx on public.blog_post_views (blog_id);

alter table public.blog_post_views enable row level security;
create policy if not exists blog_post_views_insert_anon
  on public.blog_post_views
  for insert
  to anon
  with check (true);
create policy if not exists blog_post_views_select_anon
  on public.blog_post_views
  for select
  to anon
  using (true);

-- Blog interactions: likes per post and comments with likes on comments
-- user_id is a stable per-browser UUID stored in localStorage; lets us scope
-- each like to a specific visitor so unlike removes the right row and a
-- visitor can only like once per post.
create table if not exists public.blog_post_likes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  blog_id text not null,
  user_id text
);

create index if not exists blog_post_likes_blog_id_idx on public.blog_post_likes (blog_id);
create index if not exists blog_post_likes_user_id_idx on public.blog_post_likes (user_id);
create unique index if not exists blog_post_likes_blog_user_unique
  on public.blog_post_likes (blog_id, user_id)
  where user_id is not null;

alter table public.blog_post_likes enable row level security;
create policy if not exists blog_post_likes_insert_anon
  on public.blog_post_likes
  for insert
  to anon
  with check (true);
create policy if not exists blog_post_likes_select_anon
  on public.blog_post_likes
  for select
  to anon
  using (true);

create table if not exists public.blog_comments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  blog_id text not null,
  name text not null,
  email text not null,
  comment text not null
);

create index if not exists blog_comments_blog_id_created_at_idx on public.blog_comments (blog_id, created_at desc);

alter table public.blog_comments enable row level security;
create policy if not exists blog_comments_insert_anon
  on public.blog_comments
  for insert
  to anon
  with check (true);
create policy if not exists blog_comments_select_anon
  on public.blog_comments
  for select
  to anon
  using (true);

create table if not exists public.blog_comment_likes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  comment_id uuid not null references public.blog_comments(id) on delete cascade
);

create index if not exists blog_comment_likes_comment_id_idx on public.blog_comment_likes (comment_id);

alter table public.blog_comment_likes enable row level security;
create policy if not exists blog_comment_likes_insert_anon
  on public.blog_comment_likes
  for insert
  to anon
  with check (true);
create policy if not exists blog_comment_likes_select_anon
  on public.blog_comment_likes
  for select
  to anon
  using (true);

-- Blog content table (admin managed)
create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  slug text not null unique,
  category text null,
  excerpt text null,
  author text null,
  image text null,
  published_at timestamptz null,
  content_md text null,
  content_json jsonb null
);

comment on table public.blogs is 'Admin-managed blog posts.';
create index if not exists blogs_created_at_idx on public.blogs (created_at desc);
alter table public.blogs enable row level security;
-- No anon write access; reads can be allowed later via API
-- TEMP: Allow full anon CRUD for admin UI without auth (will restrict later)
create policy if not exists blogs_select_anon
  on public.blogs
  for select
  to anon
  using (true);

create policy if not exists blogs_insert_anon
  on public.blogs
  for insert
  to anon
  with check (true);

create policy if not exists blogs_update_anon
  on public.blogs
  for update
  to anon
  using (true)
  with check (true);

create policy if not exists blogs_delete_anon
  on public.blogs
  for delete
  to anon
  using (true);

-- STORAGE: Ensure public bucket exists and allow anon read/insert for kk-bucket
insert into storage.buckets (id, name, public)
  values ('kk-bucket', 'kk-bucket', true)
  on conflict (id) do nothing;

-- Allow public read of objects in kk-bucket
create policy if not exists storage_kk_public_read
  on storage.objects
  for select
  to anon
  using (bucket_id = 'kk-bucket');

-- Allow anonymous inserts to kk-bucket (temporary until admin auth is added)
create policy if not exists storage_kk_insert_anon
  on storage.objects
  for insert
  to anon
  with check (bucket_id = 'kk-bucket');


