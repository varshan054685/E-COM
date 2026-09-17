'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3, Boxes, ClipboardList, Component, Package, Scissors, ShoppingBag, Tag, Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const LINKS: ReadonlyArray<{
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
}> = [
  { href: '/admin', label: 'Dashboard', icon: BarChart3, exact: true },
  { href: '/admin/orders', label: 'Orders', icon: Package },
  { href: '/admin/custom-orders', label: 'Create & Requests', icon: Scissors },
  { href: '/admin/products', label: 'Products', icon: Boxes },
  { href: '/admin/categories', label: 'Categories', icon: Component },
  { href: '/admin/inventory', label: 'Inventory', icon: ClipboardList },
  { href: '/admin/reviews', label: 'Reviews', icon: ShoppingBag },
  { href: '/admin/coupons', label: 'Coupons', icon: Tag },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/content', label: 'Content', icon: ClipboardList },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-2 overflow-x-auto border-b border-ink/10 pb-0 lg:flex-col lg:border-b-0 lg:border-r lg:pr-6">
      {LINKS.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex shrink-0 items-center gap-2.5 border px-3 py-2 text-[13px] transition lg:border-0 lg:px-0 lg:py-2',
              active
                ? 'border-charcoal-900 bg-charcoal-900 text-ivory-100 lg:border-0 lg:bg-transparent lg:text-charcoal-900 lg:font-semibold'
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