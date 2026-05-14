import OnDemandManufacturingClient from "./OnDemandManufacturingClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export const metadata = {
    title: "On-Demand Clothing Manufacturing in 2026: Produce Less, Sell More | Krazy Kreators",
    description:
        "On-demand manufacturing is how the smartest 2026 clothing brands launch without inventory risk. Here is what it actually means, why bulk no longer works for startups, the real cost of unsold stock, and how Zero MOQ production is the practical application of the model.",
};

export default async function OnDemandManufacturingPage() {
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
    const proto = headersList.get("x-forwarded-proto") ?? "https";
    const baseUrl = host ? `${proto}://${host}` : undefined;

    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount("on-demand-clothing-manufacturing-2026", { baseUrl }),
        getComments("on-demand-clothing-manufacturing-2026", { baseUrl }),
    ]);

    return (
        <>
            <BlogViewTracker slug="on-demand-clothing-manufacturing-2026" />
            <OnDemandManufacturingClient initialLikeCount={likeCount} initialComments={comments} />
        </>
    );
}
