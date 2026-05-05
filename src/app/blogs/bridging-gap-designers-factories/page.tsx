import BridgingGapBlogClient from './BridgingGapBlogClient';
import { getBlogLikeCount, getComments } from '@/lib/blogApi';
import { headers } from 'next/headers';
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function BridgingGapBlogPage() {
  const headersList = await headers();
  const host = headersList.get('x-forwarded-host') ?? headersList.get('host');
  const proto = headersList.get('x-forwarded-proto') ?? 'https';
  const baseUrl = host ? `${proto}://${host}` : undefined;

  const [likeCount, comments] = await Promise.all([
    getBlogLikeCount('bridging-gap-designers-factories', { baseUrl }),
    getComments('bridging-gap-designers-factories', { baseUrl }),
  ]);
  return (
        <>
            <BlogViewTracker slug="bridging-gap-designers-factories" />
            <BridgingGapBlogClient initialLikeCount={likeCount} initialComments={comments} />
        </>
    );
}
