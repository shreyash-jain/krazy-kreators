import SupplyChainBlogClient from './SupplyChainBlogClient';
import { getBlogLikeCount, getComments } from '@/lib/blogApi';

export default async function SupplyChainBlogPage() {
  const [likeCount, comments] = await Promise.all([
    getBlogLikeCount('why-best-fashion-brands-work-with-dedicated-supply-chain-partners'),
    getComments('why-best-fashion-brands-work-with-dedicated-supply-chain-partners'),
  ]);
  return <SupplyChainBlogClient initialLikeCount={likeCount} initialComments={comments} />;
}
