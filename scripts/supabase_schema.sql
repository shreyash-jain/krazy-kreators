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

-- Blog interactions: likes per post and comments with likes on comments
create table if not exists public.blog_post_likes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  blog_id text not null
);

create index if not exists blog_post_likes_blog_id_idx on public.blog_post_likes (blog_id);

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



