import DyeingTechniquesClient from "@/app/blogs/pigment-dye-vs-reactive-dye/DyeingTechniquesClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";

export const metadata = {
    title: "Pigment Dye vs. Reactive Dye: Which Dyeing Technique Is Right for Your Brand? | Krazy Kreators",
    description: "Learn the difference between pigment dye and reactive dye for garment manufacturing. Understand when to use each dyeing technique, common mistakes to avoid, and how to get the exact finish your collection needs.",
    openGraph: {
        title: "Pigment Dye vs. Reactive Dye: Which One Is Right for Your Brand?",
        description: "The complete guide to garment dyeing techniques. Learn when to use pigment dye vs reactive dye, common mistakes to avoid, and pro tips from the production floor.",
        type: 'article',
        publishedTime: '2026-04-06',
        authors: ['Krazy Kreators Team'],
        images: [
            {
                url: 'https://res.cloudinary.com/dn9snfizy/image/upload/f_auto,q_auto,w_1200/blog/v2-pigment-dye-vs-reactive-dye-banner',
                width: 1200,
                height: 630,
                alt: 'Pigment Dye vs Reactive Dye Comparison',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: "Pigment Dye vs. Reactive Dye: Which One Is Right for Your Brand?",
        description: "The complete guide to garment dyeing techniques. Learn when to use pigment dye vs reactive dye and how to avoid common finishing mistakes.",
        images: ['https://res.cloudinary.com/dn9snfizy/image/upload/f_auto,q_auto,w_1200/blog/v2-pigment-dye-vs-reactive-dye-banner'],
    },
};

export const runtime = 'edge';
export const dynamic = "force-dynamic";

const BLOG_ID = 'pigment-dye-vs-reactive-dye';

export default async function DyeingTechniquesPage() {
    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount(BLOG_ID),
        getComments(BLOG_ID)
    ]);

    return (
        <DyeingTechniquesClient
            initialLikeCount={likeCount}
            initialComments={comments}
        />
    );
}
