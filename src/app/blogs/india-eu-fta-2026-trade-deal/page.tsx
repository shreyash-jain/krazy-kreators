import IndiaEuTradeDealBlogClient from "./IndiaEuTradeDealBlogClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";

export const metadata = {
    title: "India-EU Trade Deal 2026: Simple Guide for Business | Krazy Kreators",
    description: "A simple guide to the 2026 India-EU Free Trade Agreement. Learn how 0% tariffs and new logistics rules benefit fashion brands and manufacturers.",
};


export const runtime = 'edge';
export const dynamic = "force-dynamic";

// Define the unique blog ID
const BLOG_ID = 'india-eu-fta-2026-trade-deal';

export default async function IndiaEuTradeDealPage() {
    // Fetch likes and comments in parallel
    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount(BLOG_ID),
        getComments(BLOG_ID)
    ]);

    return (
        <IndiaEuTradeDealBlogClient
            initialLikeCount={likeCount}
            initialComments={comments}
        />
    );
}
