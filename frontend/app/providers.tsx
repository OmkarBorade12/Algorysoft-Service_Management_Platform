'use client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';
import { Toaster } from 'react-hot-toast';
import { SessionProvider, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { setUser } from '@/store/slices/authSlice';

/**
 * Syncs a NextAuth Google session into Redux state so the rest of the
 * app (header avatar, auth guard, etc.) recognises the logged-in user.
 */
function GoogleAuthSync() {
    const { data: session, status } = useSession();
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

    useEffect(() => {
        if (status === 'authenticated' && session?.user && !isAuthenticated) {
            dispatch(
                setUser({
                    id: Date.now(),
                    name: session.user.name || 'Google User',
                    email: session.user.email || '',
                    avatar: session.user.image || '',
                    role: 'customer',
                })
            );
        }
    }, [status, session, isAuthenticated, dispatch]);

    return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <GoogleAuthSync />
                    {children}
                    <Toaster
                        position="bottom-right"
                        toastOptions={{
                            style: {
                                background: '#132b20',
                                color: '#e8f5e9',
                                border: '1px solid rgba(82, 183, 136, 0.3)',
                                borderRadius: '12px',
                                fontFamily: 'Inter, sans-serif',
                            },
                            success: {
                                iconTheme: { primary: '#52b788', secondary: 'white' },
                            },
                            error: {
                                iconTheme: { primary: '#ef4444', secondary: 'white' },
                            },
                        }}
                    />
                </PersistGate>
            </Provider>
        </SessionProvider>
    );
}
