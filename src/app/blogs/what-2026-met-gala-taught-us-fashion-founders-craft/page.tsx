import MetGala2026Client from "./MetGala2026Client";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export const metadata = {
    title: "What the 2026 Met Gala Taught US Fashion Founders About Craft | Krazy Kreators",
    description:
        "The 2026 Met Gala raised a record $42 million celebrating fashion as craft and art. For US clothing founders, this is not a museum moment. It is a market signal. Here is what the craft-as-moat shift means for product strategy, consumer expectations, and the next twelve months.",
};

export default async function MetGala2026Page() {
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
    const proto = headersList.get("x-forwarded-proto") ?? "https";
    const baseUrl = host ? `${proto}://${host}` : undefined;

    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount("what-2026-met-gala-taught-us-fashion-founders-craft", { baseUrl }),
        getComments("what-2026-met-gala-taught-us-fashion-founders-craft", { baseUrl }),
    ]);

    return (
        <>
            <BlogViewTracker slug="what-2026-met-gala-taught-us-fashion-founders-craft" />
            <MetGala2026Client initialLikeCount={likeCount} initialComments={comments} />
        </>
    );
}
