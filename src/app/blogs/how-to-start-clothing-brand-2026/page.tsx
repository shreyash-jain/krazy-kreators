import HowToStartBlogClient from "./HowToStartBlogClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from 'next/headers';
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export const metadata = {
    title: "Launching a Global Clothing Brand in 2026: The Strategic Playbook | Krazy Kreators",
    description: "A strategic guide for international fashion entrepreneurs on scalable manufacturing, AI integration, and supply chain compliance in 2026.",
};

export default async function HowToStartBlogPage() {
    const headersList = await headers();
    const host = headersList.get('x-forwarded-host') ?? headersList.get('host');
    const proto = headersList.get('x-forwarded-proto') ?? 'https';
    const baseUrl = host ? `${proto}://${host}` : undefined;

    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount("how-to-start-clothing-brand-2026", { baseUrl }),
        getComments("how-to-start-clothing-brand-2026", { baseUrl }),
    ]);
    return (
        <>
            <BlogViewTracker slug="how-to-start-clothing-brand-2026" />
            <HowToStartBlogClient initialLikeCount={likeCount} initialComments={comments} />
        </>
    );
}
