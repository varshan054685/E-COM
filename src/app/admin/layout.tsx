import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { AdminNav } from '@/components/admin/AdminNav';

export const metadata: Metadata = {
  title: 'Atelier Console | JGTHS Boutique',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect('/login?next=/admin');
  if (user.role !== 'ADMIN') redirect('/');

  return (
    <main className="mx-auto max-w-shell px-4 sm:px-6 lg:px-10 pt-28 pb-20 min-h-[75vh]">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="editorial-eyebrow mb-2">Atelier console</p>
          <h1 className="font-serif text-4xl text-charcoal-900">JGTHS Admin</h1>
        </div>
        <Link href="/" className="text-sm text-ink-muted hover:text-charcoal-900 underline-offset-4 hover:underline">
          View storefront →
        </Link>
      </header>
      <div className="grid gap-10 lg:grid-cols-[200px_1fr]">
        <AdminNav />
        <div className="min-w-0">{children}</div>
      </div>
    </main>
  );
}