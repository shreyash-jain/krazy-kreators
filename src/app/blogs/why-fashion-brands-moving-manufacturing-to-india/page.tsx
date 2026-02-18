
import IndiaManufacturingClient from "@/app/blogs/why-fashion-brands-moving-manufacturing-to-india/IndiaManufacturingClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";

export const metadata = {
    title: "Why Fashion Brands Are Moving Manufacturing to India (Beyond Just Cost) | Krazy Kreators",
    description: "Discover why global fashion brands are shifting production to India. Beyond cost savings: geopolitical de-risking, vertical integration, 5,000 years of craftsmanship, and sustainability advantages.",
    keywords: "manufacturing in India, fashion manufacturing India, textile manufacturing India, garment production India, China plus one strategy, supply chain diversification, Indian textile industry, apparel sourcing India",
    openGraph: {
        title: "Why Fashion Brands Are Moving Manufacturing to India (Beyond Just Cost)",
        description: "The real reasons behind the global shift: geopolitical de-risking, unmatched craftsmanship, vertical integration, and sustainability advantages.",
        type: 'article',
        publishedTime: '2026-02-18',
        authors: ['Krazy Kreators Team'],
        images: [
            {
                url: '/blog/india-manufacturing-banner.jpg',
                width: 1400,
                height: 800,
                alt: 'Fashion manufacturing in India - supply chain strategy',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: "Why Fashion Brands Are Moving Manufacturing to India (Beyond Just Cost)",
        description: "Beyond cost: geopolitical de-risking, craftsmanship heritage, and sustainability are driving the global shift to India.",
        images: ['/blog/india-manufacturing-banner.jpg'],
    },
};

export const runtime = 'edge';
export const dynamic = "force-dynamic";

// Define the unique blog ID
const BLOG_ID = 'why-fashion-brands-moving-manufacturing-to-india';

export default async function IndiaManufacturingPage() {
    // Fetch likes and comments in parallel
    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount(BLOG_ID),
        getComments(BLOG_ID)
    ]);

    return (
        <IndiaManufacturingClient 
            initialLikeCount={likeCount}
            initialComments={comments}
        />
    );
}
