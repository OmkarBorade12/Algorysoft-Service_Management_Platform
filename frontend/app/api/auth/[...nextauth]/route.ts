import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const hasGoogle =
    !!process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id_here' &&
    !!process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_CLIENT_SECRET !== 'your_google_client_secret_here';

export const authOptions: NextAuthOptions = {
    providers: [
        // ─── Google OAuth ─────────────────────────────────────────────
        ...(hasGoogle
            ? [
                  GoogleProvider({
                      clientId: process.env.GOOGLE_CLIENT_ID!,
                      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
                      authorization: {
                          params: {
                              scope: 'openid email profile',
                              access_type: 'offline',
                              prompt: 'consent',
                          },
                      },
                  }),
              ]
            : []),
    ],

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
        error: '/',
    },

    session: { strategy: 'jwt' },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
