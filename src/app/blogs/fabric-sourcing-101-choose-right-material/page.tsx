import FabricSourcingClient from "@/app/blogs/fabric-sourcing-101-choose-right-material/FabricSourcingClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";

export const metadata = {
    title: "Fabric Sourcing 101: How to Choose the Right Material for Your Collection | Krazy Kreators",
    description: "Got a great sketch but stuck on the fabric? Learn the basics of textile selection and why working with a fabric sourcing agent is a game changer.",
    openGraph: {
        title: "Fabric Sourcing 101: How to Choose the Right Material for Your Collection",
        description: "Got a great sketch but stuck on the fabric? Learn the basics of textile selection and why working with a fabric sourcing agent is a game changer.",
        type: 'article',
        publishedTime: '2026-03-24',
        authors: ['Krazy Kreators Team'],
        images: [
            {
                url: '/blog/fabric-sourcing-101-banner.png',
                width: 1200,
                height: 630,
                alt: 'Fabric Sourcing 101 Guide',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: "Fabric Sourcing 101: How to Choose the Right Material for Your Collection",
        description: "The ultimate guide to textile selection for fashion designers.",
        images: ['/blog/fabric-sourcing-101-banner.png'],
    },
};

export const runtime = 'edge';
export const dynamic = "force-dynamic";

const BLOG_ID = 'fabric-sourcing-101-choose-right-material';

export default async function FabricSourcingPage() {
    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount(BLOG_ID),
        getComments(BLOG_ID)
    ]);

    return (
        <FabricSourcingClient
            initialLikeCount={likeCount}
            initialComments={comments}
        />
    );
}
