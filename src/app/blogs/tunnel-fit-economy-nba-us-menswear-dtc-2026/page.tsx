import TunnelFitClient from "./TunnelFitClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export const metadata = {
    title: "The Tunnel-Fit Economy Reshaping US Menswear | Krazy Kreators",
    description:
        "NBA tunnel fits are now US menswear's biggest runway. How small DTC brands ride the overnight spike — and why the bulk has to match the sample to convert it.",
};

export default async function TunnelFitPage() {
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
    const proto = headersList.get("x-forwarded-proto") ?? "https";
    const baseUrl = host ? `${proto}://${host}` : undefined;

    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount("tunnel-fit-economy-nba-us-menswear-dtc-2026", { baseUrl }),
        getComments("tunnel-fit-economy-nba-us-menswear-dtc-2026", { baseUrl }),
    ]);

    const sanitizedComments = comments.map((c) => ({ ...c, email: "" }));

    return (
        <>
            <BlogViewTracker slug="tunnel-fit-economy-nba-us-menswear-dtc-2026" />
            <TunnelFitClient initialLikeCount={likeCount} initialComments={sanitizedComments} />
        </>
    );
}