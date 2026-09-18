import type { Metadata } from 'next';

import { CartView } from '@/components/commerce/cart-view';

export const metadata: Metadata = {
  title: 'Your Bag',
  description: 'Review the pieces in your bag and send your order to the boutique on WhatsApp.',
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return <CartView />;
}
