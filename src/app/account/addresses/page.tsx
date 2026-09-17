'use client';

import { useEffect, useState } from 'react';
import { Loader2, MapPin, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Field';
import { toast } from '@/components/ui/Toaster';

type Address = {
  id: string;
  label: string | null;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

const empty = {
  label: '', fullName: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '',
};

export default function AccountAddressesPage() {
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [form, setForm] = useState(empty);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  function load() {
    fetch('/api/addresses', { cache: 'no-store' })
      .then((r) => r.json())
      .then((j) => setAddresses(Array.isArray(j) ? j : []))
      .catch(() => setAddresses([]));
  }
  useEffect(load, []);

  async function save() {
    setSaving(true);
    const res = await fetch('/api/addresses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const j = await res.json();
    setSaving(false);
    if (res.ok) {
      toast('Address saved', { variant: 'success' });
      setForm(empty);
      setShowForm(false);
      load();
    } else {
      const first = j.errors ? Object.values(j.errors)[0] : j.error;
      toast(String(first || 'Could not save address'), { variant: 'error' });
    }
  }

  async function makeDefault(id: string) {
    await fetch(`/api/addresses/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isDefault: true }) });
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/addresses/${id}`, { method: 'DELETE' });
    toast('Address removed', { variant: 'info' });
    load();
  }

  return (
    <div>
      <header className="mb-8 flex items-center justify-between">
        <div>
          <p className="editorial-eyebrow mb-2">My account</p>
          <h1 className="font-serif text-4xl text-charcoal-900">Addresses</h1>
        </div>
        <Button variant="outline" onClick={() => setShowForm((v) => !v)}>
          <Plus className="h-4 w-4" /> Add address
        </Button>
      </header>

      {showForm && (
        <div className="mb-8 border border-ink/10 bg-ivory-50 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Label (optional)" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Home / Office" />
            <Input label="Full name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input label="Pincode" value={form.pincode} maxLength={6} onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, '') })} />
            <Input label="Address line 1" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} className="sm:col-span-2" />
            <Input label="Address line 2" value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} className="sm:col-span-2" />
            <Input label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <Input label="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
          </div>
          <div className="mt-5 flex gap-3">
            <Button isLoading={saving} onClick={save}>Save address</Button>
            <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {!addresses ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-gold-600" /></div>
      ) : addresses.length === 0 ? (
        <div className="border border-dashed border-ink/15 p-10 text-center">
          <MapPin className="mx-auto h-8 w-8 text-ink-faint" />
          <p className="mt-4 text-sm text-ink-muted">No saved addresses yet.</p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <li key={a.id} className="border border-ink/10 bg-ivory-50 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-charcoal-900">{a.label || 'Address'}</p>
                {a.isDefault ? <span className="text-[10px] uppercase tracking-widest text-gold-700">Default</span> : (
                  <button onClick={() => makeDefault(a.id)} className="text-[11px] text-ink-muted hover:text-charcoal-900">Set default</button>
                )}
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
                {a.fullName}<br />{a.line1}{a.line2 ? `, ${a.line2}` : ''}<br />{a.city}, {a.state} — {a.pincode}<br />{a.phone}
              </p>
              <button onClick={() => remove(a.id)} className="mt-4 inline-flex items-center gap-1.5 text-xs text-red-700 hover:underline">
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}