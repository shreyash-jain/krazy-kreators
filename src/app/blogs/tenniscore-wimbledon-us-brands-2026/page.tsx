import TenniscoreClient from "./TenniscoreClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export const metadata = {
    title: "Tennis-Core Won Wimbledon. Can Your Brand? | Krazy Kreators",
    description:
        "Tenniscore isn't a Wimbledon-fortnight blip — it's a durable quiet-luxury wave riding the racket-sport boom. Here's what it takes for a US brand to make it well.",
};

export default async function TenniscorePage() {
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
    const proto = headersList.get("x-forwarded-proto") ?? "https";
    const baseUrl = host ? `${proto}://${host}` : undefined;

    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount("tenniscore-wimbledon-us-brands-2026", { baseUrl }),
        getComments("tenniscore-wimbledon-us-brands-2026", { baseUrl }),
    ]);

    const sanitizedComments = comments.map((c) => ({ ...c, email: "" }));

    return (
        <>
            <BlogViewTracker slug="tenniscore-wimbledon-us-brands-2026" />
            <TenniscoreClient initialLikeCount={likeCount} initialComments={sanitizedComments} />
        </>
    );
}
