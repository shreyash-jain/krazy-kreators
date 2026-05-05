import CreativeCollaborationBlogClient from './CreativeCollaborationBlogClient';
import { getBlogLikeCount, getComments } from '@/lib/blogApi';
import { headers } from 'next/headers';
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function CreativeCollaborationBlogPage() {
  const headersList = await headers();
  const host = headersList.get('x-forwarded-host') ?? headersList.get('host');
  const proto = headersList.get('x-forwarded-proto') ?? 'https';
  const baseUrl = host ? `${proto}://${host}` : undefined;

  const [likeCount, comments] = await Promise.all([
    getBlogLikeCount('how-creative-collaboration-fuels-great-fashion-collections', { baseUrl }),
    getComments('how-creative-collaboration-fuels-great-fashion-collections', { baseUrl }),
  ]);
  return (
        <>
            <BlogViewTracker slug="how-creative-collaboration-fuels-great-fashion-collections" />
            <CreativeCollaborationBlogClient initialLikeCount={likeCount} initialComments={comments} />
        </>
    );
}
