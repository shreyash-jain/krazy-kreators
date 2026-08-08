import SecondOriginClient from "./SecondOriginClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export const metadata = {
    title: "A Second Origin, Costed in 30 Days | Krazy Kreators",
    description:
        "Stand up a costed second sourcing origin in 30 days — the plus-one execution. Sampling rounds, MOQ, and lead-time realities so one ruling can't reprice your buy.",
};

export default async function SecondOriginPage() {
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
    const proto = headersList.get("x-forwarded-proto") ?? "https";
    const baseUrl = host ? `${proto}://${host}` : undefined;

    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount("second-origin-costed-30-days", { baseUrl }),
        getComments("second-origin-costed-30-days", { baseUrl }),
    ]);

    const sanitizedComments = comments.map((c) => ({ ...c, email: "" }));

    return (
        <>
            <BlogViewTracker slug="second-origin-costed-30-days" />
            <SecondOriginClient initialLikeCount={likeCount} initialComments={sanitizedComments} />
        </>
    );
}
