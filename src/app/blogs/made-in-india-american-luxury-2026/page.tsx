import MadeInIndiaClient from "./MadeInIndiaClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export const metadata = {
    title: "The 'Made in India' Trend Reshaping American Luxury in 2026 | Krazy Kreators",
    description:
        "Prada is launching a Kolhapuri collection. Harry Styles is wearing Harago. Sabyasachi is opening flagship doors faster than any single luxury house this year. For US clothing founders, 'Made in India' has shifted from cost-coded to craft-coded. Here is how to position around the once-in-a-decade window.",
};

export default async function MadeInIndiaPage() {
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
    const proto = headersList.get("x-forwarded-proto") ?? "https";
    const baseUrl = host ? `${proto}://${host}` : undefined;

    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount("made-in-india-american-luxury-2026", { baseUrl }),
        getComments("made-in-india-american-luxury-2026", { baseUrl }),
    ]);

    return (
        <>
            <BlogViewTracker slug="made-in-india-american-luxury-2026" />
            <MadeInIndiaClient initialLikeCount={likeCount} initialComments={comments} />
        </>
    );
}
