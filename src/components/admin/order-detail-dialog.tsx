'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ImageIcon, LoaderCircle, Ruler } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { updateOrderStatus, updatePaymentStatus } from '@/lib/admin/actions';
import {
  ORDER_PIPELINE,
  PAYMENT_STATUSES,
  type AdminOrder,
  type OrderStatus,
  type PaymentStatus,
} from '@/lib/admin/constants';
import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';

const MEASUREMENT_LABELS: Record<string, string> = {
  bust: 'Bust',
  waist: 'Waist',
  shoulder: 'Shoulder',
  armhole: 'Armhole',
  length: 'Blouse length',
  sleeve: 'Sleeve length',
  unit: 'Unit',
};

/**
 * Reference images are stored as private-bucket object paths. Resolve them to
 * temporary signed URLs; values that are already full URLs pass through.
 */
function ReferenceImages({ paths }: { paths: string[] }) {
  const [resolved, setResolved] = useState<{ path: string; url: string | null }[]>(
    paths.map((path) => ({ path, url: null })),
  );

  useEffect(() => {
    let active = true;

    if (!isSupabaseConfigured) return;

    async function resolve() {
      const supabase = createClient();
      const next = await Promise.all(
        paths.map(async (path) => {
          if (/^https?:\/\//.test(path)) return { path, url: path };
          const { data } = await supabase.storage
            .from('reference-images')
            .createSignedUrl(path, 3600);
          return { path, url: data?.signedUrl ?? null };
        }),
      );
      if (active) setResolved(next);
    }

    void resolve();
    return () => {
      active = false;
    };
  }, [paths]);

  if (paths.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No reference images were attached to this order.
      </p>
    );
  }

  return (
    <ul className="flex flex-wrap gap-3">
      {resolved.map((entry) => (
        <li key={entry.path} className="w-28">
          <span className="relative block aspect-square overflow-hidden rounded-lg border border-ink-200 bg-ivory-200">
            {entry.url ? (
              <Image src={entry.url} alt="" fill sizes="112px" className="object-cover" />
            ) : (
              <span className="flex h-full items-center justify-center text-ink-300">
                <ImageIcon className="size-5" aria-hidden="true" />
              </span>
            )}
          </span>
          <span className="mt-1.5 block truncate text-[10px] text-ink-300" title={entry.path}>
            {entry.path.split('/').pop()}
          </span>
        </li>
      ))}
    </ul>
  );
}

const STAGE_BADGE: Record<OrderStatus, 'muted' | 'gold' | 'magenta' | 'default'> = {
  received: 'muted',
  in_embroidery: 'gold',
  stitched: 'magenta',
  dispatched: 'default',
};

const PAYMENT_BADGE: Record<PaymentStatus, 'default' | 'gold' | 'muted' | 'magenta'> = {
  paid: 'default',
  pending: 'gold',
  refunded: 'muted',
  failed: 'magenta',
};

type OrderDetailDialogProps = {
  order: AdminOrder | null;
  onOpenChange: (open: boolean) => void;
};

export function OrderDetailDialog({ order, onOpenChange }: OrderDetailDialogProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function setStage(status: OrderStatus) {
    if (!order || order.status === status) return;
    setSaving(true);
    setError(null);

    const result = await updateOrderStatus(order.id, status);

    setSaving(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  async function setPayment(status: PaymentStatus) {
    if (!order || order.payment_status === status) return;
    setSaving(true);
    setError(null);

    const result = await updatePaymentStatus(order.id, status);

    setSaving(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  const measurements = order?.measurements ?? null;
  const measurementEntries = measurements
    ? Object.entries(measurements).filter(([key]) => key !== 'unit' && measurements[key])
    : [];

  return (
    <Dialog open={Boolean(order)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        {order ? (
          <>
            <DialogHeader>
              <div className="flex flex-wrap items-center gap-2.5">
                <DialogTitle>{order.order_number}</DialogTitle>
                <Badge variant={STAGE_BADGE[order.status]}>
                  {ORDER_PIPELINE.find((entry) => entry.value === order.status)?.label}
                </Badge>
                <Badge variant={PAYMENT_BADGE[order.payment_status]}>
                  {PAYMENT_STATUSES.find((entry) => entry.value === order.payment_status)?.label}
                </Badge>
              </div>
              <DialogDescription>
                Placed{' '}
                {new Date(order.placed_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}{' '}
                · {formatPrice(order.total)}
              </DialogDescription>
            </DialogHeader>

            {/* Customer */}
            <section className="rounded-xl border border-ink-100 bg-ivory-200/50 p-4">
              <p className="eyebrow text-ink-400">Customer</p>
              <p className="mt-2 font-medium">{order.customer_name}</p>
              <div className="mt-1 flex flex-col gap-0.5 text-sm text-muted-foreground">
                {order.customer_phone ? <span>{order.customer_phone}</span> : null}
                {order.customer_email ? <span>{order.customer_email}</span> : null}
                {order.shipping_address ? (
                  <span className="mt-1 text-xs leading-relaxed">{order.shipping_address}</span>
                ) : null}
              </div>
            </section>

            {/* Tailoring pipeline */}
            <section>
              <p className="eyebrow text-ink-400">Tailoring pipeline</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {ORDER_PIPELINE.map((stage) => {
                  const current = order.status === stage.value;
                  return (
                    <button
                      key={stage.value}
                      type="button"
                      disabled={saving}
                      onClick={() => void setStage(stage.value)}
                      aria-pressed={current}
                      className={cn(
                        'rounded-md border px-3.5 py-2 text-xs transition-colors disabled:opacity-60',
                        current
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-ink-200 text-ink-500 hover:border-ink-400 hover:text-foreground',
                      )}
                    >
                      {stage.label}
                    </button>
                  );
                })}
                {saving ? (
                  <span className="flex items-center px-2">
                    <LoaderCircle className="size-3.5 animate-spin text-ink-400" />
                  </span>
                ) : null}
              </div>

              <p className="eyebrow mt-5 text-ink-400">Payment</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {PAYMENT_STATUSES.map((entry) => {
                  const current = order.payment_status === entry.value;
                  return (
                    <button
                      key={entry.value}
                      type="button"
                      disabled={saving}
                      onClick={() => void setPayment(entry.value)}
                      aria-pressed={current}
                      className={cn(
                        'rounded-md border px-3.5 py-2 text-xs transition-colors disabled:opacity-60',
                        current
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-ink-200 text-ink-500 hover:border-ink-400 hover:text-foreground',
                      )}
                    >
                      {entry.label}
                    </button>
                  );
                })}
              </div>

              {error ? (
                <p role="alert" className="mt-3 text-sm text-destructive">
                  {error}
                </p>
              ) : null}
            </section>

            {/* Tabs */}
            <Tabs defaultValue="items">
              <TabsList>
                <TabsTrigger value="items">
                  Items ({order.items?.length ?? 0})
                </TabsTrigger>
                <TabsTrigger value="measurements">
                  <Ruler className="size-3.5" />
                  Measurements
                </TabsTrigger>
                <TabsTrigger value="references">
                  <ImageIcon className="size-3.5" />
                  References ({order.reference_images?.length ?? 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="items">
                <ul className="flex flex-col divide-y divide-ink-100">
                  {(order.items ?? []).map((item) => (
                    <li key={item.id} className="flex items-center gap-4 py-3.5">
                      <span className="relative size-12 shrink-0 overflow-hidden rounded-md border border-ink-100 bg-ivory-200">
                        {item.image_url ? (
                          <Image src={item.image_url} alt="" fill sizes="48px" className="object-cover" />
                        ) : null}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{item.title}</span>
                        <span className="block text-xs text-muted-foreground">
                          {[item.size, item.color].filter(Boolean).join(' · ') || 'Standard'}
                          {item.quantity > 1 ? ` · ×${item.quantity}` : ''}
                        </span>
                      </span>
                      <span className="shrink-0 text-sm tabular-nums">
                        {formatPrice(item.unit_price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
              </TabsContent>

              <TabsContent value="measurements">
                {order.is_made_to_measure ? (
                  measurementEntries.length > 0 ? (
                    <>
                      <p className="text-xs text-muted-foreground">
                        Recorded in {measurements?.unit === 'cm' ? 'centimetres' : 'inches'}.
                        Every set is re-checked against the pattern before cutting.
                      </p>
                      <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
                        {measurementEntries.map(([key, value]) => (
                          <div key={key} className="border-t border-ink-100 pt-3">
                            <dt className="eyebrow text-ink-300">
                              {MEASUREMENT_LABELS[key] ?? key}
                            </dt>
                            <dd className="mt-1.5 font-serif text-xl tabular-nums">
                              {value}
                              <span className="ml-1 text-sm text-muted-foreground">
                                {measurements?.unit}
                              </span>
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      This order was flagged as made to measure but no measurements were
                      captured. Follow up with the customer.
                    </p>
                  )
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Ready-to-wear order — stitched to a standard size, so no measurements
                    were recorded.
                  </p>
                )}

                {order.notes ? (
                  <div className="mt-6 rounded-lg border border-ink-100 bg-ivory-200/50 p-4">
                    <p className="eyebrow text-ink-400">Customer notes</p>
                    <p className="mt-2 text-sm leading-relaxed text-ink-500">{order.notes}</p>
                  </div>
                ) : null}
              </TabsContent>

              <TabsContent value="references">
                <ReferenceImages paths={order.reference_images ?? []} />
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
