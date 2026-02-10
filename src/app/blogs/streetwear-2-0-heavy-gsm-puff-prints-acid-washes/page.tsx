
import StreetwearClient from "@/app/blogs/streetwear-2-0-heavy-gsm-puff-prints-acid-washes/StreetwearClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";

export const metadata = {
    title: "Streetwear 2.0: Heavy GSM, Puff Prints, and Acid Washes | Krazy Kreators",
    description: "Discover the latest streetwear trends: Heavyweight 240+ GSM tees, Puff Printing, and Vintage Acid Washes. Learn the technical execution behind these aesthetics.",
    openGraph: {
        title: "Streetwear 2.0: Heavy GSM, Puff Prints, and Acid Washes",
        description: "Streetwear is evolving. Learn how to manufacture the latest trends: heavy GSM fabrics, puff prints, and acid washes.",
        type: 'article',
        publishedTime: '2026-02-09',
        authors: ['Krazy Kreators Team'],
        images: [
            {
                url: '/blog/streetwear-2-0-banner.png',
                width: 1200,
                height: 630,
                alt: 'Streetwear 2.0 Trends',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: "Streetwear 2.0: Heavy GSM, Puff Prints, and Acid Washes",
        description: "The technical guide to manufacturing current streetwear trends.",
        images: ['/blog/streetwear-2-0-banner.png'],
    },
};

export const runtime = 'edge';
export const dynamic = "force-dynamic";

// Define the unique blog ID
const BLOG_ID = 'streetwear-2-0-heavy-gsm-puff-prints-acid-washes';

export default async function StreetwearPage() {
    // Fetch likes and comments in parallel
    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount(BLOG_ID),
        getComments(BLOG_ID)
    ]);

    return (
        <StreetwearClient 
            initialLikeCount={likeCount}
            initialComments={comments}
        />
    );
}
