import HowToStartBlogClient from "./HowToStartBlogClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export const metadata = {
    title: "How to Start a Clothing Brand in 2026: Additional Steps for Success | Krazy Kreators",
    description: "A comprehensive guide on starting a successful fashion brand in 2026, covering AI design, sustainable manufacturing, and building micro-communities.",
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
    return <HowToStartBlogClient initialLikeCount={likeCount} initialComments={comments} />;
}
