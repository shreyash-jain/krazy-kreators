import MOQBlogClient from './MOQBlogClient';
import { getBlogLikeCount, getComments } from '@/lib/blogApi';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function MOQBlogPage() {
  const headersList = await headers();
  const host = headersList.get('x-forwarded-host') ?? headersList.get('host');
  const proto = headersList.get('x-forwarded-proto') ?? 'https';
  const baseUrl = host ? `${proto}://${host}` : undefined;

  const [likeCount, comments] = await Promise.all([
    getBlogLikeCount('moq-worries-krazy-kreators-supports-small-brands-flexible-quantities', { baseUrl }),
    getComments('moq-worries-krazy-kreators-supports-small-brands-flexible-quantities', { baseUrl }),
  ]);
  return <MOQBlogClient initialLikeCount={likeCount} initialComments={comments} />;
}
