/**
 * Server-only admin data fetchers.
 *
 * Imports `next/headers` through the Supabase server client, so this module must
 * never reach a client component. Client components import the vocabulary from
 * `./constants` instead.
 */

import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';

import { LOW_STOCK_THRESHOLD, ORDER_PIPELINE } from './constants';
import type { AdminOrder, AdminProduct, AdminUser, DashboardStats } from './constants';

export { LOW_STOCK_THRESHOLD, ORDER_PIPELINE, PAYMENT_STATUSES } from './constants';
export type {
  AdminOrder,
  AdminOrderItem,
  AdminProduct,
  AdminUser,
  DashboardStats,
  OrderStatus,
  PaymentStatus,
} from './constants';

export async function listProducts(): Promise<AdminProduct[]> {
  if (!isSupabaseConfigured) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data as AdminProduct[];
}

export async function listOrders(): Promise<AdminOrder[]> {
  if (!isSupabaseConfigured) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .order('placed_at', { ascending: false });

  if (error || !data) return [];
  return data as unknown as AdminOrder[];
}

export async function listUsers(): Promise<AdminUser[]> {
  if (!isSupabaseConfigured) return [];

  const supabase = await createClient();

  const [{ data: profiles }, { data: orders }] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, full_name, email, phone, role, last_active_at, created_at')
      .order('last_active_at', { ascending: false }),
    supabase.from('orders').select('user_id, total, payment_status'),
  ]);

  if (!profiles) return [];

  // Aggregate order totals per user in memory — the row count here is small
  // enough that a grouped view would be overkill.
  const totals = new Map<string, { count: number; spent: number }>();
  (orders ?? []).forEach((order) => {
    if (!order.user_id) return;
    const entry = totals.get(order.user_id) ?? { count: 0, spent: 0 };
    entry.count += 1;
    if (order.payment_status === 'paid') entry.spent += Number(order.total);
    totals.set(order.user_id, entry);
  });

  return profiles.map((profile) => {
    const entry = totals.get(profile.id) ?? { count: 0, spent: 0 };
    return {
      ...profile,
      order_count: entry.count,
      total_spent: entry.spent,
    } as AdminUser;
  });
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const empty: DashboardStats = {
    totalRevenue: 0,
    activeOrders: 0,
    totalUsers: 0,
    lowStock: [],
    revenueByStatus: [],
    pendingPaymentCount: 0,
  };

  if (!isSupabaseConfigured) return empty;

  const supabase = await createClient();

  const [{ data: orders }, { count: userCount }, { data: lowStockRows }] = await Promise.all([
    supabase.from('orders').select('total, status, payment_status'),
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase
      .from('products')
      .select('*')
      .lte('stock_count', LOW_STOCK_THRESHOLD)
      .order('stock_count', { ascending: true }),
  ]);

  const all = orders ?? [];

  const totalRevenue = all
    .filter((order) => order.payment_status === 'paid')
    .reduce((sum, order) => sum + Number(order.total), 0);

  const activeOrders = all.filter((order) => order.status !== 'dispatched').length;

  const revenueByStatus = ORDER_PIPELINE.map(({ value }) => {
    const matching = all.filter((order) => order.status === value);
    return {
      status: value,
      orders: matching.length,
      revenue: matching
        .filter((order) => order.payment_status === 'paid')
        .reduce((sum, order) => sum + Number(order.total), 0),
    };
  });

  return {
    totalRevenue,
    activeOrders,
    totalUsers: userCount ?? 0,
    lowStock: (lowStockRows ?? []) as AdminProduct[],
    revenueByStatus,
    pendingPaymentCount: all.filter((order) => order.payment_status === 'pending').length,
  };
}
