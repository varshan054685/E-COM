'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, Search } from 'lucide-react';
import { formatDate, formatINR } from '@/lib/format';

type CustomerRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
  orderCount: number;
  customOrderCount: number;
  totalSpent: number;
};

export default function AdminCustomersPage() {
  const [rows, setRows] = useState<CustomerRow[] | null>(null);
  const [q, setQ] = useState('');

  const load = useCallback(async (query: string) => {
    const res = await fetch(`/api/admin/customers${query ? `?q=${encodeURIComponent(query)}` : ''}`, { cache: 'no-store' });
    const j = await res.json();
    setRows(j.customers ?? []);
  }, []);

  useEffect(() => { load(''); }, [load]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-2xl text-charcoal-900">Customers</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load(q)}
            placeholder="Search customers…"
            className="h-10 w-56 border border-ink/15 bg-ivory-100 pl-9 pr-3 text-sm focus:border-ink/40 focus:outline-none"
          />
        </div>
      </div>

      {!rows ? (
        <div className="flex justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-gold-600" /></div>
      ) : rows.length === 0 ? (
        <p className="border border-dashed border-ink/15 bg-ivory-50/50 px-6 py-16 text-center text-sm text-ink-muted">
          No customers found.
        </p>
      ) : (
        <div className="overflow-x-auto border border-ink/10">
          <table className="w-full text-sm">
            <thead className="bg-ivory-100 text-left text-xs uppercase tracking-widest text-ink-muted">
              <tr>
                <th className="p-3 font-medium">Customer</th>
                <th className="p-3 font-medium">Joined</th>
                <th className="p-3 font-medium">Orders</th>
                <th className="p-3 font-medium">Custom</th>
                <th className="p-3 font-medium">Total spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10 bg-ivory-50">
              {rows.map((c) => (
                <tr key={c.id} className="hover:bg-ivory-100/60">
                  <td className="p-3">
                    <Link href={`/admin/customers/${c.id}`} className="font-medium text-charcoal-900 hover:underline">
                      {c.name}
                    </Link>
                    <p className="text-xs text-ink-faint">{c.email}{c.phone ? ` · ${c.phone}` : ''}</p>
                  </td>
                  <td className="p-3 whitespace-nowrap text-ink-muted">{formatDate(c.createdAt)}</td>
                  <td className="p-3 text-ink-muted">{c.orderCount}</td>
                  <td className="p-3 text-ink-muted">{c.customOrderCount}</td>
                  <td className="p-3 font-medium text-charcoal-900">{formatINR(c.totalSpent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
