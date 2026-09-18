import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { IMG } from '@/lib/images';
import { SITE } from '@/lib/site';

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  /** Rendered under a divider — typically the "switch mode" link. */
  footer?: ReactNode;
};

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  return (
    <div className="mx-auto grid max-w-[1400px] gap-12 px-4 py-12 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:px-8">
      <div className="flex flex-col justify-center">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="inline-flex items-baseline gap-2">
            <span className="font-serif text-xl font-semibold tracking-[0.16em]">
              {SITE.shortName}
            </span>
            <span className="eyebrow text-[9px] text-gold-600">Aari Couture</span>
          </Link>

          <p className="eyebrow mt-9 text-gold-600">{eyebrow}</p>
          <h1 className="mt-3 font-serif text-3xl leading-tight font-medium text-balance sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{description}</p>

          <div className="mt-8">{children}</div>

          {footer ? <div className="mt-8 border-t border-ink-100 pt-6">{footer}</div> : null}
        </div>
      </div>

      <div className="relative hidden min-h-[34rem] overflow-hidden rounded-2xl bg-ivory-200 lg:block">
        <Image src={IMG.editorial} alt="" fill sizes="50vw" className="object-cover" />
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink-900/85 via-ink-900/25 to-transparent"
          aria-hidden="true"
        />
        <div className="absolute inset-x-0 bottom-0 p-8 text-ivory-50">
          <p className="font-serif text-2xl leading-snug">{SITE.tagline}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-ivory-100/75">
            Save your measurements once and every future order starts from a fit we
            already know works.
          </p>
        </div>
      </div>
    </div>
  );
}
