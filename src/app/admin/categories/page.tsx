'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Field, Input, Textarea } from '@/components/ui/Field';
import { Dialog } from '@/components/ui/Dialog';
import { toast } from '@/components/ui/Toaster';

type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image: string | null;
  displayOrder: number;
  featured: boolean;
  productCount: number;
};

const emptyForm = { name: '', description: '', image: '', displayOrder: '0', featured: false };

export default function AdminCategoriesPage() {
  const [rows, setRows] = useState<Category[] | null>(null);
  const [editing, setEditing] = useState<Category | 'new' | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/categories', { cache: 'no-store' });
    const j = await res.json();
    setRows(j.categories ?? []);
  }, []);

  useEffect(() => { load(); }, [load]);

  function openEdit(cat: Category | 'new') {
    setEditing(cat);
    if (cat === 'new') {
      setForm(emptyForm);
    } else {
      setForm({
        name: cat.name,
        description: cat.description ?? '',
        image: cat.image ?? '',
        displayOrder: String(cat.displayOrder ?? 0),
        featured: cat.featured,
      });
    }
  }

  async function save() {
    if (!form.name.trim()) { toast('Name is required', { variant: 'error' }); return; }
    setSaving(true);
    const isNew = editing === 'new';
    const res = await fetch(isNew ? '/api/admin/categories' : `/api/admin/categories/${(editing as Category).id}`, {
      method: isNew ? 'POST' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, displayOrder: Number(form.displayOrder) || 0 }),
    });
    const j = await res.json();
    setSaving(false);
    if (res.ok) {
      toast(isNew ? 'Category created' : 'Category saved', { variant: 'success' });
      setEditing(null);
      load();
    } else {
      toast(j.error || 'Could not save category', { variant: 'error' });
    }
  }

  async function remove(cat: Category) {
    if (!confirm(`Delete “${cat.name}”?`)) return;
    const res = await fetch(`/api/admin/categories/${cat.id}`, { method: 'DELETE' });
    const j = await res.json();
    if (res.ok) {
      toast('Category deleted', { variant: 'success' });
      load();
    } else {
      toast(j.error || 'Could not delete category', { variant: 'error' });
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="font-serif text-2xl text-charcoal-900">Categories</h2>
        <Button onClick={() => openEdit('new')} size="sm"><Plus className="h-4 w-4" /> New category</Button>
      </div>

      {!rows ? (
        <div className="flex justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-gold-600" /></div>
      ) : (
        <div className="overflow-x-auto border border-ink/10">
          <table className="w-full text-sm">
            <thead className="bg-ivory-100 text-left text-xs uppercase tracking-widest text-ink-muted">
              <tr>
                <th className="p-3 font-medium">Category</th>
                <th className="p-3 font-medium">Slug</th>
                <th className="p-3 font-medium">Products</th>
                <th className="p-3 font-medium">Order</th>
                <th className="p-3 font-medium">Featured</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10 bg-ivory-50">
              {rows.map((c) => (
                <tr key={c.id} className="hover:bg-ivory-100/60">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {c.image && (
                        <span className="relative h-10 w-10 shrink-0 overflow-hidden bg-ivory-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={c.image} alt="" className="h-full w-full object-cover" />
                        </span>
                      )}
                      <div>
                        <p className="font-medium text-charcoal-900">{c.name}</p>
                        <p className="line-clamp-1 text-xs text-ink-faint">{c.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-xs text-ink-muted">{c.slug}</td>
                  <td className="p-3 text-ink-muted">{c.productCount}</td>
                  <td className="p-3 text-ink-muted">{c.displayOrder}</td>
                  <td className="p-3">{c.featured ? <span className="text-xs font-medium text-gold-700">Featured</span> : <span className="text-xs text-ink-faint">—</span>}</td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => openEdit(c)} className="inline-flex items-center gap-1 text-gold-700 hover:underline" aria-label={`Edit ${c.name}`}>
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button onClick={() => remove(c)} className="text-red-700 hover:underline" aria-label={`Delete ${c.name}`}>
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

      <Dialog open={editing !== null} onClose={() => setEditing(null)} labelledBy="category-dialog-title">
        <div className="space-y-4 p-6">
          <h3 id="category-dialog-title" className="font-serif text-2xl text-charcoal-900">
            {editing === 'new' ? 'New category' : 'Edit category'}
          </h3>
          <Field label="Name" required>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Description">
            <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
          <Field label="Image URL">
            <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://…" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Display order">
              <Input type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: e.target.value })} />
            </Field>
            <label className="flex items-end gap-2 pb-3 text-sm text-charcoal-900">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-charcoal-900" />
              Show on homepage
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
