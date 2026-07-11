import MadeInUsaClient from "./MadeInUsaClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export const metadata = {
    title: "Made in USA Clothing: Label Rules & Your Sourcing Story | Krazy Kreators",
    description:
        "Made in USA clothing has a bright-line rule: imported fabric bars an unqualified claim. The FTC's 2026 crackdown, qualified claims, and a sourcing story that holds.",
};

export default async function MadeInUsaPage() {
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
    const proto = headersList.get("x-forwarded-proto") ?? "https";
    const baseUrl = host ? `${proto}://${host}` : undefined;

    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount("made-in-usa-clothing-label-rules-2026", { baseUrl }),
        getComments("made-in-usa-clothing-label-rules-2026", { baseUrl }),
    ]);

    const sanitizedComments = comments.map((c) => ({ ...c, email: "" }));

    return (
        <>
            <BlogViewTracker slug="made-in-usa-clothing-label-rules-2026" />
            <MadeInUsaClient initialLikeCount={likeCount} initialComments={sanitizedComments} />
        </>
    );
}
