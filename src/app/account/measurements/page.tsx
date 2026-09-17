'use client';

import { useEffect, useState } from 'react';
import { Loader2, Plus, Ruler, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Field';
import { toast } from '@/components/ui/Toaster';

type Profile = {
  id: string;
  name: string | null;
  bust: string | null;
  waist: string | null;
  hip: string | null;
  shoulder: string | null;
  sleeveLength: string | null;
  armhole: string | null;
  blouseLength: string | null;
  frontNeckDepth: string | null;
  backNeckDepth: string | null;
  notes: string | null;
  isDefault: boolean;
};

const FIELDS: Array<{ key: keyof Profile; label: string }> = [
  { key: 'bust', label: 'Bust' },
  { key: 'waist', label: 'Waist' },
  { key: 'hip', label: 'Hip' },
  { key: 'shoulder', label: 'Shoulder' },
  { key: 'sleeveLength', label: 'Sleeve length' },
  { key: 'armhole', label: 'Armhole' },
  { key: 'blouseLength', label: 'Blouse length' },
  { key: 'frontNeckDepth', label: 'Front neck depth' },
  { key: 'backNeckDepth', label: 'Back neck depth' },
];

const emptyForm: Record<string, string> = { name: '', notes: '' };
FIELDS.forEach((f) => { emptyForm[f.key as string] = ''; });

export default function AccountMeasurementsPage() {
  const [profiles, setProfiles] = useState<Profile[] | null>(null);
  const [form, setForm] = useState<Record<string, string>>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  function load() {
    fetch('/api/measurements', { cache: 'no-store' })
      .then((r) => r.json())
      .then((j) => setProfiles(j.profiles ?? []))
      .catch(() => setProfiles([]));
  }
  useEffect(load, []);

  async function save() {
    if (!form.name.trim()) {
      toast('Please name this profile', { variant: 'error' });
      return;
    }
    setSaving(true);
    const res = await fetch('/api/measurements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const j = await res.json();
    setSaving(false);
    if (res.ok) {
      toast('Measurement profile saved', { variant: 'success' });
      setForm(emptyForm);
      setShowForm(false);
      load();
    } else {
      toast(j.error || 'Could not save profile', { variant: 'error' });
    }
  }

  async function remove(id: string) {
    await fetch(`/api/measurements/${id}`, { method: 'DELETE' });
    toast('Profile removed', { variant: 'info' });
    load();
  }

  return (
    <div>
      <header className="mb-8 flex items-center justify-between">
        <div>
          <p className="editorial-eyebrow mb-2">My account</p>
          <h1 className="font-serif text-4xl text-charcoal-900">Measurements</h1>
          <p className="mt-2 text-sm text-ink-muted max-w-md">Save your measurements once — we'll reuse them for every blouse and creation, so the fit is always yours.</p>
        </div>
        <Button variant="outline" onClick={() => setShowForm((v) => !v)}>
          <Plus className="h-4 w-4" /> Add profile
        </Button>
      </header>

      {showForm && (
        <div className="mb-8 border border-ink/10 bg-ivory-50 p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Input label="Profile name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. My bridal blouse" />
            {FIELDS.map((f) => (
              <Input
                key={f.key as string}
                label={`${f.label} (in)`}
                value={form[f.key as string] ?? ''}
                onChange={(e) => setForm({ ...form, [f.key as string]: e.target.value })}
              />
            ))}
            <Textarea label="Notes (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="sm:col-span-2 lg:col-span-3" />
          </div>
          <div className="mt-5 flex gap-3">
            <Button isLoading={saving} onClick={save}>Save profile</Button>
            <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {!profiles ? (
        <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-gold-600" /></div>
      ) : profiles.length === 0 ? (
        <div className="border border-dashed border-ink/15 p-10 text-center">
          <Ruler className="mx-auto h-8 w-8 text-ink-faint" />
          <p className="mt-4 text-sm text-ink-muted">No measurement profiles yet.</p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {profiles.map((p) => (
            <li key={p.id} className="border border-ink/10 bg-ivory-50 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-charcoal-900">{p.name}</p>
                {p.isDefault && <span className="text-[10px] uppercase tracking-widest text-gold-700">Default</span>}
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[13px]">
                {FIELDS.filter((f) => p[f.key]).map((f) => (
                  <div key={f.key as string} className="flex justify-between">
                    <dt className="text-ink-muted">{f.label}</dt>
                    <dd className="text-charcoal-900">{p[f.key]}″</dd>
                  </div>
                ))}
              </dl>
              {p.notes && <p className="mt-3 text-xs text-ink-muted italic">{p.notes}</p>}
              <button onClick={() => remove(p.id)} className="mt-4 inline-flex items-center gap-1.5 text-xs text-red-700 hover:underline">
                <Trash2 className="h-3.5 w-3.5" /> Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}