import { NextResponse } from 'next/server';

export async function GET() {
    const envStatus = {
        NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
        NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
        NEXTAUTH_URL_VALUE: process.env.NEXTAUTH_URL || 'NOT_SET',
        GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
        NODE_ENV: process.env.NODE_ENV,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'NOT_SET',
    };

    return NextResponse.json({
        message: "AlgorySoft Environment Diagnostic",
        status: envStatus,
        recommendation: !envStatus.NEXTAUTH_SECRET 
            ? "NEXTAUTH_SECRET is missing. This is MANDATORY for production." 
            : "NextAuth session should be functional if Google keys are valid."
    });
}
