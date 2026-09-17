'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, Plus, ShoppingBag } from 'lucide-react';
import { formatINR } from '@/lib/format';
import { CUSTOM_ORDER_STATUS_LABELS } from '@/lib/custom-order';
import { Badge } from '@/components/ui/Badge';

type Request = {
  orderNumber: string;
  creationType: string;
  status: string;
  paymentStatus: string;
  quoteAmount: number | null;
  createdAt: string;
  deadline: string | null;
  image: string | null;
};

export default function AccountCustomOrdersPage() {
  const [requests, setRequests] = useState<Request[] | null>(null);

  useEffect(() => {
    fetch('/api/custom-orders', { cache: 'no-store' })
      .then((r) => r.json())
      .then((j) => setRequests(j.requests ?? []))
      .catch(() => setRequests([]));
  }, []);

  if (!requests) {
    return <div className="flex justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-gold-600" /></div>;
  }

  return (
    <div>
      <header className="mb-8 flex items-center justify-between">
        <div>
          <p className="editorial-eyebrow mb-2">My account</p>
          <h1 className="font-serif text-4xl text-charcoal-900">Creation requests</h1>
        </div>
        <Link href="/custom-couture" className="inline-flex h-11 items-center bg-ink px-6 text-sm text-ivory-100 hover:bg-charcoal-800">
          <Plus className="h-4 w-4 mr-1.5" /> New request
        </Link>
      </header>

      {requests.length === 0 ? (
        <div className="border border-dashed border-ink/15 p-10 text-center">
          <ShoppingBag className="mx-auto h-8 w-8 text-ink-faint" />
          <p className="mt-4 text-sm text-ink-muted">You haven't started a custom couture request yet.</p>
          <Link href="/custom-couture" className="mt-4 inline-flex h-11 items-center bg-ink px-6 text-sm text-ivory-100">Begin a creation</Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {requests.map((r) => (
            <li key={r.orderNumber} className="flex flex-col gap-4 border border-ink/10 bg-ivory-50 p-5 sm:flex-row sm:items-center">
              <span className="relative h-20 w-16 shrink-0 overflow-hidden bg-ivory-200">
                {r.image ? <Image src={r.image} alt="" fill sizes="64px" className="object-cover" /> : null}
              </span>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-medium text-charcoal-900">{r.orderNumber}</p>
                  <Badge tone="stone">{CUSTOM_ORDER_STATUS_LABELS[r.status] ?? r.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-charcoal-800">{r.creationType}</p>
                <p className="mt-0.5 text-xs text-ink-faint">Requested {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              {r.quoteAmount != null && (
                <div className="text-right">
                  <p className="text-xs text-ink-muted">Quote</p>
                  <p className="font-medium text-charcoal-900">{formatINR(r.quoteAmount)}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <p className="mt-10 text-xs text-ink-faint">Quotes and status updates are also shared on WhatsApp. Have a question? Message us anytime.</p>
    </div>
  );
}