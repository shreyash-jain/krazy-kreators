import SustainabilitySimplifiedClient from "@/app/blogs/sustainability-simplified-organic-cotton-gots-recycled-polyester/SustainabilitySimplifiedClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import BlogViewTracker from "@/components/BlogViewTracker";

export const metadata = {
    title: "Sustainability Simplified: Organic Cotton, GOTS, and Recycled Polyester | Krazy Kreators",
    description: "Break down what various eco-certifications actually mean and explore the pros and cons of using sustainable fibers like organic cotton and recycled polyester.",
    openGraph: {
        title: "Sustainability Simplified: Organic Cotton, GOTS, and Recycled Polyester",
        description: "Break down what various eco-certifications actually mean and explore the pros and cons of using sustainable fibers.",
        type: 'article',
        publishedTime: '2026-04-10',
        authors: ['Krazy Kreators Team'],
        images: [
            {
                url: '/blog/sustainability_blog_banner_v2.png',
                width: 1200,
                height: 630,
                alt: 'Sustainability Simplified',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: "Sustainability Simplified: Organic Cotton, GOTS, and Recycled Polyester",
        description: "Break down what various eco-certifications actually mean and explore the pros and cons of using sustainable fibers.",
        images: ['/blog/sustainability_blog_banner_v2.png'],
    },
};

export const runtime = 'edge';
export const dynamic = "force-dynamic";

const BLOG_ID = 'sustainability-simplified-organic-cotton-gots-recycled-polyester';

export default async function SustainabilitySimplifiedPage() {
    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount(BLOG_ID),
        getComments(BLOG_ID)
    ]);

    return (
        <>
            <BlogViewTracker slug="sustainability-simplified-organic-cotton-gots-recycled-polyester" />
            <SustainabilitySimplifiedClient initialLikeCount={likeCount} initialComments={comments} />
        </>
    );
}
