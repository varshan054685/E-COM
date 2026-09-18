'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import type { OrderStatus, PaymentStatus } from './queries';

export type ActionResult = { ok: true } | { ok: false; error: string };

export type ProductInput = {
  /** Present when editing an existing product. */
  id?: string;
  title: string;
  subtitle?: string | null;
  category_slug: string;
  price: number;
  compare_at_price?: number | null;
  stock_count: number;
  is_made_to_order: boolean;
  fabric?: string | null;
  embroidery?: string | null;
  description?: string | null;
  image_urls: string[];
  is_active: boolean;
};

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

/**
 * Every action re-checks the caller's identity. The middleware gate and RLS
 * already cover this, but an action is a public HTTP endpoint — it should not
 * rely on the route that happened to render the form.
 */
async function requireAdmin() {
  if (!isSupabaseConfigured) {
    return { ok: false as const, error: 'Supabase is not configured.' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false as const, error: 'You must be signed in.' };

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (profile?.role !== 'admin') {
    return { ok: false as const, error: 'This account does not have admin access.' };
  }

  return { ok: true as const, supabase };
}

function revalidateStorefront() {
  revalidatePath('/admin');
  revalidatePath('/admin/products');
  revalidatePath('/shop');
  revalidatePath('/');
}

export async function saveProduct(input: ProductInput): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  if (!input.title.trim()) return { ok: false, error: 'A title is required.' };
  if (!Number.isFinite(input.price) || input.price < 0) {
    return { ok: false, error: 'Price must be a positive number.' };
  }
  if (!Number.isInteger(input.stock_count) || input.stock_count < 0) {
    return { ok: false, error: 'Stock must be a whole number of zero or more.' };
  }

  const payload = {
    slug: slugify(input.title),
    title: input.title.trim(),
    subtitle: input.subtitle?.trim() || null,
    category_slug: input.category_slug,
    price: input.price,
    compare_at_price: input.compare_at_price ?? null,
    stock_count: input.stock_count,
    is_made_to_order: input.is_made_to_order,
    fabric: input.fabric?.trim() || null,
    embroidery: input.embroidery?.trim() || null,
    description: input.description?.trim() || null,
    image_urls: input.image_urls,
    is_active: input.is_active,
  };

  const { error } = input.id
    ? await auth.supabase.from('products').update(payload).eq('id', input.id)
    : await auth.supabase.from('products').insert(payload);

  if (error) {
    // 23505 = unique violation, i.e. the generated slug already exists.
    if (error.code === '23505') {
      return {
        ok: false,
        error: 'A product with this name already exists. Adjust the title slightly.',
      };
    }
    return { ok: false, error: error.message };
  }

  revalidateStorefront();
  return { ok: true };
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const { error } = await auth.supabase.from('products').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };

  revalidateStorefront();
  return { ok: true };
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const { error } = await auth.supabase.from('orders').update({ status }).eq('id', id);
  if (error) return { ok: false, error: error.message };

  revalidatePath('/admin');
  revalidatePath('/admin/orders');
  return { ok: true };
}

export async function updatePaymentStatus(
  id: string,
  payment_status: PaymentStatus,
): Promise<ActionResult> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const { error } = await auth.supabase
    .from('orders')
    .update({ payment_status })
    .eq('id', id);
  if (error) return { ok: false, error: error.message };

  revalidatePath('/admin');
  revalidatePath('/admin/orders');
  return { ok: true };
}

/** Uploads product photography and returns the public URL. */
export async function uploadProductImage(
  file: File,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const auth = await requireAdmin();
  if (!auth.ok) return auth;

  const extension = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const path = `${crypto.randomUUID()}.${extension}`;

  const { error } = await auth.supabase.storage
    .from('product-images')
    .upload(path, file, { cacheControl: '31536000', upsert: false, contentType: file.type });

  if (error) return { ok: false, error: error.message };

  const { data } = auth.supabase.storage.from('product-images').getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}
