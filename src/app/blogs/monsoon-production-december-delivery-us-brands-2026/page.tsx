import MonsoonProductionClient from "./MonsoonProductionClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export const metadata = {
    title: "Monsoon Math: June Rain and Your December Delivery | Krazy Kreators",
    description:
        "Monsoon apparel production runs June–September — the same window producing your December stock. Humidity shifts color, drying, finishing, and freight.",
};

export default async function MonsoonProductionPage() {
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
    const proto = headersList.get("x-forwarded-proto") ?? "https";
    const baseUrl = host ? `${proto}://${host}` : undefined;

    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount("monsoon-production-december-delivery-us-brands-2026", { baseUrl }),
        getComments("monsoon-production-december-delivery-us-brands-2026", { baseUrl }),
    ]);

    const sanitizedComments = comments.map((c) => ({ ...c, email: "" }));

    return (
        <>
            <BlogViewTracker slug="monsoon-production-december-delivery-us-brands-2026" />
            <MonsoonProductionClient initialLikeCount={likeCount} initialComments={sanitizedComments} />
        </>
    );
}
