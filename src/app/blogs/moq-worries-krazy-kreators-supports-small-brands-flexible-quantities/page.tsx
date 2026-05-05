import MOQBlogClient from './MOQBlogClient';
import { getBlogLikeCount, getComments } from '@/lib/blogApi';
import { headers } from 'next/headers';
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function MOQBlogPage() {
  const headersList = await headers();
  const host = headersList.get('x-forwarded-host') ?? headersList.get('host');
  const proto = headersList.get('x-forwarded-proto') ?? 'https';
  const baseUrl = host ? `${proto}://${host}` : undefined;

  const [likeCount, comments] = await Promise.all([
    getBlogLikeCount('moq-worries-krazy-kreators-supports-small-brands-flexible-quantities', { baseUrl }),
    getComments('moq-worries-krazy-kreators-supports-small-brands-flexible-quantities', { baseUrl }),
  ]);
  return (
        <>
            <BlogViewTracker slug="moq-worries-krazy-kreators-supports-small-brands-flexible-quantities" />
            <MOQBlogClient initialLikeCount={likeCount} initialComments={comments} />
        </>
    );
}
