-- Migration: scope blog_post_likes by user_id so each visitor can like exactly once.
-- Run once in the Supabase SQL editor.

alter table public.blog_post_likes
  add column if not exists user_id text;

create index if not exists blog_post_likes_user_id_idx
  on public.blog_post_likes (user_id);

create unique index if not exists blog_post_likes_blog_user_unique
  on public.blog_post_likes (blog_id, user_id)
  where user_id is not null;
