import AntiFastFashionClient from "@/app/blogs/anti-fast-fashion-slow-brand/AntiFastFashionClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";

export const metadata = {
    title: "Anti-Fast Fashion: Building a Slow Fashion Brand | Krazy Kreators",
    description: "Learn how to build a successful slow fashion brand in the era of Shein. Discover why quality, ethics, and transparency are the future of fashion profitability.",
    openGraph: {
        title: "Anti-Fast Fashion: How to Build a 'Slow Fashion' Brand",
        description: "The consumer backlash against fast fashion is here. Learn how to position your brand for the quality-first revolution.",
        type: 'article',
        publishedTime: '2026-01-28',
        authors: ['Krazy Kreators Team'],
        images: [
            {
                url: '/blog/anti-fast-fashion-banner.png',
                width: 1200,
                height: 630,
                alt: 'Slow Fashion vs Fast Fashion Comparison',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: "Anti-Fast Fashion: How to Build a 'Slow Fashion' Brand",
        description: "Consumers are tired of disposable clothes. Here is your guide to building a brand that lasts.",
        images: ['/blog/anti-fast-fashion-banner.png'],
    },
};

export const runtime = 'edge';
export const dynamic = "force-dynamic";

// Define the unique blog ID
const BLOG_ID = 'anti-fast-fashion-slow-brand';

export default async function AntiFastFashionPage() {
    // Fetch likes and comments in parallel
    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount(BLOG_ID),
        getComments(BLOG_ID)
    ]);

    return (
        <AntiFastFashionClient
            initialLikeCount={likeCount}
            initialComments={comments}
        />
    );
}
