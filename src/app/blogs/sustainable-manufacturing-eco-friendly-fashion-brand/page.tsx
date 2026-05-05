import SustainableManufacturingClient from "@/app/blogs/sustainable-manufacturing-eco-friendly-fashion-brand/SustainableManufacturingClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import BlogViewTracker from "@/components/BlogViewTracker";

export const metadata = {
    title: "Sustainable Manufacturing: How to Build an Eco-Friendly Fashion Brand | Krazy Kreators",
    description: "Discover how to build a truly sustainable clothing brand. From organic cotton and recycled polyester to ethical labor practices and waste minimization — the complete guide to eco-friendly fashion production.",
    openGraph: {
        title: "Sustainable Manufacturing: How to Build an Eco-Friendly Fashion Brand",
        description: "A complete guide for modern conscious brands: sustainable fabrics, ethical supply chains, and greener manufacturing strategies that drive profitability.",
        type: 'article',
        publishedTime: '2026-03-20',
        authors: ['Krazy Kreators Team'],
        images: [
            {
                url: '/blog/sustainable-manufacturing-banner.png',
                width: 1200,
                height: 630,
                alt: 'Sustainable Fashion Manufacturing',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: "Sustainable Manufacturing: How to Build an Eco-Friendly Fashion Brand",
        description: "Organic cotton, recycled poly, ethical labor, zero waste — the modern guide to green fashion production.",
        images: ['/blog/sustainable-manufacturing-banner.png'],
    },
};

export const runtime = 'edge';
export const dynamic = "force-dynamic";

// Define the unique blog ID
const BLOG_ID = 'sustainable-manufacturing-eco-friendly-fashion-brand';

export default async function SustainableManufacturingPage() {
    // Fetch likes and comments in parallel
    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount(BLOG_ID),
        getComments(BLOG_ID)
    ]);

    return (
        <>
            <BlogViewTracker slug="sustainable-manufacturing-eco-friendly-fashion-brand" />
            <SustainableManufacturingClient initialLikeCount={likeCount} initialComments={comments} />
        </>
    );
}
