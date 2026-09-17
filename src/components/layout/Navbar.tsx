'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Menu, Package, Search, ShoppingBag, User } from 'lucide-react';
import { useAuth } from '@/components/commerce/AuthProvider';
import { useCart } from '@/components/commerce/CartProvider';
import { useWishlist } from '@/components/commerce/WishlistProvider';
import { useSearchDialog } from '@/components/layout/SearchDialog';
import { useCartDrawer } from '@/components/commerce/CartDrawer';
import { cn } from '@/lib/utils';

const primaryLinks = [
  { label: 'New Arrivals', href: '/shop?sort=newest' },
  { label: 'Collections', href: '/shop', children: [
    { label: 'Aari Couture', href: '/collections/aari-couture' },
    { label: 'Designer Blouses', href: '/collections/designer-blouses' },
    { label: 'Bridal', href: '/collections/bridal' },
    { label: 'Sarees', href: '/collections/sarees' },
    { label: 'Custom Creations', href: '/collections/custom-couture' },
  ]},
  { label: 'Aari Atelier', href: '/aari-atelier' },
  { label: 'Custom Couture', href: '/custom-couture' },
  { label: 'About', href: '/about' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const { count } = useCart();
  const { ids } = useWishlist();
  const { setOpen: setSearchOpen } = useSearchDialog();
  const { setOpen: setCartOpen } = useCartDrawer();

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 320 && y > lastY);
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setCollectionsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-[100] transition-all duration-300',
        scrolled || hidden || mobileOpen
          ? 'bg-ivory-50/95 backdrop-blur-md border-b border-ink/8'
          : 'bg-transparent border-b border-transparent',
        hidden && !mobileOpen && '-translate-y-full',
      )}
    >
      <nav aria-label="Primary" className="mx-auto max-w-shell px-4 sm:px-6 lg:px-10">
        <div className="flex h-16 sm:h-[72px] items-center justify-between gap-4">
          {/* Mobile menu button */}
          <button
            className="lg:hidden flex h-10 w-10 -ml-2 items-center justify-center text-ink"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo */}
          <Link href="/" className="group flex flex-col leading-none">
            <span className="font-serif text-2xl sm:text-[26px] font-semibold tracking-[0.18em] text-charcoal-900">
              JGTHS
            </span>
            <span className="mt-1 hidden sm:block text-[8.5px] uppercase tracking-widestX text-gold-600">
              Designer Boutique · Aari Couture
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-7">
            {primaryLinks.map((link) =>
              link.children ? (
                <div key={link.label} className="relative"
                  onMouseEnter={() => setCollectionsOpen(true)}
                  onMouseLeave={() => setCollectionsOpen(false)}
                >
                  <Link href={link.href} className="nav-link text-[13px] font-medium uppercase tracking-[0.1em] text-charcoal-800">
                    {link.label}
                  </Link>
                  <AnimatePresence>
                    {collectionsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.18 }}
                        className="absolute left-1/2 -translate-x-1/2 top-full pt-4"
                      >
                        <div className="min-w-56 border border-ink/10 bg-ivory-50 py-3 shadow-lift">
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-6 py-2.5 text-sm text-charcoal-700 hover:bg-ivory-100 hover:text-charcoal-900 transition"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link key={link.href} href={link.href} className="nav-link text-[13px] font-medium uppercase tracking-[0.1em] text-charcoal-800">
                  {link.label}
                </Link>
              ),
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="flex h-10 w-10 lg:h-9 lg:w-10 items-center justify-center text-charcoal-800 hover:bg-ink/5 transition"
            >
              <Search className="h-[19px] w-[19px]" strokeWidth={1.8} />
            </button>
            <Link
              href="/wishlist"
              aria-label={`Wishlist (${ids.length})`}
              className="relative hidden sm:flex h-10 w-10 lg:h-9 lg:w-10 items-center justify-center text-charcoal-800 hover:bg-ink/5 transition"
            >
              <Heart className="h-[19px] w-[19px]" strokeWidth={1.8} />
              {ids.length > 0 && (
                <span className="absolute top-1 right-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-gold-500 px-0.5 text-[9px] font-bold text-charcoal-900">
                  {ids.length}
                </span>
              )}
            </Link>
            <Link
              href={user ? '/account' : '/login'}
              aria-label={user ? 'Account' : 'Sign in'}
              className="hidden sm:flex h-10 w-10 lg:h-9 lg:w-10 items-center justify-center text-charcoal-800 hover:bg-ink/5 transition"
            >
              <User className="h-[19px] w-[19px]" strokeWidth={1.8} />
            </Link>
            <button
              onClick={() => setCartOpen(true)}
              aria-label={`Cart (${count})`}
              className="relative flex h-10 w-10 lg:h-9 lg:w-10 items-center justify-center text-charcoal-800 hover:bg-ink/5 transition"
            >
              <ShoppingBag className="h-[19px] w-[19px]" strokeWidth={1.8} />
              {count > 0 && (
                <span className="absolute top-1 right-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-charcoal-900 px-0.5 text-[9px] font-bold text-ivory-100">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 top-16 z-[105] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-charcoal-900/50" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-y-0 left-0 w-[86%] max-w-sm bg-ivory-50 border-r border-ink/10 p-6 pt-3 overflow-y-auto"
            >
              <div className="space-y-1">
                {primaryLinks.map((link) =>
                  link.children ? (
                    <div key={link.label} className="pt-2">
                      <Link href={link.href} className="block pb-1 font-serif text-2xl text-charcoal-900">
                        {link.label}
                      </Link>
                      <div className="flex flex-col gap-1 pl-1 mt-1 border-l border-ink/10">
                        {link.children.map((child) => (
                          <Link key={child.href} href={child.href} className="py-1.5 text-sm tracking-[0.08em] uppercase text-ink-muted">
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link key={link.href} href={link.href} className="block py-2.5 font-serif text-2xl text-charcoal-900">
                      {link.label}
                    </Link>
                  ),
                )}
              </div>
              <div className="mt-8 flex flex-wrap gap-6 border-t border-ink/10 pt-6">
                <Link href="/wishlist" className="flex items-center gap-2 text-sm text-charcoal-700"><Heart className="h-4 w-4" /> Wishlist {ids.length > 0 && `(${ids.length})`}</Link>
                <Link href={user ? '/account' : '/login'} className="flex items-center gap-2 text-sm text-charcoal-700"><User className="h-4 w-4" /> {user ? 'Account' : 'Sign in'}</Link>
                {user && user.role === 'ADMIN' && <Link href="/admin" className="flex items-center gap-2 text-sm text-charcoal-700"><Package className="h-4 w-4" /> Admin</Link>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}