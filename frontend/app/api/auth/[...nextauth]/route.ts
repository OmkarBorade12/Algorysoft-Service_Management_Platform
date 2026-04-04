import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// Environment Check (logs only true/false to server console for security)
console.log('[NextAuth] Env Check:', {
    hasSecret: !!process.env.NEXTAUTH_SECRET,
    hasUrl: !!process.env.NEXTAUTH_URL,
    hasGoogleId: !!process.env.GOOGLE_CLIENT_ID,
});

export const authOptions: NextAuthOptions = {
    providers: [
        // ─── Google OAuth ─────────────────────────────────────────────
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
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
            console.error('NextAuth Error:', code, metadata);
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
        // removing error: '/' so we can see what the actual nextauth error is during debugging
    },

    session: { strategy: 'jwt' },
    secret: process.env.NEXTAUTH_SECRET,
    debug: true,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
