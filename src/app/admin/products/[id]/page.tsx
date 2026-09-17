'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Field, Input, Select, Textarea } from '@/components/ui/Field';
import { toast } from '@/components/ui/Toaster';

type Category = { id: string; name: string; slug: string };

const emptyForm = {
  name: '', slug: '', description: '', price: '', compareAtPrice: '', sku: '', material: '', craftType: '',
  productionTime: '', sizes: '', colors: '', tags: '', stock: '0', lowStockThreshold: '5',
  categoryId: '', status: 'ACTIVE',
  isFeatured: false, isNew: false, isBestseller: false, isLimited: false, isMadeToOrder: false,
  images: [] as string[],
};

export default function AdminProductEditorPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = params.id === 'new';
  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [imageInput, setImageInput] = useState('');

  useEffect(() => {
    fetch('/api/admin/categories', { cache: 'no-store' })
      .then((r) => r.json())
      .then((j) => setCategories(j.categories ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isNew) return;
    fetch(`/api/admin/products/${params.id}`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j) => {
        const p = j.product;
        setForm({
          name: p.name || '', slug: p.slug || '', description: p.description || '', price: String(p.price ?? ''), compareAtPrice: p.compareAtPrice != null ? String(p.compareAtPrice) : '',
          sku: p.sku || '', material: p.material || '', craftType: p.craftType || '', productionTime: p.productionTime || '',
          sizes: p.sizes || '', colors: p.colors || '', tags: p.tags || '', stock: String(p.stock ?? 0), lowStockThreshold: String(p.lowStockThreshold ?? 5),
          categoryId: p.categoryId || '', status: p.status || 'ACTIVE',
          isFeatured: p.isFeatured, isNew: p.isNew, isBestseller: p.isBestseller, isLimited: p.isLimited, isMadeToOrder: p.isMadeToOrder,
          images: p.images || [],
        });
      })
      .catch(() => toast('Could not load product', { variant: 'error' }))
      .finally(() => setLoading(false));
  }, [isNew, params.id]);

  useEffect(() => {
    if (form.isMadeToOrder) {
      setForm((f) => ({ ...f, stock: '0' }));
    }
  }, [form.isMadeToOrder]);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save() {
    if (!form.name.trim()) { toast('Name is required', { variant: 'error' }); return; }
    setSaving(true);
    const payload = { ...form };
    const res = await fetch(isNew ? '/api/admin/products' : `/api/admin/products/${params.id}`, {
      method: isNew ? 'POST' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const j = await res.json();
    setSaving(false);
    if (res.ok) {
      toast(isNew ? 'Product created' : 'Product saved', { variant: 'success' });
      if (isNew) router.push(`/admin/products/${j.product?.id ?? ''}`);
      else router.refresh();
    } else {
      toast(j.error || 'Could not save', { variant: 'error' });
    }
  }

  if (loading) {
    return <div className="flex justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-gold-600" /></div>;
  }

  const addImage = (url: string) => {
    const clean = url.trim();
    if (!clean) return;
    set('images', [...form.images, clean]);
    setImageInput('');
  };

  return (
    <div>
      <h2 className="font-serif text-2xl text-charcoal-900">{isNew ? 'New product' : 'Edit product'}</h2>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <section className="border border-ink/10 bg-ivory-50 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-ink-muted">Basics</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Input label="Name" required value={form.name} onChange={(e) => set('name', e.target.value)} className="sm:col-span-2" />
              <Input label="Slug (leave blank to auto-generate)" value={form.slug} onChange={(e) => set('slug', e.target.value)} />
              <Select label="Category" value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)}>
                <option value="">Uncategorised</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
              <Input label="SKU" value={form.sku} onChange={(e) => set('sku', e.target.value)} />
              <Input label="Production time" value={form.productionTime} onChange={(e) => set('productionTime', e.target.value)} />
              <Textarea label="Description" rows={6} value={form.description} onChange={(e) => set('description', e.target.value)} className="sm:col-span-2" />
            </div>
          </section>

          <section className="border border-ink/10 bg-ivory-50 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-ink-muted">Pricing & inventory</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <Input label="Price (₹)" type="number" value={form.price} onChange={(e) => set('price', e.target.value)} />
              <Input label="Compare at price" type="number" value={form.compareAtPrice} onChange={(e) => set('compareAtPrice', e.target.value)} />
              <Input label="Stock" type="number" value={form.stock} disabled={form.isMadeToOrder} onChange={(e) => set('stock', e.target.value)} />
              <Input label="Low stock threshold" type="number" value={form.lowStockThreshold} onChange={(e) => set('lowStockThreshold', e.target.value)} />
              <Select label="Status" value={form.status} onChange={(e) => set('status', e.target.value as never)}>
                <option value="ACTIVE">Active</option>
                <option value="DRAFT">Draft</option>
              </Select>
            </div>
            <p className="mt-3 text-xs text-ink-faint">{form.isMadeToOrder ? 'Made-to-order pieces are reserved on request and cannot hold cart stock.' : 'Stock is decremented when a customer completes checkout.'}</p>
          </section>

          <section className="border border-ink/10 bg-ivory-50 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-ink-muted">Details</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Input label="Material" value={form.material} onChange={(e) => set('material', e.target.value)} />
              <Input label="Craft type" value={form.craftType} onChange={(e) => set('craftType', e.target.value)} />
              <Input label="Sizes (comma separated)" value={form.sizes} onChange={(e) => set('sizes', e.target.value)} />
              <Input label="Colours (comma separated)" value={form.colors} onChange={(e) => set('colors', e.target.value)} />
              <Input label="Tags (comma separated)" value={form.tags} onChange={(e) => set('tags', e.target.value)} className="sm:col-span-2" />
            </div>
          </section>

          <section className="border border-ink/10 bg-ivory-50 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-ink-muted">Marketing flags</h3>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {([
                ['isFeatured', 'Featured on the edit'],
                ['isNew', 'New arrival'],
                ['isBestseller', 'Bestseller'],
                ['isLimited', 'Limited edition'],
                ['isMadeToOrder', 'Made to order'],
              ] as const).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 text-sm text-charcoal-900">
                  <input type="checkbox" checked={form[key]} onChange={(e) => set(key, e.target.checked)} className="accent-charcoal-900" />
                  {label}
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="border border-ink/10 bg-ivory-50 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-ink-muted">Images</h3>
            <div className="mt-4 flex gap-2">
              <input
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addImage(imageInput)}
                placeholder="Image URL"
                className="h-10 flex-1 border border-ink/15 bg-ivory-100 px-3 text-sm focus:border-ink/40 focus:outline-none"
              />
              <Button variant="outline" onClick={() => addImage(imageInput)}><Plus className="h-4 w-4" /></Button>
            </div>
            <ul className="mt-4 space-y-3">
              {form.images.length === 0 && <li className="text-xs text-ink-faint">No images yet — add a URL above.</li>}
              {form.images.map((url, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="relative h-12 w-10 shrink-0 overflow-hidden bg-ivory-200">
                    <img src={url} alt="" className="h-full w-full object-cover" onError={(e) => ((e.target as HTMLImageElement).style.opacity = '0.2')} />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-xs text-ink-muted">{url}</span>
                  <button onClick={() => set('images', form.images.filter((_, x) => x !== i))} aria-label="Remove image"><Trash2 className="h-4 w-4 text-red-700" /></button>
                </li>
              ))}
            </ul>
          </section>

          <Button fullWidth size="lg" isLoading={saving} onClick={save}>Save product</Button>
        </div>
      </div>
    </div>
  );
}