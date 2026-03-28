import FabricGsmClient from "@/app/blogs/understanding-fabric-gsm-guide-to-choosing-right-weight/FabricGsmClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";

export const metadata = {
    title: "Understanding Fabric GSM: A Guide to Choosing the Right Weight | Krazy Kreators",
    description: "What is GSM and why does it matter? Learn the difference between a 180 GSM tee and a 240 GSM tee, and how to pick the perfect weight for your designs.",
    openGraph: {
        title: "Understanding Fabric GSM: A Guide to Choosing the Right Weight",
        description: "What is GSM and why does it matter? Learn how to pick the perfect fabric weight for your designs.",
        type: 'article',
        publishedTime: '2026-03-26',
        authors: ['Krazy Kreators Team'],
        images: [
            {
                url: '/blog/understanding-fabric-gsm-banner.png',
                width: 1200,
                height: 630,
                alt: 'Understanding Fabric GSM Guide',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: "Understanding Fabric GSM",
        description: "The ultimate guide to fabric weight (GSM) for fashion designers.",
        images: ['/blog/understanding-fabric-gsm-banner.png'],
    },
};

export const runtime = 'edge';
export const dynamic = "force-dynamic";

const BLOG_ID = 'understanding-fabric-gsm-guide-to-choosing-right-weight';

export default async function FabricGsmPage() {
    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount(BLOG_ID),
        getComments(BLOG_ID)
    ]);

    return (
        <FabricGsmClient
            initialLikeCount={likeCount}
            initialComments={comments}
        />
    );
}
