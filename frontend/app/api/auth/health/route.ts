import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        time: new Date().toISOString(),
        hasGoogleId: !!process.env.GOOGLE_CLIENT_ID,
        googleIdLength: process.env.GOOGLE_CLIENT_ID?.length || 0,
        googleIdStart: process.env.GOOGLE_CLIENT_ID?.substring(0, 5) || 'none',
        hasGoogleSecret: !!process.env.GOOGLE_CLIENT_SECRET,
        googleSecretLength: process.env.GOOGLE_CLIENT_SECRET?.length || 0,
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
        nextAuthUrl: process.env.NEXTAUTH_URL,
    });
}
