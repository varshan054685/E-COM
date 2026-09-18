import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { NAV_LINKS } from '@/lib/site';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center sm:py-32">
      <p className="eyebrow text-gold-600">Error 404</p>
      <h1 className="mt-4 font-serif text-4xl leading-tight font-medium text-balance sm:text-5xl">
        This piece has been re-hung elsewhere
      </h1>
      <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
        The page you were looking for is no longer here. It may have sold out, or the
        link may have changed.
      </p>

      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg" variant="gold">
          <Link href="/shop">
            <Search className="size-4" />
            Browse the collection
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/">
            Back to home
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <nav aria-label="Suggested pages" className="mt-12 w-full border-t border-ink-100 pt-8">
        <p className="eyebrow mb-4 text-ink-300">Popular pages</p>
        <ul className="flex flex-wrap justify-center gap-x-7 gap-y-3">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-ink-500 transition-colors hover:text-foreground hover:underline hover:underline-offset-4"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
