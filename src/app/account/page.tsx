import type { Metadata } from 'next';

import { AccountView } from '@/components/account/account-view';

export const metadata: Metadata = {
  title: 'Your Account',
  description:
    'Your saved measurements, bag and boutique contact details — stored privately on this device.',
  robots: { index: false, follow: true },
};

export default function AccountPage() {
  return <AccountView />;
}
