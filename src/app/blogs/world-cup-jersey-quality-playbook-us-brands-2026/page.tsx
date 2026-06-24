import WorldCupJerseyClient from "./WorldCupJerseyClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export const metadata = {
    title: "The Jersey Standard: Product as Global Stage | Krazy Kreators",
    description:
        "The 2026 World Cup jersey is the most-scrutinized garment on earth. Here's how its fibre, tier-ladder, and design playbook scales down to any US clothing brand.",
};

export default async function WorldCupJerseyPage() {
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
    const proto = headersList.get("x-forwarded-proto") ?? "https";
    const baseUrl = host ? `${proto}://${host}` : undefined;

    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount("world-cup-jersey-quality-playbook-us-brands-2026", { baseUrl }),
        getComments("world-cup-jersey-quality-playbook-us-brands-2026", { baseUrl }),
    ]);

    const sanitizedComments = comments.map((c) => ({ ...c, email: "" }));

    return (
        <>
            <BlogViewTracker slug="world-cup-jersey-quality-playbook-us-brands-2026" />
            <WorldCupJerseyClient initialLikeCount={likeCount} initialComments={sanitizedComments} />
        </>
    );
}
