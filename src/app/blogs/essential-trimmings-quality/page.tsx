import EssentialTrimmingsClient from "./EssentialTrimmingsClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export const metadata = {
    title: "Essential Trimmings: How Zippers, Buttons, and Drawstrings Define Quality | Krazy Kreators",
    description: "Moves focus from the fabric to the hardware. Explains why YKK zippers or custom-dipped aglets can justify a higher retail price.",
};

export default async function EssentialTrimmingsPage() {
    const headersList = await headers();
    const host = headersList.get('x-forwarded-host') ?? headersList.get('host');
    const proto = headersList.get('x-forwarded-proto') ?? 'https';
    const baseUrl = host ? `${proto}://${host}` : undefined;

    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount("essential-trimmings-quality", { baseUrl }),
        getComments("essential-trimmings-quality", { baseUrl }),
    ]);
    return <EssentialTrimmingsClient initialLikeCount={likeCount} initialComments={comments} />;
}
