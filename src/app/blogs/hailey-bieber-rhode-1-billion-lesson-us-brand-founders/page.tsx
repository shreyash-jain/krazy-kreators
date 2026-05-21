import RhodeLessonClient from "./RhodeLessonClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export const metadata = {
    title: "Why Hailey Bieber's $1B Rhode Sale Matters for Every US Brand Founder | Krazy Kreators",
    description:
        "Rhode sold to e.l.f. for $1B with two-thirds fewer SKUs than the average DTC beauty brand. For US clothing founders, the lesson is not celebrity. It is product discipline. Here is what acquirers actually paid for and the three moves to steal for your own line.",
};

export default async function RhodeLessonPage() {
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
    const proto = headersList.get("x-forwarded-proto") ?? "https";
    const baseUrl = host ? `${proto}://${host}` : undefined;

    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount("hailey-bieber-rhode-1-billion-lesson-us-brand-founders", { baseUrl }),
        getComments("hailey-bieber-rhode-1-billion-lesson-us-brand-founders", { baseUrl }),
    ]);

    return (
        <>
            <BlogViewTracker slug="hailey-bieber-rhode-1-billion-lesson-us-brand-founders" />
            <RhodeLessonClient initialLikeCount={likeCount} initialComments={comments} />
        </>
    );
}
