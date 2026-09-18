'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Store, Users } from 'lucide-react';

import { cn } from '@/lib/utils';
import { SITE } from '@/lib/site';

const NAV = [
  { href: '/admin', label: 'Overview', Icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', Icon: Package },
  { href: '/admin/orders', label: 'Orders & Tailoring', Icon: ShoppingCart },
  { href: '/admin/users', label: 'Customers', Icon: Users },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  return (
    <div className="mx-auto flex max-w-[1600px] flex-col gap-8 px-4 py-8 lg:flex-row lg:gap-10 lg:px-8 lg:py-10">
      {/* Sidebar */}
      <aside className="lg:w-60 lg:shrink-0">
        <div className="lg:sticky lg:top-28">
          <div className="flex items-center justify-between gap-3 lg:block">
            <div>
              <p className="eyebrow text-gold-600">Admin</p>
              <p className="mt-1 font-serif text-xl leading-tight">{SITE.shortName}</p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground lg:mt-4"
            >
              <Store className="size-3.5" />
              View storefront
            </Link>
          </div>

          <nav aria-label="Admin sections" className="mt-6">
            <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
              {NAV.map(({ href, label, Icon }) => {
                const active = isActive(href);
                return (
                  <li key={href} className="shrink-0 lg:shrink">
                    <Link
                      href={href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm whitespace-nowrap transition-colors',
                        active
                          ? 'bg-primary/8 font-medium text-primary'
                          : 'text-ink-500 hover:bg-muted hover:text-foreground',
                      )}
                    >
                      <Icon className="size-4 shrink-0" aria-hidden="true" />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
