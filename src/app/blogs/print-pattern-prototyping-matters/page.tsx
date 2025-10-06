import PrintPatternBlogClient from './PrintPatternBlogClient';
import { getBlogLikeCount, getComments } from '@/lib/blogApi';

export default async function PrintPatternBlogPage() {
  const [likeCount, comments] = await Promise.all([
    getBlogLikeCount('print-pattern-prototyping-matters'),
    getComments('print-pattern-prototyping-matters'),
  ]);
  return <PrintPatternBlogClient initialLikeCount={likeCount} initialComments={comments} />;
}
