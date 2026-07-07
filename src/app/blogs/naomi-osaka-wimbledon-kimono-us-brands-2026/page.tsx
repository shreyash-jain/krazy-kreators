import OsakaWimbledonClient from "./OsakaWimbledonClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export const metadata = {
    title: "The Walk-On Is the Product: Osaka's Wimbledon Play | Krazy Kreators",
    description:
        "Naomi Osaka's white kimono walk-on at Wimbledon 2026 turned a dress code into couture. Here's what the 'entrance as product' playbook teaches US clothing founders.",
};

export default async function OsakaWimbledonPage() {
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
    const proto = headersList.get("x-forwarded-proto") ?? "https";
    const baseUrl = host ? `${proto}://${host}` : undefined;

    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount("naomi-osaka-wimbledon-kimono-us-brands-2026", { baseUrl }),
        getComments("naomi-osaka-wimbledon-kimono-us-brands-2026", { baseUrl }),
    ]);

    const sanitizedComments = comments.map((c) => ({ ...c, email: "" }));

    return (
        <>
            <BlogViewTracker slug="naomi-osaka-wimbledon-kimono-us-brands-2026" />
            <OsakaWimbledonClient initialLikeCount={likeCount} initialComments={sanitizedComments} />
        </>
    );
}
