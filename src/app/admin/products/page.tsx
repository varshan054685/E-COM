'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, Pencil, Plus } from 'lucide-react';
import { formatINR } from '@/lib/format';

type ProductRow = {
  id: string; name: string; slug: string; price: number; compareAtPrice: number | null;
  stock: number; status: string; isMadeToOrder: boolean; categoryName: string | null; images: string[]; createdAt: string;
};

export default function AdminProductsPage() {
  const [rows, setRows] = useState<ProductRow[] | null>(null);
  const [q, setQ] = useState('');

  const load = useCallback(async (query: string) => {
    const res = await fetch(`/api/admin/products${query ? `?q=${encodeURIComponent(query)}` : ''}`, { cache: 'no-store' });
    const j = await res.json();
    setRows(j.products ?? []);
  }, []);

  useEffect(() => { load(''); }, [load]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-2xl text-charcoal-900">Products</h2>
        <div className="flex items-center gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load(q)}
            placeholder="Search products…"
            className="h-10 border border-ink/15 bg-ivory-100 px-3 text-sm focus:border-ink/40 focus:outline-none"
          />
          <Link href="/admin/products/new" className="inline-flex h-10 items-center gap-2 bg-ink px-4 text-sm text-ivory-100 hover:bg-charcoal-800">
            <Plus className="h-4 w-4" /> New product
          </Link>
        </div>
      </div>

      {!rows ? (
        <div className="flex justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-gold-600" /></div>
      ) : (
        <div className="overflow-x-auto border border-ink/10">
          <table className="w-full text-sm">
            <thead className="bg-ivory-100 text-left text-xs uppercase tracking-widest text-ink-muted">
              <tr>
                <th className="p-3 font-medium">Piece</th>
                <th className="p-3 font-medium">Price</th>
                <th className="p-3 font-medium">Stock</th>
                <th className="p-3 font-medium">Category</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10 bg-ivory-50">
              {rows.map((p) => (
                <tr key={p.id} className="hover:bg-ivory-100/60">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <span className="relative h-12 w-10 shrink-0 overflow-hidden bg-ivory-200">
                        {p.images[0] ? <Image src={p.images[0]} alt="" fill sizes="40px" className="object-cover" /> : null}
                      </span>
                      <div>
                        <p className="font-medium text-charcoal-900">{p.name}</p>
                        <p className="text-xs text-ink-faint">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    {formatINR(p.price)}
                    {p.compareAtPrice ? <span className="ml-2 text-xs text-ink-faint line-through">{formatINR(p.compareAtPrice)}</span> : null}
                  </td>
                  <td className="p-3">
                    <span className={p.isMadeToOrder ? 'text-ink-muted' : p.stock === 0 ? 'font-medium text-red-700' : p.stock <= 5 ? 'text-amber-700' : ''}>
                      {p.isMadeToOrder ? 'Made to order' : p.stock}
                    </span>
                  </td>
                  <td className="p-3 text-ink-muted">{p.categoryName ?? '—'}</td>
                  <td className="p-3">
                    <span className="text-xs uppercase tracking-widest text-ink-muted">{p.status}</span>
                  </td>
                  <td className="p-3 text-right">
                    <Link href={`/admin/products/${p.id}`} className="inline-flex items-center gap-1.5 text-gold-700 hover:underline">
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}