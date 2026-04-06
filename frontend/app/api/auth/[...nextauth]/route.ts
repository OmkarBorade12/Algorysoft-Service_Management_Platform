import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// ─── Environment & Fallbacks ──────────────────────────────────
// CRITICAL: Set NEXTAUTH_URL at module level BEFORE NextAuth initialises.
// On production servers, this MUST also be set in the hosting platform's
// environment variable dashboard (Vercel/Railway/etc.) — .env.local is local-only.
if (!process.env.NEXTAUTH_URL) {
    process.env.NEXTAUTH_URL = 'https://algorysoft.com';
}

const GOOGLE_ID = process.env.GOOGLE_CLIENT_ID ?? '';
const GOOGLE_SECRET = process.env.GOOGLE_CLIENT_SECRET ?? '';
const NEXTAUTH_SECRET =
    process.env.NEXTAUTH_SECRET || 'algorysoft_nextauth_secret_v2_xK9mLpQr7jN3wZeY';

if (!GOOGLE_ID || !GOOGLE_SECRET) {
    console.error(
        '[NextAuth] CRITICAL: Google OAuth credentials are missing. ' +
        'Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your hosting platform env vars.'
    );
}

console.log('[NextAuth] Initialising with config:', {
    hasSecret: !!process.env.NEXTAUTH_SECRET,
    hasUrl: !!process.env.NEXTAUTH_URL,
    urlValue: process.env.NEXTAUTH_URL,
    hasGoogleId: !!GOOGLE_ID,
    hasGoogleSecret: !!GOOGLE_SECRET,
});

export const authOptions: NextAuthOptions = {
    providers: [
        // ─── Google OAuth ─────────────────────────────────────────────
        GoogleProvider({
            clientId: GOOGLE_ID,
            clientSecret: GOOGLE_SECRET,
            authorization: {
                params: {
                    scope: 'openid email profile',
                    access_type: 'offline',
                    prompt: 'consent',
                },
            },
        }),
    ],

    logger: {
        error(code, metadata) {
            // Log the actual error message if available (helps diagnose OAuthSignin issues)
            const err = metadata as Record<string, unknown>;
            console.error('[NextAuth Error]', code, err?.message ?? '', JSON.stringify(err, null, 2));
        },
        warn(code) {
            console.warn('[NextAuth Warning]', code);
        },
        debug(code, metadata) {
            console.log('[NextAuth Debug]', code, metadata);
        },
    },

    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.provider = account.provider;
                token.accessToken = account.access_token;
            }
            return token;
        },
        async session({ session, token }) {
            session.provider = token.provider as string;
            session.accessToken = token.accessToken as string;
            if (session.user) {
                session.user.role = 'customer';
            }
            return session;
        },
    },

    pages: {
        signIn: '/',
        // ⚠️ NOTE: Do NOT set error to '/api/auth/error' — that's the API route itself
        // and causes a redirect loop. Let NextAuth use its default error page instead.
    },

    session: { strategy: 'jwt' },
    secret: NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
