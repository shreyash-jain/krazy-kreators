import EcoFriendlyClient from "@/app/blogs/sustainable-manufacturing-eco-friendly-brand/EcoFriendlyClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";

export const metadata = {
    title: "Sustainable Manufacturing: Eco-Friendly Fashion Brand | Krazy Kreators",
    description: "Learn how to build a modern conscious brand by using sustainable fabrics, ensuring ethical labor, and minimizing waste for high-value clients.",
    keywords: ["sustainable clothing manufacturer", "eco-friendly fashion production", "ethical supply chain"],
    openGraph: {
        title: "Sustainable Manufacturing: How to Build an Eco-Friendly Fashion Brand",
        description: "Learn how to build a modern conscious brand by using sustainable fabrics, ensuring ethical labor, and minimizing waste for high-value clients.",
        type: 'article',
        publishedTime: '2026-03-21',
        authors: ['Krazy Kreators Team'],
        images: [
            {
                url: '/blog/eco-friendly-fashion.png',
                width: 1200,
                height: 630,
                alt: 'Eco Friendly Fashion Manufacturing',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: "Sustainable Manufacturing: Eco-Friendly Fashion Brand",
        description: "Learn how to build a modern conscious brand by using sustainable fabrics.",
        images: ['/blog/eco-friendly-fashion.png'],
    },
};

export const runtime = 'edge';
export const dynamic = "force-dynamic";

const BLOG_ID = 'sustainable-manufacturing-eco-friendly-brand';

export default async function EcoFriendlyPage() {
    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount(BLOG_ID),
        getComments(BLOG_ID)
    ]);

    return (
        <EcoFriendlyClient
            initialLikeCount={likeCount}
            initialComments={comments}
        />
    );
}
