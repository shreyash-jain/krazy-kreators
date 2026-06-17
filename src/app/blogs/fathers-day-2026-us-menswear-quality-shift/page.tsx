import FathersDayMenswearClient from "./FathersDayMenswearClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export const metadata = {
    title: "Wasn't He Six Just Yesterday? | Krazy Kreators",
    description:
        "Father's Day 2026 is a $27.9B record, NRF says. What a grown son chooses for his father this June isn't the piece — it's a sentence the father has long forgotten, handed back.",
};

export default async function FathersDayMenswearPage() {
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
    const proto = headersList.get("x-forwarded-proto") ?? "https";
    const baseUrl = host ? `${proto}://${host}` : undefined;

    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount("fathers-day-2026-us-menswear-quality-shift", { baseUrl }),
        getComments("fathers-day-2026-us-menswear-quality-shift", { baseUrl }),
    ]);

    const sanitizedComments = comments.map((c) => ({ ...c, email: "" }));

    return (
        <>
            <BlogViewTracker slug="fathers-day-2026-us-menswear-quality-shift" />
            <FathersDayMenswearClient initialLikeCount={likeCount} initialComments={sanitizedComments} />
        </>
    );
}
