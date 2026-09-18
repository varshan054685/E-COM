import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';
import { PageHero } from '@/components/layout/page-hero';
import { Button } from '@/components/ui/button';
import { POLICIES, getAllPolicySlugs, getPolicy } from '@/lib/policies';
import { WHATSAPP_DEFAULT_MESSAGE, whatsappLink } from '@/lib/site';

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPolicySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const policy = getPolicy(slug);

  if (!policy) return { title: 'Policy not found' };

  return { title: policy.title, description: policy.summary };
}

export default async function PolicyPage({ params }: PageProps) {
  const { slug } = await params;
  const policy = getPolicy(slug);

  if (!policy) notFound();

  const updated = new Date(policy.updated).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <PageHero eyebrow="Policies" title={policy.title} description={policy.summary}>
        <p className="mt-6 text-xs text-muted-foreground">Last updated {updated}</p>
      </PageHero>

      <div className="mx-auto max-w-[1400px] px-4 py-14 sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[15rem_1fr] lg:gap-16">
          {/* Policy switcher */}
          <nav aria-label="Policies" className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow mb-4 text-ink-400">All policies</p>
            <ul className="flex flex-col gap-1">
              {POLICIES.map((entry) => (
                <li key={entry.slug}>
                  <Link
                    href={`/policies/${entry.slug}`}
                    aria-current={entry.slug === policy.slug ? 'page' : undefined}
                    className={
                      entry.slug === policy.slug
                        ? 'block rounded-md bg-primary/6 px-3 py-2 text-sm font-medium text-primary'
                        : 'block rounded-md px-3 py-2 text-sm text-ink-500 transition-colors hover:bg-muted hover:text-foreground'
                    }
                  >
                    {entry.title}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-xl border border-ink-100 bg-card p-5">
              <p className="text-sm font-medium">Still have a question?</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Our team replies within a few hours during studio time.
              </p>
              <Button asChild variant="whatsapp" size="sm" className="mt-4 w-full">
                <a
                  href={whatsappLink(WHATSAPP_DEFAULT_MESSAGE)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon className="size-3.5" />
                  WhatsApp us
                </a>
              </Button>
            </div>
          </nav>

          {/* Content */}
          <article className="flex max-w-3xl flex-col gap-10">
            {policy.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-serif text-2xl leading-snug font-medium">
                  {section.heading}
                </h2>
                <div className="mt-4 flex flex-col gap-4">
                  {section.body.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-sm leading-relaxed text-muted-foreground sm:text-base"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </article>
        </div>
      </div>
    </>
  );
}
