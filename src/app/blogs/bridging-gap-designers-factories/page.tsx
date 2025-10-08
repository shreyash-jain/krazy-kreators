import BridgingGapBlogClient from './BridgingGapBlogClient';
import { getBlogLikeCount, getComments } from '@/lib/blogApi';

export default async function BridgingGapBlogPage() {
  const [likeCount, comments] = await Promise.all([
    getBlogLikeCount('bridging-gap-designers-factories'),
    getComments('bridging-gap-designers-factories'),
  ]);
  return <BridgingGapBlogClient initialLikeCount={likeCount} initialComments={comments} />;
}
