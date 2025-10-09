import MoodBoardsBlogClient from "./MoodBoardsBlogClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "How We Translate Mood Boards Into Manufacturable Garments | Krazy Kreators",
  description: "Discover the intricate process of transforming creative mood boards into production-ready garments that maintain design integrity while meeting manufacturing standards.",
};

export default async function MoodBoardsBlogPage() {
  const headersList = await headers();
  const host = headersList.get('x-forwarded-host') ?? headersList.get('host');
  const proto = headersList.get('x-forwarded-proto') ?? 'https';
  const baseUrl = host ? `${proto}://${host}` : undefined;

  const [likeCount, comments] = await Promise.all([
    getBlogLikeCount("mood-boards-to-manufacturable-garments", { baseUrl }),
    getComments("mood-boards-to-manufacturable-garments", { baseUrl }),
  ]);
  return <MoodBoardsBlogClient initialLikeCount={likeCount} initialComments={comments} />;
}
