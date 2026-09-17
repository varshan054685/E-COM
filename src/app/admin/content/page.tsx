'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Field, Input, Textarea } from '@/components/ui/Field';
import { toast } from '@/components/ui/Toaster';

type ContentRow = { id: string; key: string; value: string; updatedAt: string };

const LABELS: Record<string, string> = {
  'hero.headline': 'Hero headline',
  'hero.subtext': 'Hero supporting text',
  'hero.image': 'Hero image URL',
  'aari.image': 'Aari story image URL',
  'store.hours': 'Store hours',
  'whatsapp.message': 'Default WhatsApp message',
};

const HINTS: Record<string, string> = {
  'hero.headline': 'Shown large on the homepage hero.',
  'hero.image': 'Used when no image is set; replace with your own photography URL.',
};

export default function AdminContentPage() {
  const [rows, setRows] = useState<ContentRow[] | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/content', { cache: 'no-store' });
    const j = await res.json();
    const content: ContentRow[] = j.content ?? [];
    setRows(content);
    setValues(Object.fromEntries(content.map((c) => [c.key, c.value])));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function save() {
    setSaving(true);
    const entries = Object.entries(values).map(([key, value]) => ({ key, value }));
    const res = await fetch('/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ entries }),
    });
    const j = await res.json();
    setSaving(false);
    if (res.ok) {
      toast(`Saved ${j.updated ?? entries.length} content setting(s)`, { variant: 'success' });
    } else {
      toast(j.error || 'Could not save content', { variant: 'error' });
    }
  }

  if (!rows) {
    return <div className="flex justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-gold-600" /></div>;
  }

  const known = rows.filter((r) => LABELS[r.key]);
  const other = rows.filter((r) => !LABELS[r.key] && !r.key.startsWith('newsletter:') && !r.key.startsWith('contact:'));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl text-charcoal-900">Content</h2>
          <p className="mt-1 text-sm text-ink-muted">Homepage hero, story images, and boutique details shown on the storefront.</p>
        </div>
        <Button onClick={save} isLoading={saving}><Save className="h-4 w-4" /> Save changes</Button>
      </div>

      <div className="max-w-2xl space-y-5">
        {known.map((r) => {
          const isLong = r.key === 'hero.subtext' || r.key === 'whatsapp.message';
          return (
            <Field key={r.key} label={LABELS[r.key]} hint={HINTS[r.key]}>
              {isLong ? (
                <Textarea
                  rows={3}
                  value={values[r.key] ?? ''}
                  onChange={(e) => setValues({ ...values, [r.key]: e.target.value })}
                />
              ) : (
                <Input
                  value={values[r.key] ?? ''}
                  onChange={(e) => setValues({ ...values, [r.key]: e.target.value })}
                />
              )}
            </Field>
          );
        })}

        {known.length === 0 && (
          <p className="border border-dashed border-ink/15 bg-ivory-50/50 px-6 py-10 text-center text-sm text-ink-muted">
            No content settings yet. Run the database seed to create defaults.
          </p>
        )}

        {other.length > 0 && (
          <details className="border border-ink/10 bg-ivory-50 p-5">
            <summary className="cursor-pointer text-sm font-medium text-charcoal-900">
              Other settings ({other.length})
            </summary>
            <div className="mt-4 space-y-4">
              {other.map((r) => (
                <Field key={r.key} label={r.key}>
                  <Input
                    value={values[r.key] ?? ''}
                    onChange={(e) => setValues({ ...values, [r.key]: e.target.value })}
                  />
                </Field>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
