import DropCultureClient from "@/app/blogs/the-drop-culture-model/DropCultureClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";

export const metadata = {
    title: "The 'Drop Culture' Model: Strategies for Sold-Out Collections | Krazy Kreators",
    description: "Learn why brands like Supreme and Corteiz use the 'Drop' model over traditional collections. Discover how low MOQ manufacturing flexibility helps execute drops without high inventory risk.",
    keywords: "drop culture, clothing drop model, streetwear marketing, limited releases, Supreme business model, Corteiz drop, low MOQ manufacturing, clothing brand inventory risk",
    openGraph: {
        title: "The 'Drop Culture' Model: Strategies for Sold-Out Collections",
        description: "How modern, hype-driven brands use limited 'Drops' to solve inventory risk and why low MOQ manufacturing is the secret sauce.",
        type: 'article',
        publishedTime: '2026-02-25',
        authors: ['Krazy Kreators Team'],
        images: [
            {
                url: '/blog/drop-culture-model-banner.png',
                width: 1400,
                height: 800,
                alt: 'Drop Culture Model - Streetwear Clothing Drops',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: "The 'Drop Culture' Model: Strategies for Sold-Out Collections",
        description: "Ditch traditional seasonal collections. Here's how to run a sold-out 'Drop' model with zero inventory risk.",
        images: ['/blog/drop-culture-model-banner.png'],
    },
};

export const runtime = 'edge';
export const dynamic = "force-dynamic";

// Define the unique blog ID
const BLOG_ID = 'the-drop-culture-model';

export default async function DropCulturePage() {
    // Fetch likes and comments in parallel
    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount(BLOG_ID),
        getComments(BLOG_ID)
    ]);

    return (
        <DropCultureClient 
            initialLikeCount={likeCount}
            initialComments={comments}
        />
    );
}
