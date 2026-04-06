import GradingVsPatternMakingClient from "@/app/blogs/grading-vs-pattern-making-perfect-fit/GradingVsPatternMakingClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";

export const metadata = {
    title: "Grading vs. Pattern Making: Why Your Sample Fits Great in One Size but Falls Apart in Others | Krazy Kreators",
    description: "Learn the difference between pattern making and size grading in garment manufacturing. Understand why fit breaks across sizes, how grading rules work, and what to demand from your manufacturer to get consistent fit across your full size run.",
    openGraph: {
        title: "Grading vs. Pattern Making: The Anatomy of a Perfect Fit",
        description: "A Medium is not just a smaller Large. Learn how pattern making and size grading work together to deliver consistent fit across every size in your collection.",
        type: 'article',
        publishedTime: '2026-04-06',
        authors: ['Krazy Kreators Team'],
        images: [
            {
                url: 'https://res.cloudinary.com/dn9snfizy/image/upload/f_auto,q_auto,w_1200/blog/v2-grading-vs-pattern-making-banner',
                width: 1200,
                height: 630,
                alt: 'Pattern Making and Size Grading Guide for Fashion Brands',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: "Grading vs. Pattern Making: Why Fit Breaks Across Sizes",
        description: "Fit is the number one reason for returns. Learn how grading and pattern making work together to keep your silhouette consistent from XS to XXL.",
        images: ['https://res.cloudinary.com/dn9snfizy/image/upload/f_auto,q_auto,w_1200/blog/v2-grading-vs-pattern-making-banner'],
    },
};

export const runtime = 'edge';
export const dynamic = "force-dynamic";

const BLOG_ID = 'grading-vs-pattern-making-perfect-fit';

export default async function GradingVsPatternMakingPage() {
    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount(BLOG_ID),
        getComments(BLOG_ID)
    ]);

    return (
        <GradingVsPatternMakingClient
            initialLikeCount={likeCount}
            initialComments={comments}
        />
    );
}
