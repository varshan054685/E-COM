'use client';

import { AuthProvider } from './AuthProvider';
import { CartProvider } from './CartProvider';
import { WishlistProvider } from './WishlistProvider';
import { CartDrawerProvider } from './CartDrawer';
import { SearchDialogProvider } from '@/components/layout/SearchDialog';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <CartDrawerProvider>
            <SearchDialogProvider>{children}</SearchDialogProvider>
          </CartDrawerProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}