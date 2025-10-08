import ExportingIndiaBlogClient from './ExportingIndiaBlogClient';
import { getBlogLikeCount, getComments } from '@/lib/blogApi';

export default async function ExportingIndiaBlogPage() {
  const [likeCount, comments] = await Promise.all([
    getBlogLikeCount('exporting-apparel-from-india-checklist-first-time-buyers'),
    getComments('exporting-apparel-from-india-checklist-first-time-buyers'),
  ]);
  return <ExportingIndiaBlogClient initialLikeCount={likeCount} initialComments={comments} />;
}
