import CreativeCollaborationBlogClient from './CreativeCollaborationBlogClient';
import { getBlogLikeCount, getComments } from '@/lib/blogApi';

export default async function CreativeCollaborationBlogPage() {
  const [likeCount, comments] = await Promise.all([
    getBlogLikeCount('how-creative-collaboration-fuels-great-fashion-collections'),
    getComments('how-creative-collaboration-fuels-great-fashion-collections'),
  ]);
  return <CreativeCollaborationBlogClient initialLikeCount={likeCount} initialComments={comments} />;
}
