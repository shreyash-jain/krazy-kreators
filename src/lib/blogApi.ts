const resolveApiUrl = (path: string) => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (typeof window !== 'undefined') {
    return normalized;
  }

  const baseFromEnv =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
    `http://localhost:${process.env.PORT ?? 3000}`;

  return `${baseFromEnv.replace(/\/$/, '')}${normalized}`;
};

export async function getBlogLikeCount(blogId: string): Promise<number> {
  const res = await fetch(resolveApiUrl(`/api/blog/likes?blogId=${encodeURIComponent(blogId)}`), {
    cache: 'no-store',
  });
  if (!res.ok) return 0;
  const data = await res.json();
  return Number(data?.count ?? 0);
}

export async function likeBlog(blogId: string, action: 'like' | 'unlike' = 'like'): Promise<number> {
  const res = await fetch(resolveApiUrl(`/api/blog/likes`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ blogId, action }),
  });
  if (!res.ok) throw new Error('Failed to like blog');
  const data = await res.json();
  return Number(data?.count ?? 0);
}

export type PublicComment = {
  id: string;
  created_at: string;
  blog_id: string;
  name: string;
  email: string;
  comment: string;
  likes: number;
};

export async function getComments(blogId: string): Promise<PublicComment[]> {
  const res = await fetch(resolveApiUrl(`/api/blog/comments?blogId=${encodeURIComponent(blogId)}`), {
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data?.comments ?? []) as PublicComment[];
}

export async function addComment(params: { blogId: string; name: string; email: string; comment: string }): Promise<PublicComment> {
  const res = await fetch(resolveApiUrl(`/api/blog/comments`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Failed to add comment');
  const data = await res.json();
  return data?.comment as PublicComment;
}

export async function getCommentLikeCount(commentId: string): Promise<number> {
  const res = await fetch(resolveApiUrl(`/api/blog/comments/like?commentId=${encodeURIComponent(commentId)}`), {
    cache: 'no-store',
  });
  if (!res.ok) return 0;
  const data = await res.json();
  return Number(data?.count ?? 0);
}

export async function likeComment(commentId: string, action: 'like' | 'unlike' = 'like'): Promise<number> {
  const res = await fetch(resolveApiUrl(`/api/blog/comments/like`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ commentId, action }),
  });
  if (!res.ok) throw new Error('Failed to like comment');
  const data = await res.json();
  return Number(data?.count ?? 0);
}


