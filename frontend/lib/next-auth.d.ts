// Extend the built-in NextAuth session types so TypeScript knows
// about the extra fields we add in the callbacks (provider, accessToken, role).
import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
    interface Session {
        provider?: string;
        accessToken?: string;
        user: {
            name?: string | null;
            email?: string | null;
            image?: string | null;
            role?: 'customer' | 'admin';
        };
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        provider?: string;
        accessToken?: string;
        providerAccountId?: string;
    }
}
