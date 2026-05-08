import UsFashionBrandsClient from "./UsFashionBrandsClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export const metadata = {
    title: "Why US Fashion Brands Are Moving Away From China in 2026 | Krazy Kreators",
    description:
        "US tariffs have reshaped apparel sourcing in 2026. Here is what it costs to stay with China-based factories, why India has emerged as the leading alternative, and how to plan your transition.",
};

export default async function UsFashionBrandsPage() {
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
    const proto = headersList.get("x-forwarded-proto") ?? "https";
    const baseUrl = host ? `${proto}://${host}` : undefined;

    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount("us-fashion-brands-moving-from-china-2026", { baseUrl }),
        getComments("us-fashion-brands-moving-from-china-2026", { baseUrl }),
    ]);

    return (
        <>
            <BlogViewTracker slug="us-fashion-brands-moving-from-china-2026" />
            <UsFashionBrandsClient initialLikeCount={likeCount} initialComments={comments} />
        </>
    );
}
