import PrintPatternBlogClient from './PrintPatternBlogClient';
import { getBlogLikeCount, getComments } from '@/lib/blogApi';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function PrintPatternBlogPage() {
  const headersList = await headers();
  const host = headersList.get('x-forwarded-host') ?? headersList.get('host');
  const proto = headersList.get('x-forwarded-proto') ?? 'https';
  const baseUrl = host ? `${proto}://${host}` : undefined;

  const [likeCount, comments] = await Promise.all([
    getBlogLikeCount('print-pattern-prototyping-matters', { baseUrl }),
    getComments('print-pattern-prototyping-matters', { baseUrl }),
  ]);
  return <PrintPatternBlogClient initialLikeCount={likeCount} initialComments={comments} />;
}
