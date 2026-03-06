import TechPackClient from "@/app/blogs/what-is-a-tech-pack-why-you-need-it/TechPackClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";

export const metadata = {
    title: "What is a Tech Pack? (And Why You Can't Manufacture Without One) | Krazy Kreators",
    description: "Learn what a clothing tech pack is, why fashion technical design is crucial, and why jumping into production without a garment specification sheet leads to costly errors.",
    openGraph: {
        title: "What is a Tech Pack? (And Why You Can't Manufacture Without One)",
        description: "A Tech Pack is the blueprint for a factory. Without it, errors happen. Learn why designers need this vital document.",
        type: 'article',
        publishedTime: '2026-03-06',
        authors: ['Krazy Kreators Team'],
        images: [
            {
                url: '/blog/tech-pack-banner.png',
                width: 1200,
                height: 630,
                alt: 'Tech Pack Blueprint',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: "What is a Tech Pack? (And Why You Can't Manufacture Without One)",
        description: "A Tech Pack is the blueprint for a factory.",
        images: ['/blog/tech-pack-banner.png'],
    },
};

export const runtime = 'edge';
export const dynamic = "force-dynamic";

const BLOG_ID = 'what-is-a-tech-pack-why-you-need-it';

export default async function TechPackPage() {
    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount(BLOG_ID),
        getComments(BLOG_ID)
    ]);

    return (
        <TechPackClient
            initialLikeCount={likeCount}
            initialComments={comments}
        />
    );
}
