'use client';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppFloat from '@/components/ui/WhatsAppFloat';
import ChatbotWidget from '@/components/ui/ChatbotWidget';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { useAppSelector } from '@/hooks/useRedux';

// Modals/Sidebars
import CartSidebar from '@/components/cart/CartSidebar';
import WishlistSidebar from '@/components/wishlist/WishlistSidebar';
import LoginModal from '@/components/auth/LoginModal';
import RegisterModal from '@/components/auth/RegisterModal';
import FreeQuoteModal from '@/components/auth/FreeQuoteModal';
import SearchOverlay from '@/components/search/SearchOverlay';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { cartOpen, wishlistOpen, loginModalOpen, registerModalOpen, quoteModalOpen, searchOpen } = useAppSelector((s) => s.ui);
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
            <ScrollToTop />

            {/* Global Overlays & Modals rendered at root to avoid stacking context issues */}
            {cartOpen && <CartSidebar />}
            {wishlistOpen && <WishlistSidebar />}
            {loginModalOpen && <LoginModal />}
            {registerModalOpen && <RegisterModal />}
            {quoteModalOpen && <FreeQuoteModal />}
            {searchOpen && <SearchOverlay />}
        </>
    );
}
