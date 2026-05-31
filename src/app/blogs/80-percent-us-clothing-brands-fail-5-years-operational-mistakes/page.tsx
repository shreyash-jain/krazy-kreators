import FiveYearFailClient from "./FiveYearFailClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export const metadata = {
    title: "Why 80–90% of US Clothing Brands Fail in 5 Years (and the 4 Operational Mistakes Behind It) | Krazy Kreators",
    description:
        "Eighty to ninety percent of new US clothing brands fail by year five. The story most founders tell is creative failure. The actual cause is four operational mistakes — all made in the first 90 days, before a single garment ships. Here is the operational map of where US clothing brands actually die.",
};

export default async function FiveYearFailPage() {
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
    const proto = headersList.get("x-forwarded-proto") ?? "https";
    const baseUrl = host ? `${proto}://${host}` : undefined;

    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount("80-percent-us-clothing-brands-fail-5-years-operational-mistakes", { baseUrl }),
        getComments("80-percent-us-clothing-brands-fail-5-years-operational-mistakes", { baseUrl }),
    ]);

    return (
        <>
            <BlogViewTracker slug="80-percent-us-clothing-brands-fail-5-years-operational-mistakes" />
            <FiveYearFailClient initialLikeCount={likeCount} initialComments={comments} />
        </>
    );
}
