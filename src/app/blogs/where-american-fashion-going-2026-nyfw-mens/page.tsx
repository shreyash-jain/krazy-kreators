import NyfwMensClient from "./NyfwMensClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from "next/headers";
import BlogViewTracker from "@/components/BlogViewTracker";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export const metadata = {
    title: "NYFW Men's Just Signaled Where US Fashion's Headed | Krazy Kreators",
    description:
        "American fashion direction 2026: NYFW Men's signals craft beat spectacle, menswear is the energy, and the Fashion Fund points to fewer-better lines.",
};

export default async function NyfwMensPage() {
    const headersList = await headers();
    const host = headersList.get("x-forwarded-host") ?? headersList.get("host");
    const proto = headersList.get("x-forwarded-proto") ?? "https";
    const baseUrl = host ? `${proto}://${host}` : undefined;

    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount("where-american-fashion-going-2026-nyfw-mens", { baseUrl }),
        getComments("where-american-fashion-going-2026-nyfw-mens", { baseUrl }),
    ]);

    const sanitizedComments = comments.map((c) => ({ ...c, email: "" }));

    return (
        <>
            <BlogViewTracker slug="where-american-fashion-going-2026-nyfw-mens" />
            <NyfwMensClient initialLikeCount={likeCount} initialComments={sanitizedComments} />
        </>
    );
}
