import PrimeDayMarginClient from "./PrimeDayMarginClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export const metadata = {
    title: "Prime Day's Over. Your Margin Report Isn't. | Krazy Kreators",
    description:
        "Prime Day ended in June. Your DTC profit margin report lands now. The marketplace discount math founders skip — and how to build margin back into the next drop.",
};

export default async function PrimeDayMarginPage() {
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
    const proto = headersList.get("x-forwarded-proto") ?? "https";
    const baseUrl = host ? `${proto}://${host}` : undefined;

    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount("dtc-margin-after-prime-day-2026", { baseUrl }),
        getComments("dtc-margin-after-prime-day-2026", { baseUrl }),
    ]);

    const sanitizedComments = comments.map((c) => ({ ...c, email: "" }));

    return (
        <>
            <BlogViewTracker slug="dtc-margin-after-prime-day-2026" />
            <PrimeDayMarginClient initialLikeCount={likeCount} initialComments={sanitizedComments} />
        </>
    );
}
