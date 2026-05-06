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

export async function getBlogViewCount(
  blogId: string,
  opts?: { baseUrl?: string }
): Promise<number> {
  try {
    const url = resolveApiUrl(
      `/api/blog/views?blogId=${encodeURIComponent(blogId)}`,
      opts?.baseUrl
    );
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return 0;
    const data = await res.json();
    return Number(data?.count ?? 0);
  } catch (error) {
    console.error(`BlogApi: Error fetching views for ${blogId}:`, error);
    return 0;
  }
}

export async function recordBlogView(blogId: string): Promise<number> {
  try {
    const url = resolveApiUrl(`/api/blog/views`);
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blogId }),
    });
    if (!res.ok) throw new Error('Failed to record view');
    const data = await res.json();
    return Number(data?.count ?? 0);
  } catch (error) {
    console.error(`BlogApi: Error recording view for ${blogId}:`, error);
    throw error;
  }
}

export type LikeBlogResult = { count: number; liked: boolean };

export async function likeBlogWithUser(
  blogId: string,
  userId: string,
  action: 'like' | 'unlike' = 'like'
): Promise<LikeBlogResult> {
  const url = resolveApiUrl(`/api/blog/likes`);
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ blogId, userId, action }),
  });
  if (!res.ok) {
    throw new Error('Failed to like blog');
  }
  const data = await res.json();
  return {
    count: Number(data?.count ?? 0),
    liked: Boolean(data?.liked),
  };
}

// Legacy entry point used by hand-coded blog client files. Auto-fetches the
// per-browser client id and returns only the count to preserve the original
// signature.
export async function likeBlog(
  blogId: string,
  action: 'like' | 'unlike' = 'like'
): Promise<number> {
  const { getOrCreateClientId } = await import('./clientId');
  const userId = getOrCreateClientId();
  if (!userId) throw new Error('Cannot generate client id');
  const result = await likeBlogWithUser(blogId, userId, action);
  return result.count;
}

export async function getBlogLikeStateForUser(
  blogId: string,
  userId: string
): Promise<{ count: number; liked: boolean }> {
  try {
    const url = resolveApiUrl(
      `/api/blog/likes?blogId=${encodeURIComponent(blogId)}&userId=${encodeURIComponent(userId)}`
    );
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return { count: 0, liked: false };
    const data = await res.json();
    return {
      count: Number(data?.count ?? 0),
      liked: Boolean(data?.liked),
    };
  } catch {
    return { count: 0, liked: false };
  }
}

export async function getMyLikedBlogs(
  userId: string,
  slugs: string[]
): Promise<Record<string, boolean>> {
  if (slugs.length === 0) return {};
  try {
    const url = resolveApiUrl(
      `/api/blog/likes/me?userId=${encodeURIComponent(userId)}&slugs=${encodeURIComponent(slugs.join(','))}`
    );
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return {};
    const data = await res.json();
    return (data?.liked ?? {}) as Record<string, boolean>;
  } catch {
    return {};
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


