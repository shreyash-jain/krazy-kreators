const resolveApiUrl = (path: string, baseOverride?: string) => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (typeof window !== 'undefined') {
    return normalized;
  }

  const baseFromEnv =
    baseOverride ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
    `http://localhost:${process.env.PORT ?? 3000}`;

  return `${baseFromEnv.replace(/\/$/, '')}${normalized}`;
};

export async function getBlogLikeCount(
  blogId: string,
  opts?: { baseUrl?: string }
): Promise<number> {
  try {
    const url = resolveApiUrl(
      `/api/blog/likes?blogId=${encodeURIComponent(blogId)}`,
      opts?.baseUrl
    );
    console.log(`BlogApi: Fetching likes for ${blogId} from ${url}`);
    
    const res = await fetch(url, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      console.error(`BlogApi: Failed to fetch likes for ${blogId}:`, res.status, res.statusText);
      return 0;
    }
    
    const data = await res.json();
    console.log(`BlogApi: Received data for ${blogId}:`, data);
    return Number(data?.count ?? 0);
  } catch (error) {
    console.error(`BlogApi: Error fetching likes for ${blogId}:`, error);
    return 0;
  }
}

export async function likeBlog(blogId: string, action: 'like' | 'unlike' = 'like'): Promise<number> {
  try {
    const url = resolveApiUrl(`/api/blog/likes`);
    console.log(`BlogApi: ${action} for ${blogId} via ${url}`);
    
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blogId, action }),
    });
    
    if (!res.ok) {
      console.error(`BlogApi: Failed to ${action} for ${blogId}:`, res.status, res.statusText);
      throw new Error('Failed to like blog');
    }
    
    const data = await res.json();
    console.log(`BlogApi: ${action} result for ${blogId}:`, data);
    return Number(data?.count ?? 0);
  } catch (error) {
    console.error(`BlogApi: Error ${action} for ${blogId}:`, error);
    throw error;
  }
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

export async function getComments(
  blogId: string,
  opts?: { baseUrl?: string }
): Promise<PublicComment[]> {
  try {
    const res = await fetch(
      resolveApiUrl(`/api/blog/comments?blogId=${encodeURIComponent(blogId)}` , opts?.baseUrl),
      {
      cache: 'no-store',
    }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data?.comments ?? []) as PublicComment[];
  } catch (error) {
    console.error(`BlogApi: Error fetching comments for ${blogId}:`, error);
    return [];
  }
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

export async function getCommentLikeCount(
  commentId: string,
  opts?: { baseUrl?: string }
): Promise<number> {
  const res = await fetch(resolveApiUrl(`/api/blog/comments/like?commentId=${encodeURIComponent(commentId)}`, opts?.baseUrl), {
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

export async function deleteComment(commentId: string): Promise<void> {
  const res = await fetch(resolveApiUrl(`/api/blog/comments?commentId=${encodeURIComponent(commentId)}`), {
    method: 'DELETE',
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.error || 'Failed to delete comment');
  }
}


