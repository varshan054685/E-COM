'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, Loader2, Trash2, X } from 'lucide-react';
import { formatDateTime } from '@/lib/format';
import { RatingStars } from '@/components/ui/Rating';
import { toast } from '@/components/ui/Toaster';

type ReviewRow = {
  id: string;
  rating: number;
  title: string | null;
  content: string;
  approved: boolean;
  createdAt: string;
  productName: string;
  productSlug: string;
  productImage: string | null;
  userName: string;
};

export default function AdminReviewsPage() {
  const [rows, setRows] = useState<ReviewRow[] | null>(null);
  const [filter, setFilter] = useState('');

  const load = useCallback(async (f: string) => {
    const res = await fetch(`/api/admin/reviews${f ? `?approved=${f}` : ''}`, { cache: 'no-store' });
    const j = await res.json();
    setRows(j.reviews ?? []);
  }, []);

  useEffect(() => { load(filter); }, [filter, load]);

  async function setApproved(id: string, approved: boolean) {
    const res = await fetch(`/api/admin/reviews/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved }),
    });
    if (res.ok) {
      setRows((prev) => prev?.map((r) => (r.id === id ? { ...r, approved } : r)) ?? null);
      toast(approved ? 'Review approved' : 'Review hidden', { variant: 'success' });
    } else {
      toast('Could not update review', { variant: 'error' });
    }
  }

  async function remove(id: string) {
    if (!confirm('Delete this review permanently?')) return;
    const res = await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setRows((prev) => prev?.filter((r) => r.id !== id) ?? null);
      toast('Review deleted', { variant: 'success' });
    } else {
      toast('Could not delete review', { variant: 'error' });
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-2xl text-charcoal-900">Reviews</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter reviews"
          className="h-10 border border-ink/15 bg-ivory-100 px-3 text-sm focus:border-ink/40 focus:outline-none"
        >
          <option value="">All reviews</option>
          <option value="false">Pending approval</option>
          <option value="true">Approved</option>
        </select>
      </div>

      {!rows ? (
        <div className="flex justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-gold-600" /></div>
      ) : rows.length === 0 ? (
        <p className="border border-dashed border-ink/15 bg-ivory-50/50 px-6 py-16 text-center text-sm text-ink-muted">
          No reviews here.
        </p>
      ) : (
        <ul className="space-y-4">
          {rows.map((r) => (
            <li key={r.id} className="border border-ink/10 bg-ivory-50 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 gap-4">
                  {r.productImage && (
                    <span className="relative h-16 w-12 shrink-0 overflow-hidden bg-ivory-200">
                      <Image src={r.productImage} alt="" fill sizes="48px" className="object-cover" />
                    </span>
                  )}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <RatingStars value={r.rating} size={14} />
                      <Link href={`/product/${r.productSlug}`} className="text-sm font-medium text-charcoal-900 hover:underline">
                        {r.productName}
                      </Link>
                      {!r.approved && (
                        <span className="bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800">Pending</span>
                      )}
                    </div>
                    {r.title && <p className="mt-1.5 text-sm font-medium text-charcoal-800">{r.title}</p>}
                    <p className="mt-1 text-sm leading-relaxed text-ink-muted">{r.content}</p>
                    <p className="mt-2 text-xs text-ink-faint">
                      {r.userName} · {formatDateTime(r.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  {r.approved ? (
                    <button
                      onClick={() => setApproved(r.id, false)}
                      className="inline-flex h-9 items-center gap-1.5 border border-ink/15 px-3 text-xs text-ink-muted hover:border-ink/40 hover:text-ink"
                    >
                      <X className="h-3.5 w-3.5" /> Unpublish
                    </button>
                  ) : (
                    <button
                      onClick={() => setApproved(r.id, true)}
                      className="inline-flex h-9 items-center gap-1.5 bg-emerald-600 px-3 text-xs text-white hover:bg-emerald-700"
                    >
                      <Check className="h-3.5 w-3.5" /> Approve
                    </button>
                  )}
                  <button
                    onClick={() => remove(r.id)}
                    aria-label="Delete review"
                    className="flex h-9 w-9 items-center justify-center border border-ink/15 text-red-700 hover:border-red-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
