import SustainableEUClient from "./SustainableEUClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from 'next/headers';
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export const metadata = {
    title: "Your EU Buyers Are Asking About Your Supply Chain: Sustainable Manufacturing in 2026 | Krazy Kreators",
    description: "Learn what sustainability in manufacturing actually means for fashion startups. Discover the 5 questions to ask manufacturers and how to prepare for the 2027 EU Digital Product Passport.",
};

export default async function SustainableEUPage() {
    const headersList = await headers();
    const host = headersList.get('x-forwarded-host') ?? headersList.get('host');
    const proto = headersList.get('x-forwarded-proto') ?? 'https';
    const baseUrl = host ? `${proto}://${host}` : undefined;

    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount("eu-buyers-sustainable-manufacturing-2026", { baseUrl }),
        getComments("eu-buyers-sustainable-manufacturing-2026", { baseUrl }),
    ]);
    return (
        <>
            <BlogViewTracker slug="eu-buyers-sustainable-manufacturing-2026" />
            <SustainableEUClient initialLikeCount={likeCount} initialComments={comments} />
        </>
    );
}
