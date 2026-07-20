import RebuildCostClient from "./RebuildCostClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export const metadata = {
    title: "After the Cliff: Rebuild Your Cost Sheet for August | Krazy Kreators",
    description:
        "Section 122's 10% blanket expired July 24. Rebuild your apparel landed cost for August-clearing goods across all three outcomes — lapse, Section 301 at 10%, or 12.5%.",
};

export default async function RebuildCostPage() {
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
    const proto = headersList.get("x-forwarded-proto") ?? "https";
    const baseUrl = host ? `${proto}://${host}` : undefined;

    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount("rebuild-landed-cost-august-2026", { baseUrl }),
        getComments("rebuild-landed-cost-august-2026", { baseUrl }),
    ]);

    const sanitizedComments = comments.map((c) => ({ ...c, email: "" }));

    return (
        <>
            <BlogViewTracker slug="rebuild-landed-cost-august-2026" />
            <RebuildCostClient initialLikeCount={likeCount} initialComments={sanitizedComments} />
        </>
    );
}
