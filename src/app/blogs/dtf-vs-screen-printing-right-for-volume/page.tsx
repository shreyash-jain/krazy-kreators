import DtfVsScreenPrintingClient from "./DtfVsScreenPrintingClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export const metadata = {
    title: "Direct-to-Film (DTF) vs. Screen Printing: Which is Right for Your Volume? | Krazy Kreators",
    description: "Compare the setup costs, color complexity, and durability of DTF versus traditional Screen Printing based on order size. The ultimate guide for small clothing brands.",
};

export default async function DtfVsScreenPrintingPage() {
    const headersList = await headers();
    const host = headersList.get('x-forwarded-host') ?? headersList.get('host');
    const proto = headersList.get('x-forwarded-proto') ?? 'https';
    const baseUrl = host ? `${proto}://${host}` : undefined;

    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount("dtf-vs-screen-printing-right-for-volume", { baseUrl }),
        getComments("dtf-vs-screen-printing-right-for-volume", { baseUrl }),
    ]);
    return <DtfVsScreenPrintingClient initialLikeCount={likeCount} initialComments={comments} />;
}
