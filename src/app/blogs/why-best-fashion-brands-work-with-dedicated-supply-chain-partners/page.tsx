import SupplyChainBlogClient from './SupplyChainBlogClient';
import { getBlogLikeCount, getComments } from '@/lib/blogApi';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function SupplyChainBlogPage() {
  const headersList = await headers();
  const host = headersList.get('x-forwarded-host') ?? headersList.get('host');
  const proto = headersList.get('x-forwarded-proto') ?? 'https';
  const baseUrl = host ? `${proto}://${host}` : undefined;

  const [likeCount, comments] = await Promise.all([
    getBlogLikeCount('why-best-fashion-brands-work-with-dedicated-supply-chain-partners', { baseUrl }),
    getComments('why-best-fashion-brands-work-with-dedicated-supply-chain-partners', { baseUrl }),
  ]);
  return <SupplyChainBlogClient initialLikeCount={likeCount} initialComments={comments} />;
}
