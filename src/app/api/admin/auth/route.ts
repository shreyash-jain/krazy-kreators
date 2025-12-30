import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        // Check against env variables (simple auth)
        // Note: In production you should use stronger auth (NextAuth, Supabase Auth, etc)
        const validUsername = process.env.ADMIN_USERNAME;
        const validPassword = process.env.ADMIN_PASSWORD;

        if (!validUsername || !validPassword) {
            return NextResponse.json({ error: 'Server auth not configured' }, { status: 500 });
        }

        if (username === validUsername && password === validPassword) {
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    } catch {
        return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
    }
}
