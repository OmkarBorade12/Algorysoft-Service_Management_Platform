'use client';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/ui/WhatsAppFloat';
import ChatbotWidget from '@/components/ui/ChatbotWidget';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard');

    if (isAdmin) {
        return <main>{children}</main>;
    }

    return (
        <>
            <Header />
            <main>{children}</main>
            <Footer />
            <WhatsAppFloat />
            <ChatbotWidget />
        </>
    );
}
