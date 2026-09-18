'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Search, ShoppingBag, Truck, User } from 'lucide-react';

import { SearchDialog } from '@/components/layout/search-dialog';
import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { NAV_LINKS, SITE, WHATSAPP_DEFAULT_MESSAGE, whatsappLink } from '@/lib/site';
import { useHydrated } from '@/lib/use-hydrated';
import { cn } from '@/lib/utils';
import { useCartCount, useCartStore } from '@/store/cart';

const iconButton =
  'relative rounded-full p-2.5 text-ink-700 transition-colors duration-200 hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring';

export function Navbar() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const count = useCartCount();
  const openCart = useCartStore((state) => state.openCart);

  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {/* Announcement strip — scrolls away, the nav below stays pinned. */}
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-[1400px] items-center justify-center gap-2 px-4 py-2.5 text-center">
          <Truck className="size-3.5 shrink-0 opacity-80" aria-hidden="true" />
          <p className="text-[10px] tracking-[0.16em] uppercase sm:text-[11px]">
            Complimentary shipping above ₹15,000 · Studio appointments in {SITE.city}
          </p>
        </div>
      </div>

      <header
        className={cn(
          'sticky top-0 z-40 border-b border-ink-100 bg-background/80 backdrop-blur-md transition-shadow duration-300',
          scrolled && 'shadow-soft',
        )}
      >
        <nav
          aria-label="Main navigation"
          className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-3 px-4 sm:h-18 lg:px-8"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-baseline gap-2 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            <span className="font-serif text-xl font-semibold tracking-[0.16em] sm:text-2xl">
              {SITE.shortName}
            </span>
            <span className="eyebrow hidden text-[9px] text-gold-600 sm:inline">Aari Couture</span>
          </Link>

          {/* Centred links */}
          <ul className="hidden items-center gap-9 lg:flex">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative py-2 text-sm tracking-wide transition-colors duration-200',
                      active ? 'text-foreground' : 'text-ink-500 hover:text-foreground',
                    )}
                  >
                    {link.label}
                    {active ? (
                      <span className="absolute inset-x-0 -bottom-0.5 h-px bg-gold-400" />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className={iconButton}
              aria-label="Search products"
            >
              <Search className="size-5" />
            </button>

            <Link href="/account" className={cn(iconButton, 'hidden sm:inline-flex')} aria-label="Your account">
              <User className="size-5" />
            </Link>

            <button
              type="button"
              onClick={openCart}
              className={iconButton}
              aria-label={
                hydrated && count > 0 ? `Open bag, ${count} items` : 'Open shopping bag'
              }
            >
              <ShoppingBag className="size-5" />
              {hydrated && count > 0 ? (
                <span className="absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground tabular-nums">
                  {count > 9 ? '9+' : count}
                </span>
              ) : null}
            </button>

            {/* Mobile menu */}
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <button type="button" className={cn(iconButton, 'lg:hidden')} aria-label="Open menu">
                  <Menu className="size-5" />
                </button>
              </SheetTrigger>
              <SheetContent className="max-w-xs">
                <div className="flex h-full flex-col">
                  <div className="border-b border-ink-100 px-6 py-5 pr-16">
                    <SheetTitle className="font-serif text-lg tracking-[0.16em]">
                      {SITE.shortName}
                    </SheetTitle>
                    <p className="eyebrow mt-1 text-[9px] text-gold-600">Aari Couture</p>
                  </div>

                  <ul className="flex flex-col px-2 py-4">
                    {[...NAV_LINKS, { label: 'Your Account', href: '/account' }].map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setMenuOpen(false)}
                          className={cn(
                            'block rounded-lg px-4 py-3.5 font-serif text-xl transition-colors',
                            isActive(link.href)
                              ? 'text-foreground'
                              : 'text-ink-500 hover:bg-muted hover:text-foreground',
                          )}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto border-t border-ink-100 p-6">
                    <a
                      href={whatsappLink(WHATSAPP_DEFAULT_MESSAGE)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-md bg-[#25D366] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#1DA851]"
                    >
                      <WhatsAppIcon className="size-4" />
                      Inquire on WhatsApp
                    </a>
                    <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                      {SITE.address}, {SITE.city} {SITE.pincode}
                      <br />
                      {SITE.phoneDisplay}
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
