'use client';

import { useCallback, useEffect, useState } from 'react';
import { Pencil, Plus, Power, Trash2 } from 'lucide-react';
import { formatDate, formatINR } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { Field, Input, Select } from '@/components/ui/Field';
import { Dialog } from '@/components/ui/Dialog';
import { toast } from '@/components/ui/Toaster';

type Coupon = {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrderValue: number;
  maxDiscount: number | null;
  expiresAt: string | null;
  usageLimit: number | null;
  usageCount: number;
  active: boolean;
  createdAt: string;
};

const emptyForm = {
  code: '', type: 'PERCENTAGE', value: '', minOrderValue: '',
  maxDiscount: '', expiresAt: '', usageLimit: '', active: true,
};

export default function AdminCouponsPage() {
  const [rows, setRows] = useState<Coupon[] | null>(null);
  const [editing, setEditing] = useState<Coupon | 'new' | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/coupons', { cache: 'no-store' });
    const j = await res.json();
    setRows(j.coupons ?? []);
  }, []);

  useEffect(() => { load(); }, [load]);

  function openEdit(c: Coupon | 'new') {
    setEditing(c);
    if (c === 'new') {
      setForm(emptyForm);
    } else {
      setForm({
        code: c.code,
        type: c.type,
        value: String(c.value),
        minOrderValue: String(c.minOrderValue),
        maxDiscount: c.maxDiscount != null ? String(c.maxDiscount) : '',
        expiresAt: c.expiresAt ? new Date(c.expiresAt).toISOString().slice(0, 10) : '',
        usageLimit: c.usageLimit != null ? String(c.usageLimit) : '',
        active: c.active,
      });
    }
  }

  async function save() {
    if (!form.code.trim()) { toast('Code is required', { variant: 'error' }); return; }
    setSaving(true);
    const isNew = editing === 'new';
    const res = await fetch(isNew ? '/api/admin/coupons' : `/api/admin/coupons/${(editing as Coupon).id}`, {
      method: isNew ? 'POST' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const j = await res.json();
    setSaving(false);
    if (res.ok) {
      toast(isNew ? 'Coupon created' : 'Coupon saved', { variant: 'success' });
      setEditing(null);
      load();
    } else {
      toast(j.error || 'Could not save coupon', { variant: 'error' });
    }
  }

  async function toggleActive(c: Coupon) {
    const res = await fetch(`/api/admin/coupons/${c.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !c.active }),
    });
    if (res.ok) {
      setRows((prev) => prev?.map((r) => (r.id === c.id ? { ...r, active: !c.active } : r)) ?? null);
    } else {
      toast('Could not update coupon', { variant: 'error' });
    }
  }

  async function remove(c: Coupon) {
    if (!confirm(`Delete coupon ${c.code}?`)) return;
    const res = await fetch(`/api/admin/coupons/${c.id}`, { method: 'DELETE' });
    if (res.ok) {
      setRows((prev) => prev?.filter((r) => r.id !== c.id) ?? null);
      toast('Coupon deleted', { variant: 'success' });
    } else {
      toast('Could not delete coupon', { variant: 'error' });
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="font-serif text-2xl text-charcoal-900">Coupons</h2>
        <Button size="sm" onClick={() => openEdit('new')}><Plus className="h-4 w-4" /> New coupon</Button>
      </div>

      {!rows ? (
        <div className="flex justify-center py-24"><Power className="h-6 w-6 animate-none text-gold-600" /></div>
      ) : rows.length === 0 ? (
        <p className="border border-dashed border-ink/15 bg-ivory-50/50 px-6 py-16 text-center text-sm text-ink-muted">
          No coupons yet.
        </p>
      ) : (
        <div className="overflow-x-auto border border-ink/10">
          <table className="w-full text-sm">
            <thead className="bg-ivory-100 text-left text-xs uppercase tracking-widest text-ink-muted">
              <tr>
                <th className="p-3 font-medium">Code</th>
                <th className="p-3 font-medium">Discount</th>
                <th className="p-3 font-medium">Min order</th>
                <th className="p-3 font-medium">Expires</th>
                <th className="p-3 font-medium">Used</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10 bg-ivory-50">
              {rows.map((c) => (
                <tr key={c.id} className={`hover:bg-ivory-100/60 ${c.active ? '' : 'opacity-55'}`}>
                  <td className="p-3 font-medium tracking-wide text-charcoal-900">{c.code}</td>
                  <td className="p-3 text-ink-muted">
                    {c.type === 'PERCENTAGE' ? `${c.value}%` : formatINR(c.value)}
                    {c.maxDiscount != null && <span className="text-xs text-ink-faint"> · max {formatINR(c.maxDiscount)}</span>}
                  </td>
                  <td className="p-3 text-ink-muted">{c.minOrderValue > 0 ? formatINR(c.minOrderValue) : '—'}</td>
                  <td className="p-3 whitespace-nowrap text-ink-muted">{c.expiresAt ? formatDate(c.expiresAt) : 'Never'}</td>
                  <td className="p-3 text-ink-muted">{c.usageCount}{c.usageLimit ? ` / ${c.usageLimit}` : ''}</td>
                  <td className="p-3">
                    <span className={`text-xs font-semibold uppercase tracking-wide ${c.active ? 'text-emerald-700' : 'text-stone-500'}`}>
                      {c.active ? 'Active' : 'Off'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => toggleActive(c)} aria-label={c.active ? 'Deactivate' : 'Activate'} className="text-ink-muted hover:text-ink">
                        <Power className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => openEdit(c)} aria-label={`Edit ${c.code}`} className="inline-flex items-center text-gold-700 hover:underline">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => remove(c)} aria-label={`Delete ${c.code}`} className="text-red-700 hover:underline">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={editing !== null} onClose={() => setEditing(null)} labelledBy="coupon-dialog-title">
        <div className="space-y-4 p-6">
          <h3 id="coupon-dialog-title" className="font-serif text-2xl text-charcoal-900">
            {editing === 'new' ? 'New coupon' : `Edit ${form.code}`}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Code" required>
              <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="WELCOME10" />
            </Field>
            <Field label="Type">
              <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="PERCENTAGE">Percentage</option>
                <option value="FIXED">Fixed ₹</option>
              </Select>
            </Field>
            <Field label={form.type === 'PERCENTAGE' ? 'Percent off' : 'Amount off (₹)'}>
              <Input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
            </Field>
            <Field label="Max discount (₹, optional)">
              <Input type="number" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} />
            </Field>
            <Field label="Min order (₹)">
              <Input type="number" value={form.minOrderValue} onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })} />
            </Field>
            <Field label="Usage limit">
              <Input type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} placeholder="Unlimited" />
            </Field>
            <Field label="Expires on">
              <Input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
            </Field>
            <label className="flex items-end gap-2 pb-3 text-sm text-charcoal-900">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="accent-charcoal-900" />
              Active
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button isLoading={saving} onClick={save}>Save</Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
