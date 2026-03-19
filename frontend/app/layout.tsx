import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';
import ClientLayoutWrapper from '@/components/layout/ClientLayoutWrapper';

export const metadata: Metadata = {
  title: 'AlgorySoft – Business Web Solutions | Custom Websites for Businesses',
  description:
    'Professional business websites, e-commerce stores, SaaS dashboards, and web applications built for Indian businesses. Fast delivery, SEO-first, 1-year free support.',
  keywords: 'business website development, e-commerce website India, custom web design, SaaS dashboard, corporate website, landing page design, web application development Bangalore',
  openGraph: {
    title: 'AlgorySoft – Business Web Solutions',
    description: '500+ websites delivered. Custom e-commerce, corporate, SaaS & landing page solutions for businesses across India.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#6db03a" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
