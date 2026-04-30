import RealCostClient from "./RealCostClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export const metadata = {
    title: "Wrong Samples. Defective Bulk Orders. No One to Call. The Real Cost of Choosing the Wrong Clothing Manufacturer.",
    description: "Quantifies the real costs of working with a bad manufacturer: wrong samples, no dedicated contact, defective bulk orders, and hidden charges.",
};

export default async function RealCostPage() {
    const headersList = await headers();
    const host = headersList.get('x-forwarded-host') ?? headersList.get('host');
    const proto = headersList.get('x-forwarded-proto') ?? 'https';
    const baseUrl = host ? `${proto}://${host}` : undefined;

    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount("the-real-cost-of-wrong-clothing-manufacturer", { baseUrl }),
        getComments("the-real-cost-of-wrong-clothing-manufacturer", { baseUrl }),
    ]);
    return <RealCostClient initialLikeCount={likeCount} initialComments={comments} />;
}
