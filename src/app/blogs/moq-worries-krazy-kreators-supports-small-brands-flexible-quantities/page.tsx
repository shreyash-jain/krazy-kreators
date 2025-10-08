import MOQBlogClient from './MOQBlogClient';
import { getBlogLikeCount, getComments } from '@/lib/blogApi';

export default async function MOQBlogPage() {
  const [likeCount, comments] = await Promise.all([
    getBlogLikeCount('moq-worries-krazy-kreators-supports-small-brands-flexible-quantities'),
    getComments('moq-worries-krazy-kreators-supports-small-brands-flexible-quantities'),
  ]);
  return <MOQBlogClient initialLikeCount={likeCount} initialComments={comments} />;
}
