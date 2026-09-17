import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { AppProviders } from '@/components/commerce/providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/commerce/CartDrawer';
import { SearchDialog } from '@/components/layout/SearchDialog';
import { Toaster } from '@/components/ui/Toaster';
import { SITE } from '@/lib/site';
import './globals.css';

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: `${SITE.shortName} — Designer Boutique & Aari Couture`,
    template: `%s | ${SITE.shortName}`,
  },
  description:
    'Designer couture, intricate Aari artistry, and custom creations crafted for your most special moments. Boutique located in Coimbatore, Tamil Nadu.',
  openGraph: {
    siteName: SITE.shortName,
    title: `${SITE.shortName} — Designer Boutique & Aari Couture`,
    description:
      'Designer couture, intricate Aari artistry, and custom creations crafted for your most special moments.',
  },
};

export const viewport: Viewport = {
  themeColor: '#1F1B17',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <AppProviders>
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer />
          <SearchDialog />
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}