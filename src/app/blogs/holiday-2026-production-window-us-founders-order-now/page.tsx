import HolidayProductionWindowClient from "./HolidayProductionWindowClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export const metadata = {
    title: "What to Lock for Holiday Before the Window Closes | Krazy Kreators",
    description:
        "Black Friday is Nov 27. The overseas production cycle is ~5 months. Your holiday 2026 production timeline puts the real deadline this June, not October.",
};

export default async function HolidayProductionWindowPage() {
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
    const proto = headersList.get("x-forwarded-proto") ?? "https";
    const baseUrl = host ? `${proto}://${host}` : undefined;

    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount("holiday-2026-production-window-us-founders-order-now", { baseUrl }),
        getComments("holiday-2026-production-window-us-founders-order-now", { baseUrl }),
    ]);

    const sanitizedComments = comments.map((c) => ({ ...c, email: "" }));

    return (
        <>
            <BlogViewTracker slug="holiday-2026-production-window-us-founders-order-now" />
            <HolidayProductionWindowClient initialLikeCount={likeCount} initialComments={sanitizedComments} />
        </>
    );
}