'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Loader2, Ruler } from 'lucide-react';
import { formatDate, formatDateTime, formatINR } from '@/lib/format';
import { CUSTOM_ORDER_STATUSES, CUSTOM_ORDER_STATUS_LABELS } from '@/lib/custom-order';
import { Button } from '@/components/ui/Button';
import { Field, Input, Select, Textarea } from '@/components/ui/Field';
import { toast } from '@/components/ui/Toaster';

type RequestDetail = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  creationType: string;
  occasion: string | null;
  preferredColor: string | null;
  fabric: string | null;
  embroideryStyle: string | null;
  neckDesign: string | null;
  sleeveDesign: string | null;
  backDesign: string | null;
  additionalNotes: string | null;
  standardSize: string | null;
  useCustomMeasurements: boolean;
  measurementsSummary: string | null;
  deadline: string | null;
  status: string;
  adminNotes: string | null;
  quoteAmount: number | null;
  quoteNote: string | null;
  paymentStatus: string;
  convertedOrderId: string | null;
  createdAt: string;
  images: { id: string; url: string; alt: string | null }[];
};

export default function AdminCustomOrderDetailPage() {
  const params = useParams<{ orderNumber: string }>();
  const [request, setRequest] = useState<RequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [converting, setConverting] = useState(false);
  const [status, setStatus] = useState('');
  const [quoteAmount, setQuoteAmount] = useState('');
  const [quoteNote, setQuoteNote] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  const load = useCallback(async () => {
    try {
      // Resolve orderNumber -> id via the list endpoint (search by number)
      const listRes = await fetch(`/api/admin/custom-orders?q=${encodeURIComponent(params.orderNumber)}`, { cache: 'no-store' });
      const listJson = await listRes.json();
      const found = (listJson.requests ?? []).find(
        (r: { orderNumber: string }) => r.orderNumber === params.orderNumber,
      );
      if (!found) {
        setRequest(null);
        return;
      }
      const res = await fetch(`/api/admin/custom-orders/${found.id}`, { cache: 'no-store' });
      const j = await res.json();
      const r: RequestDetail = j.request;
      setRequest(r);
      setStatus(r.status);
      setQuoteAmount(r.quoteAmount != null ? String(r.quoteAmount) : '');
      setQuoteNote(r.quoteNote ?? '');
      setAdminNotes(r.adminNotes ?? '');
    } catch {
      toast('Could not load the request', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [params.orderNumber]);

  useEffect(() => { load(); }, [load]);

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/admin/custom-orders/${request?.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, quoteAmount, quoteNote, adminNotes }),
    });
    const j = await res.json();
    setSaving(false);
    if (res.ok) {
      toast('Request updated', { variant: 'success' });
      load();
    } else {
      toast(j.error || 'Could not update the request', { variant: 'error' });
    }
  }

  async function convert() {
    if (!confirm('Convert this request into a payable order?')) return;
    setConverting(true);
    const res = await fetch(`/api/admin/custom-orders/${request?.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'convert' }),
    });
    const j = await res.json();
    setConverting(false);
    if (res.ok) {
      toast(`Order ${j.orderNumber} created`, { variant: 'success' });
      load();
    } else {
      toast(j.error || 'Could not convert the request', { variant: 'error' });
    }
  }

  if (loading) {
    return <div className="flex justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-gold-600" /></div>;
  }
  if (!request) {
    return <p className="py-16 text-center text-sm text-ink-muted">Request not found.</p>;
  }

  const requirements: [string, string | null][] = [
    ['Occasion', request.occasion],
    ['Colour', request.preferredColor],
    ['Fabric', request.fabric],
    ['Embroidery', request.embroideryStyle],
    ['Neck', request.neckDesign],
    ['Sleeve', request.sleeveDesign],
    ['Back', request.backDesign],
  ];

  return (
    <div>
      <Link href="/admin/custom-orders" className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-charcoal-900">
        <ArrowLeft className="h-4 w-4" /> All requests
      </Link>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-serif text-2xl text-charcoal-900">
          {request.orderNumber} <span className="text-ink-faint">· {request.creationType}</span>
        </h2>
        <p className="text-sm text-ink-muted">Received {formatDateTime(request.createdAt)}</p>
      </div>

      {request.convertedOrderId && (
        <p className="mt-4 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Converted to order{' '}
          <Link href={`/admin/orders/${request.convertedOrderId}`} className="font-medium underline">
            {request.convertedOrderId ? 'view in Orders' : ''}
          </Link>
          .
        </p>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Left: requirements & references */}
        <div className="space-y-6">
          <section className="border border-ink/10 bg-ivory-50 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-ink-muted">Requirements</h3>
            <dl className="mt-4 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
              {requirements.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 border-b border-ink/10 pb-2">
                  <dt className="text-ink-faint">{label}</dt>
                  <dd className="text-right text-charcoal-900">{value || '—'}</dd>
                </div>
              ))}
              <div className="flex justify-between gap-4 border-b border-ink/10 pb-2 sm:col-span-2">
                <dt className="text-ink-faint">Size</dt>
                <dd className="text-right text-charcoal-900">
                  {request.useCustomMeasurements ? 'Custom measurements' : request.standardSize || '—'}
                </dd>
              </div>
            </dl>
            {request.additionalNotes && (
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-ink-faint">Customer notes</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{request.additionalNotes}</p>
              </div>
            )}
            {request.useCustomMeasurements && (
              <div className="mt-5">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-ink-faint">
                  <Ruler className="h-3.5 w-3.5" /> Measurements
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{request.measurementsSummary || 'Not provided.'}</p>
              </div>
            )}
            <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-sm">
              <p><span className="text-ink-faint">Deadline:</span> <span className="text-charcoal-900">{request.deadline ? formatDate(request.deadline) : '—'}</span></p>
              <p><span className="text-ink-faint">Payment:</span> <span className="text-charcoal-900">{request.paymentStatus}</span></p>
            </div>
          </section>

          <section className="border border-ink/10 bg-ivory-50 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-ink-muted">Reference images</h3>
            {request.images.length === 0 ? (
              <p className="mt-3 text-sm text-ink-muted">No reference images uploaded.</p>
            ) : (
              <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                {request.images.map((img) => (
                  <a key={img.id} href={img.url} target="_blank" rel="noreferrer" className="group relative aspect-[3/4] overflow-hidden bg-ivory-200">
                    <Image src={img.url} alt={img.alt ?? 'Reference'} fill sizes="150px" className="object-cover transition-transform group-hover:scale-105" />
                  </a>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right: quote & status controls */}
        <div className="space-y-6">
          <section className="border border-ink/10 bg-ivory-50 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-ink-muted">Customer</h3>
            <div className="mt-3 space-y-1 text-sm">
              <p className="font-medium text-charcoal-900">{request.customerName}</p>
              <p className="text-ink-muted">{request.customerEmail}</p>
              <p className="text-ink-muted">{request.customerPhone}</p>
            </div>
          </section>

          <section className="border border-ink/10 bg-ivory-50 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-ink-muted">Quote &amp; status</h3>
            <div className="mt-4 space-y-4">
              <Field label="Quote amount (₹)">
                <Input type="number" value={quoteAmount} onChange={(e) => setQuoteAmount(e.target.value)} placeholder="e.g. 11500" />
              </Field>
              <Field label="Quote note">
                <Textarea rows={2} value={quoteNote} onChange={(e) => setQuoteNote(e.target.value)} placeholder="What the quote includes…" />
              </Field>
              <Field label="Status">
                <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                  {CUSTOM_ORDER_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Internal notes">
                <Textarea rows={3} value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} placeholder="Notes visible to staff only" />
              </Field>
              <Button fullWidth isLoading={saving} onClick={save}>Save changes</Button>
            </div>
          </section>

          {!request.convertedOrderId && (
            <section className="border border-ink/10 bg-ivory-50 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-ink-muted">Convert</h3>
              <p className="mt-2 text-xs leading-relaxed text-ink-faint">
                Creates a confirmed order for the quoted amount. Requires a quote first.
              </p>
              <Button fullWidth variant="gold" className="mt-3" isLoading={converting} onClick={convert}>
                Convert to order
              </Button>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
