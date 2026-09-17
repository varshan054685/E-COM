import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[75vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <p className="font-serif text-8xl text-gold-500">404</p>
      <h1 className="mt-4 font-serif text-3xl text-charcoal-900">This page has moved on</h1>
      <p className="mt-3 text-sm text-ink-muted">The piece or page you&apos;re looking for isn&apos;t here anymore — browse the collection instead.</p>
      <Link href="/shop" className="mt-8 inline-flex h-12 items-center px-8 bg-ink text-ivory-100 text-sm">Explore the collection</Link>
    </div>
  );
}