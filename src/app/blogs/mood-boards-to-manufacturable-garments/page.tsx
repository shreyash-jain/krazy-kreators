import MoodBoardsBlogClient from "./MoodBoardsBlogClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";

export const metadata = {
  title: "How We Translate Mood Boards Into Manufacturable Garments | Krazy Kreators",
  description: "Discover the intricate process of transforming creative mood boards into production-ready garments that maintain design integrity while meeting manufacturing standards.",
};

export default async function MoodBoardsBlogPage() {
  const [likeCount, comments] = await Promise.all([
    getBlogLikeCount("mood-boards-to-manufacturable-garments"),
    getComments("mood-boards-to-manufacturable-garments"),
  ]);
  return <MoodBoardsBlogClient initialLikeCount={likeCount} initialComments={comments} />;
}
