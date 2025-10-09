import CreativeCollaborationBlogClient from './CreativeCollaborationBlogClient';
import { getBlogLikeCount, getComments } from '@/lib/blogApi';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function CreativeCollaborationBlogPage() {
  const headersList = await headers();
  const host = headersList.get('x-forwarded-host') ?? headersList.get('host');
  const proto = headersList.get('x-forwarded-proto') ?? 'https';
  const baseUrl = host ? `${proto}://${host}` : undefined;

  const [likeCount, comments] = await Promise.all([
    getBlogLikeCount('how-creative-collaboration-fuels-great-fashion-collections', { baseUrl }),
    getComments('how-creative-collaboration-fuels-great-fashion-collections', { baseUrl }),
  ]);
  return <CreativeCollaborationBlogClient initialLikeCount={likeCount} initialComments={comments} />;
}
