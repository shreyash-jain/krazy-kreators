import ExportingIndiaBlogClient from './ExportingIndiaBlogClient';
import { getBlogLikeCount, getComments } from '@/lib/blogApi';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function ExportingIndiaBlogPage() {
  const headersList = await headers();
  const host = headersList.get('x-forwarded-host') ?? headersList.get('host');
  const proto = headersList.get('x-forwarded-proto') ?? 'https';
  const baseUrl = host ? `${proto}://${host}` : undefined;

  const [likeCount, comments] = await Promise.all([
    getBlogLikeCount('exporting-apparel-from-india-checklist-first-time-buyers', { baseUrl }),
    getComments('exporting-apparel-from-india-checklist-first-time-buyers', { baseUrl }),
  ]);
  return <ExportingIndiaBlogClient initialLikeCount={likeCount} initialComments={comments} />;
}
