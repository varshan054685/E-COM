'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { formatINR } from '@/lib/format';

type InventoryRow = {
  id: string;
  name: string;
  sku: string | null;
  stock: number;
  lowStockThreshold: number;
  low: boolean;
  inCarts: number;
  inWishlists: number;
  sold: number;
};

export default function AdminInventoryPage() {
  const [rows, setRows] = useState<InventoryRow[] | null>(null);
  const [onlyLow, setOnlyLow] = useState(false);

  useEffect(() => {
    fetch('/api/admin/inventory', { cache: 'no-store' })
      .then((r) => r.json())
      .then((j) => setRows(j.inventory ?? []))
      .catch(() => setRows([]));
  }, []);

  const visible = rows?.filter((r) => (onlyLow ? r.low : true)) ?? [];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-2xl text-charcoal-900">Inventory</h2>
        <label className="flex items-center gap-2 text-sm text-charcoal-900">
          <input type="checkbox" checked={onlyLow} onChange={(e) => setOnlyLow(e.target.checked)} className="accent-charcoal-900" />
          Low stock only
        </label>
      </div>

      {!rows ? (
        <div className="flex justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-gold-600" /></div>
      ) : visible.length === 0 ? (
        <p className="border border-dashed border-ink/15 bg-ivory-50/50 px-6 py-16 text-center text-sm text-ink-muted">
          {onlyLow ? 'All stocked up.' : 'No active products yet.'}
        </p>
      ) : (
        <div className="overflow-x-auto border border-ink/10">
          <table className="w-full text-sm">
            <thead className="bg-ivory-100 text-left text-xs uppercase tracking-widest text-ink-muted">
              <tr>
                <th className="p-3 font-medium">Piece</th>
                <th className="p-3 font-medium">SKU</th>
                <th className="p-3 font-medium">Stock</th>
                <th className="p-3 font-medium">Sold (paid)</th>
                <th className="p-3 font-medium">In carts</th>
                <th className="p-3 font-medium">In wishlists</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10 bg-ivory-50">
              {visible.map((r) => (
                <tr key={r.id} className="hover:bg-ivory-100/60">
                  <td className="p-3">
                    <Link href={`/admin/products/${r.id}`} className="font-medium text-charcoal-900 hover:underline">
                      {r.name}
                    </Link>
                  </td>
                  <td className="p-3 text-xs text-ink-faint">{r.sku ?? '—'}</td>
                  <td className="p-3">
                    <span className={r.stock === 0 ? 'font-medium text-red-700' : r.low ? 'text-amber-700' : 'text-charcoal-900'}>
                      {r.stock}
                    </span>
                    {r.low && <span className="ml-2 text-[11px] uppercase tracking-wide text-amber-700">Low</span>}
                  </td>
                  <td className="p-3 text-ink-muted">{r.sold}</td>
                  <td className="p-3 text-ink-muted">{r.inCarts}</td>
                  <td className="p-3 text-ink-muted">{r.inWishlists}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-4 text-xs leading-relaxed text-ink-faint">
        Stock updates automatically: reserved when a customer checks out, restored if an order
        is cancelled or payment fails. Made-to-order pieces are excluded — they are produced on
        request and don&apos;t hold shelf stock.
      </p>
    </div>
  );
}
