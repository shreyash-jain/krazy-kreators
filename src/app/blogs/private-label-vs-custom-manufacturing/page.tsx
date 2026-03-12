import CustomMfgClient from "@/app/blogs/private-label-vs-custom-manufacturing/CustomMfgClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";

export const metadata = {
    title: "Private Label vs. Custom Manufacturing: Which Fits Your Brand? | Krazy Kreators",
    description: "Deciding between buying generic blanks vs. creating unique designs? Learn why custom manufacturing is the ultimate path for long-term brand equity.",
    openGraph: {
        title: "Private Label vs. Custom Manufacturing: Which Fits Your Brand?",
        description: "Are you just printing on blanks or building a real brand? Understand the pros and cons of private label vs custom apparel manufacturing.",
        type: 'article',
        publishedTime: '2026-03-12',
        authors: ['Krazy Kreators Team'],
        images: [
            {
                url: '/blog/private-label-vs-custom-manufacturing-banner.png',
                width: 1200,
                height: 630,
                alt: 'Private Label vs Custom Manufacturing Garments',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: "Private Label vs. Custom Manufacturing: Which Fits Your Brand?",
        description: "Are you just printing on blanks or building a real brand?",
        images: ['/blog/private-label-vs-custom-manufacturing-banner.png'],
    },
};

export const runtime = 'edge';
export const dynamic = "force-dynamic";

const BLOG_ID = 'private-label-vs-custom-manufacturing';

export default async function CustomMfgPage() {
    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount(BLOG_ID),
        getComments(BLOG_ID)
    ]);

    return (
        <CustomMfgClient
            initialLikeCount={likeCount}
            initialComments={comments}
        />
    );
}
