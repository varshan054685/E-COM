/**
 * Client-safe admin vocabulary.
 *
 * This module deliberately has **no imports** — in particular nothing that
 * reaches `next/headers`. Client components (tables, dialogs) import types and
 * constants from here, while the async data fetchers live in `./queries`, which
 * is server-only. Keeping them apart is what stops a server module leaking into
 * the browser bundle.
 */

/** Products at or below this count are surfaced as low-stock alerts. */
export const LOW_STOCK_THRESHOLD = 5;

export const ORDER_PIPELINE = [
  { value: 'received', label: 'Received' },
  { value: 'in_embroidery', label: 'In Embroidery' },
  { value: 'stitched', label: 'Stitched' },
  { value: 'dispatched', label: 'Dispatched' },
] as const;

export const PAYMENT_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'refunded', label: 'Refunded' },
  { value: 'failed', label: 'Failed' },
] as const;

export type OrderStatus = (typeof ORDER_PIPELINE)[number]['value'];
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number]['value'];

export type AdminProduct = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  category_slug: string;
  price: number;
  compare_at_price: number | null;
  stock_count: number;
  is_made_to_order: boolean;
  fabric: string | null;
  embroidery: string | null;
  description: string | null;
  image_urls: string[];
  is_bestseller?: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type AdminOrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  title: string;
  size: string | null;
  color: string | null;
  quantity: number;
  unit_price: number;
  image_url: string | null;
};

export type AdminOrder = {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  shipping_address: string | null;
  total: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  is_made_to_measure: boolean;
  measurements: Record<string, string> | null;
  reference_images: string[];
  notes: string | null;
  placed_at: string;
  updated_at: string;
  items: AdminOrderItem[];
};

export type AdminUser = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: 'customer' | 'admin';
  last_active_at: string;
  created_at: string;
  order_count: number;
  total_spent: number;
};

export type DashboardStats = {
  totalRevenue: number;
  activeOrders: number;
  totalUsers: number;
  lowStock: AdminProduct[];
  revenueByStatus: { status: OrderStatus; orders: number; revenue: number }[];
  pendingPaymentCount: number;
};
