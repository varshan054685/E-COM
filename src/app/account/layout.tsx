import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { getSessionUser } from '@/lib/auth';
import { AccountNav } from '@/components/account/AccountNav';

export const metadata: Metadata = {
  title: 'My account | JGTHS Boutique',
  robots: { index: false, follow: false },
};

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect('/login?next=/account');

  return (
    <main className="mx-auto max-w-shell px-4 sm:px-6 lg:px-10 pt-28 pb-20 min-h-[70vh]">
      <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
        <AccountNav />
        <div className="min-w-0">
          <Suspense fallback={<div className="flex justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-gold-600" /></div>}>
            {children}
          </Suspense>
        </div>
      </div>
    </main>
  );
}