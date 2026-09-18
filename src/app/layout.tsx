import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';

import { CartDrawer } from '@/components/commerce/cart-drawer';
import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import { WhatsAppFab } from '@/components/layout/whatsapp-fab';
import { SITE } from '@/lib/site';

import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

function getSiteUrl(): URL {
  const custom = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (custom) {
    try {
      return new URL(custom.startsWith('http') ? custom : `https://${custom}`);
    } catch {
      // Fall through if invalid
    }
  }

  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProd) {
    return new URL(`https://${vercelProd}`);
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    return new URL(`https://${vercelUrl}`);
  }

  return new URL('http://localhost:3000');
}

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: `${SITE.name}`,
    template: `%s | ${SITE.shortName}`,
  },
  description: SITE.description,
  keywords: [
    'Aari work blouse',
    'designer boutique Coimbatore',
    'bridal blouse',
    'hand-painted fabrics',
    'kids party wear',
    'custom couture',
  ],
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
  },
};

export const viewport: Viewport = {
  themeColor: '#064e3b',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
        >
          Skip to content
        </a>

        <Navbar />
        <main id="main" className="w-full max-w-full overflow-x-clip">
          {children}
        </main>
        <Footer />
        <CartDrawer />
        <WhatsAppFab />
      </body>
    </html>
  );
}
