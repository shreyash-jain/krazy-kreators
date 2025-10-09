import BridgingGapBlogClient from './BridgingGapBlogClient';
import { getBlogLikeCount, getComments } from '@/lib/blogApi';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function BridgingGapBlogPage() {
  const headersList = await headers();
  const host = headersList.get('x-forwarded-host') ?? headersList.get('host');
  const proto = headersList.get('x-forwarded-proto') ?? 'https';
  const baseUrl = host ? `${proto}://${host}` : undefined;

  const [likeCount, comments] = await Promise.all([
    getBlogLikeCount('bridging-gap-designers-factories', { baseUrl }),
    getComments('bridging-gap-designers-factories', { baseUrl }),
  ]);
  return <BridgingGapBlogClient initialLikeCount={likeCount} initialComments={comments} />;
}
