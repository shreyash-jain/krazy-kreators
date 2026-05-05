import ZeroMoqClient from "./ZeroMoqClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from 'next/headers';
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export const metadata = {
    title: "Zero MOQ, No Warehouse, No Factory Contract: The 2026 Playbook for Launching Your First Clothing Brand | Krazy Kreators",
    description: "Learn how to start a clothing brand with no minimum order quantity in 2026. The three-step model: tech pack, one sample, then production — only when you are ready.",
};

export default async function ZeroMoqPage() {
    const headersList = await headers();
    const host = headersList.get('x-forwarded-host') ?? headersList.get('host');
    const proto = headersList.get('x-forwarded-proto') ?? 'https';
    const baseUrl = host ? `${proto}://${host}` : undefined;

    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount("zero-moq-no-warehouse-launch-clothing-brand-2026", { baseUrl }),
        getComments("zero-moq-no-warehouse-launch-clothing-brand-2026", { baseUrl }),
    ]);
    return (
        <>
            <BlogViewTracker slug="zero-moq-no-warehouse-launch-clothing-brand-2026" />
            <ZeroMoqClient initialLikeCount={likeCount} initialComments={comments} />
        </>
    );
}
