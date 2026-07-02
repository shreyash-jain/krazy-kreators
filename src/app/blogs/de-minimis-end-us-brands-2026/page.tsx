import DeMinimisClient from "./DeMinimisClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export const metadata = {
    title: "Every Parcel Pays Now: The End of the $800 Rule | Krazy Kreators",
    description:
        "The $800 de minimis exemption is gone — every US import now pays duty and a formal entry fee. Here's the post-2026 landed-cost math and the DTC fulfillment fix.",
};

export default async function DeMinimisPage() {
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
    const proto = headersList.get("x-forwarded-proto") ?? "https";
    const baseUrl = host ? `${proto}://${host}` : undefined;

    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount("de-minimis-end-us-brands-2026", { baseUrl }),
        getComments("de-minimis-end-us-brands-2026", { baseUrl }),
    ]);

    const sanitizedComments = comments.map((c) => ({ ...c, email: "" }));

    return (
        <>
            <BlogViewTracker slug="de-minimis-end-us-brands-2026" />
            <DeMinimisClient initialLikeCount={likeCount} initialComments={sanitizedComments} />
        </>
    );
}
