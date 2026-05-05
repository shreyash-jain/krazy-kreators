import MoodBoardsBlogClient from "./MoodBoardsBlogClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from 'next/headers';
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

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
  return (
        <>
            <BlogViewTracker slug="mood-boards-to-manufacturable-garments" />
            <MoodBoardsBlogClient initialLikeCount={likeCount} initialComments={comments} />
        </>
    );
}
