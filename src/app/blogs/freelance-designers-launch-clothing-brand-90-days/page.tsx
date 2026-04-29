import FreelanceDesignerClient from "./FreelanceDesignerClient";
import { getBlogLikeCount, getComments } from "@/lib/blogApi";
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export const metadata = {
    title: "You Design for Other People's Brands Every Day. Here Is How to Launch Your Own in 90 Days.",
    description: "A practical 90-day roadmap for freelance fashion and graphic designers to transition into brand owners using Zero MOQ manufacturing.",
};

export default async function FreelanceDesignerPage() {
    const headersList = await headers();
    const host = headersList.get('x-forwarded-host') ?? headersList.get('host');
    const proto = headersList.get('x-forwarded-proto') ?? 'https';
    const baseUrl = host ? `${proto}://${host}` : undefined;

    const [likeCount, comments] = await Promise.all([
        getBlogLikeCount("freelance-designers-launch-clothing-brand-90-days", { baseUrl }),
        getComments("freelance-designers-launch-clothing-brand-90-days", { baseUrl }),
    ]);
    return <FreelanceDesignerClient initialLikeCount={likeCount} initialComments={comments} />;
}
