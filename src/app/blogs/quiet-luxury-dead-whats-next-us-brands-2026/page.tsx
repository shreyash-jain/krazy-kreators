import QuietLuxuryClient from "./QuietLuxuryClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export const metadata = {
    title: "The Quiet Luxury Aesthetic Is Dead. What's Next for US Brands? | Krazy Kreators",
    description:
        "Quiet luxury, clean girl, and old money are commodified by mid-2026 — Target collections, Shein dupes, and saturated algorithms have collapsed the category into sameness. Aesthetics die. Perspectives don't. Here is what's actually next for US fashion brands and how to rebuild positioning that outlasts the next cycle.",
};

export default async function QuietLuxuryPage() {
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
    const proto = headersList.get("x-forwarded-proto") ?? "https";
    const baseUrl = host ? `${proto}://${host}` : undefined;

    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount("quiet-luxury-dead-whats-next-us-brands-2026", { baseUrl }),
        getComments("quiet-luxury-dead-whats-next-us-brands-2026", { baseUrl }),
    ]);

    return (
        <>
            <BlogViewTracker slug="quiet-luxury-dead-whats-next-us-brands-2026" />
            <QuietLuxuryClient initialLikeCount={likeCount} initialComments={comments} />
        </>
    );
}
