'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Package, Ruler, ShoppingBag, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/account', label: 'Overview', icon: User },
  { href: '/account/orders', label: 'Orders', icon: Package },
  { href: '/account/custom-orders', label: 'Creation requests', icon: ShoppingBag },
  { href: '/account/addresses', label: 'Addresses', icon: Heart },
  { href: '/account/measurements', label: 'Measurements', icon: Ruler },
];

export function AccountNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-2 overflow-x-auto border-b border-ink/10 pb-0 mb-8 lg:flex-col lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8 lg:mb-0">
      {LINKS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex shrink-0 items-center gap-2.5 border px-4 py-2.5 text-sm transition lg:border-0 lg:px-0',
              active
                ? 'border-charcoal-900 bg-charcoal-900 text-ivory-100 lg:bg-transparent lg:text-charcoal-900 lg:font-medium'
                : 'border-ink/10 text-ink-muted hover:border-ink/30 lg:hover:text-charcoal-900',
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}