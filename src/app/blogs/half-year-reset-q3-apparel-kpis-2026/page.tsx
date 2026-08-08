import HalfYearResetClient from "./HalfYearResetClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export const metadata = {
    title: "The Half-Year Reset: 5 Numbers to Re-Check for Q3 | Krazy Kreators",
    description:
        "Section 301 duties landed July 24. Re-derive your apparel landed cost 2026, sell-through, MOQ exposure, lead time and cash cycle before Fall and Holiday load.",
    keywords: [
        "apparel landed cost 2026",
        "half-year reset for clothing brands",
        "sell-through rate benchmark",
        "MOQ exposure",
        "apparel lead time variance",
        "apparel cash conversion cycle",
        "Q3 apparel KPIs",
        "Section 301 forced labor tariff apparel",
    ],
};

export default async function HalfYearResetPage() {
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
    const proto = headersList.get("x-forwarded-proto") ?? "https";
    const baseUrl = host ? `${proto}://${host}` : undefined;

    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount("half-year-reset-q3-apparel-kpis-2026", { baseUrl }),
        getComments("half-year-reset-q3-apparel-kpis-2026", { baseUrl }),
    ]);

    const sanitizedComments = comments.map((c) => ({ ...c, email: "" }));

    return (
        <>
            <BlogViewTracker slug="half-year-reset-q3-apparel-kpis-2026" />
            <HalfYearResetClient initialLikeCount={likeCount} initialComments={sanitizedComments} />
        </>
    );
}
