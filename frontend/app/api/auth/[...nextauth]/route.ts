import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// ─── Environment & Fallbacks ──────────────────────────────────
// Note: NextAuth v4 reads NEXTAUTH_URL from process.env.
// If it's missing on the server, we explicitly set it here to avoid "localhost:3000" redirects.
if (!process.env.NEXTAUTH_URL) {
    process.env.NEXTAUTH_URL = 'https://algorysoft.com';
}

const GOOGLE_ID = process.env.GOOGLE_CLIENT_ID || '***REMOVED_CLIENT_ID***';
const GOOGLE_SECRET = process.env.GOOGLE_CLIENT_SECRET || '***REMOVED_CLIENT_SECRET***';
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || 'algorysoft_secure_secret_key_123456789';
const NEXTAUTH_URL = process.env.NEXTAUTH_URL; // Read from the one we just ensured exists

console.log('[NextAuth] Initializing with config:', {
    hasSecret: !!process.env.NEXTAUTH_SECRET,
    hasUrl: !!process.env.NEXTAUTH_URL,
    urlValue: NEXTAUTH_URL,
    hasGoogleId: !!process.env.GOOGLE_CLIENT_ID,
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

    // Added for debugging
    logger: {
        error(code, metadata) {
            console.error('NextAuth Error Code:', code);
            console.error('NextAuth Error Metadata:', JSON.stringify(metadata, null, 2));
        },
        warn(code) {
            console.warn('NextAuth Warning:', code);
        },
        debug(code, metadata) {
            console.log('NextAuth Debug:', code, metadata);
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
        error: '/api/auth/error', // explicit error page
    },

    session: { strategy: 'jwt' },
    secret: NEXTAUTH_SECRET,
    debug: true,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
