-- Migration: scope blog_post_likes by user_id so each visitor can like exactly once.
-- Run once in the Supabase SQL editor.

alter table public.blog_post_likes
  add column if not exists user_id text;

create index if not exists blog_post_likes_user_id_idx
  on public.blog_post_likes (user_id);

create unique index if not exists blog_post_likes_blog_user_unique
  on public.blog_post_likes (blog_id, user_id)
  where user_id is not null;

-- Allow anon delete so unlike can remove the visitor's own row. Without this
-- policy the DELETE is silently blocked by RLS and the like count never
-- decreases when a user unlikes. (CREATE POLICY doesn't support IF NOT EXISTS
-- on Postgres < 17, so we drop-then-create.)
drop policy if exists blog_post_likes_delete_anon on public.blog_post_likes;
create policy blog_post_likes_delete_anon
  on public.blog_post_likes
  for delete
  to anon
  using (true);
