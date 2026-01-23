import FabricTrendsBlogClient from "./FabricTrendsBlogClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";

export const metadata = {
    title: "2026 Fabric Trends Update: Why Hemp and Bamboo Are Taking Over | Krazy Kreators",
    description: "Discover why hemp and bamboo are becoming the mandatory sustainable fabric choices for 2026 fashion collections. Learn about their benefits and how to source them.",
};


export const runtime = 'edge';
export const dynamic = "force-dynamic";

// Define the unique blog ID
const BLOG_ID = '2026-fabric-trends-hemp-bamboo';

export default async function FabricTrendsPage() {
    // Fetch likes and comments in parallel
    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount(BLOG_ID),
        getComments(BLOG_ID)
    ]);

    return (
        <FabricTrendsBlogClient
            initialLikeCount={likeCount}
            initialComments={comments}
        />
    );
}
