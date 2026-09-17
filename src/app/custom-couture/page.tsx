'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, ImagePlus, Loader2, Lock, Plus, Scissors, X } from 'lucide-react';
import { useAuth } from '@/components/commerce/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Field, Input, Select, Textarea } from '@/components/ui/Field';
import { toast } from '@/components/ui/Toaster';
import { whatsappLink } from '@/lib/site';
import { cn } from '@/lib/utils';
import {
  GARMENT_TYPES,
  OCCASIONS,
  FABRICS,
  EMBROIDERY_STYLES,
  NECK_DESIGNS,
  SLEEVE_DESIGNS,
  BACK_DESIGNS,
  STANDARD_SIZES,
  defaultDeadlineInDays,
} from '@/lib/custom-order';

type MeasurementProfile = {
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
  isDefault: boolean;
};

const STEPS = [
  { label: 'The piece', short: 'Piece' },
  { label: 'Occasion & timeline', short: 'Occasion' },
  { label: 'Colour', short: 'Colour' },
  { label: 'Fabric', short: 'Fabric' },
  { label: 'Embroidery', short: 'Embroidery' },
  { label: 'Design details', short: 'Details' },
  { label: 'Measurements', short: 'Measure' },
  { label: 'References & review', short: 'Review' },
] as const;

function Wizard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pieceSlug = searchParams.get('piece');

  const [step, setStep] = useState(0);
  const [preset, setPreset] = useState<{ name: string; image: string | null; colors: string; embroidery: string } | null>(null);
  const [profiles, setProfiles] = useState<MeasurementProfile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);

  const [data, setData] = useState({
    creationType: '',
    occasion: '',
    deadline: '',
    preferredColor: '',
    fabric: '',
    embroideryStyle: '',
    neckDesign: '',
    sleeveDesign: '',
    backDesign: '',
    standardSize: '',
    measurementMode: 'standard' as 'standard' | 'profile' | 'custom',
    measurementProfileId: '',
    customMeasurements: {
      bust: '', waist: '', hip: '', shoulder: '',
      sleeveLength: '', armhole: '', blouseLength: '',
      frontNeckDepth: '', backNeckDepth: '',
    },
    additionalNotes: '',
  });
  const [images, setImages] = useState<{ url: string; uploading?: boolean }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ orderNumber: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace(`/login?next=/custom-couture${pieceSlug ? `?piece=${pieceSlug}` : ''}`);
    }
  }, [authLoading, user, router, pieceSlug]);

  useEffect(() => {
    if (user) {
      setLoadingProfiles(true);
      fetch('/api/measurements', { cache: 'no-store' })
        .then((r) => r.json())
        .then((j) => setProfiles(j.profiles ?? []))
        .catch(() => {})
        .finally(() => setLoadingProfiles(false));
    }
  }, [user]);

  useEffect(() => {
    if (!pieceSlug) return;
    fetch(`/api/products/by-slug?slug=${pieceSlug}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((j) => {
        if (j.product) {
          const p = j.product;
          setPreset({ name: p.name, image: p.images?.[0] ?? null, colors: (p.colors || []).join(', '), embroidery: p.craftType || '' });
          setData((d) => ({
            ...d,
            creationType: d.creationType || (p.categoryName?.includes('Blouse') || p.name.toLowerCase().includes('blouse') ? 'Aari Blouse' : 'Custom Aari Couture'),
            preferredColor: d.preferredColor || (p.colors || []).slice(0, 3).join(', '),
            embroideryStyle: d.embroideryStyle || p.craftType || '',
          }));
        }
      })
      .catch(() => {});
  }, [pieceSlug]);

  const canContinue = useMemo(() => {
    switch (step) {
      case 0: return Boolean(data.creationType);
      case 1: return true;
      case 2: return true;
      case 3: return Boolean(data.fabric);
      case 4: return Boolean(data.embroideryStyle);
      case 5: return true;
      case 6: return data.measurementMode === 'standard' ? Boolean(data.standardSize) : data.measurementMode === 'profile' ? Boolean(data.measurementProfileId) : true;
      case 7: return true;
      default: return true;
    }
  }, [step, data]);

  function go(delta: number) {
    const next = step + delta;
    if (delta > 0 && !canContinue) {
      toast('Please complete this step', { variant: 'error' });
      return;
    }
    setStep(Math.max(0, Math.min(STEPS.length - 1, next)));
  }

  async function uploadImages(files: FileList | File[]) {
    for (const file of Array.from(files).slice(0, 3 - images.length)) {
      setImages((imgs) => [...imgs, { url: '', uploading: true }]);
      try {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        const j = await res.json();
        if (res.ok) {
          setImages((imgs) => imgs.map((im, i) => (im.uploading && i === imgs.length - 1 ? { url: j.url } : im)));
        } else {
          toast(j.error || 'Upload failed', { variant: 'error' });
          setImages((imgs) => imgs.filter((im) => !im.uploading));
        }
      } catch {
        setImages((imgs) => imgs.filter((im) => !im.uploading));
        toast('Upload failed', { variant: 'error' });
      }
    }
  }

  async function submit() {
    setSubmitting(true);
    try {
      const res = await fetch('/api/custom-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creationType: data.creationType,
          occasion: data.occasion || undefined,
          preferredColor: data.preferredColor || undefined,
          fabric: data.fabric || undefined,
          embroideryStyle: data.embroideryStyle || undefined,
          neckDesign: data.neckDesign || undefined,
          sleeveDesign: data.sleeveDesign || undefined,
          backDesign: data.backDesign || undefined,
          additionalNotes: data.additionalNotes || undefined,
          standardSize: data.measurementMode === 'standard' ? data.standardSize : undefined,
          useCustomMeasurements: data.measurementMode !== 'standard',
          measurementProfileId: data.measurementMode === 'profile' ? data.measurementProfileId : undefined,
          customMeasurements: data.measurementMode === 'custom' ? data.customMeasurements : undefined,
          deadline: data.deadline || (data.occasion ? defaultDeadlineInDays(21).toISOString() : undefined),
          imageUrls: images.filter((i) => i.url).map((i) => i.url),
        }),
      });
      const j = await res.json();
      if (res.ok) {
        setDone(j.customOrder);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        toast(j.error || 'Could not submit your request', { variant: 'error' });
      }
    } catch {
      toast('Could not submit your request. Please try again.', { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-4 text-center pt-10 pb-24">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold-500/40 bg-gold-500/10">
          <CheckCircle2 className="h-8 w-8 text-gold-600" />
        </div>
        <h1 className="mt-6 font-serif text-4xl text-charcoal-900">Your request is with our designer</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
          Reference <span className="font-medium text-charcoal-900">{done.orderNumber}</span>. Our atelier will review your ideas and reply with a moodboard and quote within 1–2 working days.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/account/custom-orders" className="inline-flex h-12 items-center bg-ink px-8 text-sm text-ivory-100 hover:bg-charcoal-800">Track your requests</Link>
          <a
            href={whatsappLink(`Hi JGTHS, I just submitted creation request ${done.orderNumber}. I'd love to discuss the design!`)}
            target="_blank" rel="noreferrer"
            className="inline-flex h-12 items-center border border-[#25D366]/40 px-8 text-sm text-[#128C7E] hover:bg-[#25D366]/5"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Progress */}
      <div className="mb-10">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {STEPS.map((s, i) => (
            <button
              key={s.short}
              onClick={() => i < step && setStep(i)}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] tracking-wider transition',
                i === step
                  ? 'border-charcoal-900 bg-charcoal-900 text-ivory-100'
                  : i < step
                    ? 'border-gold-500/50 bg-gold-500/10 text-gold-700'
                    : 'border-ink/15 text-ink-faint',
              )}
            >
              {i < step ? <Check className="h-3 w-3" /> : <span>{i + 1}</span>}
              {s.short}
            </button>
          ))}
        </div>
        <div className="mt-3 h-px bg-ink/10">
          <div className="h-px bg-gold-500 transition-all duration-500" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
      </div>

      {preset && (
        <div className="mb-8 flex items-center gap-4 border border-gold-500/30 bg-gold-500/5 p-4">
          {preset.image && (
            <span className="relative h-16 w-14 shrink-0 overflow-hidden"><Image src={preset.image} alt="" fill sizes="56px" className="object-cover" /></span>
          )}
          <p className="text-sm text-charcoal-900">
            You're starting from <span className="font-serif text-lg">{preset.name}</span>
          </p>
        </div>
      )}

      <div id="step-panel">
        {step === 0 && (
          <section>
            <p className="section-kicker mb-2">Step 1 · The piece</p>
            <h2 className="font-serif text-3xl text-charcoal-900">What shall we create?</h2>
            <p className="mt-2 text-sm text-ink-muted">Every piece starts as a conversation. Choose the garment closest to your idea.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {GARMENT_TYPES.map((g) => (
                <button
                  key={g}
                  onClick={() => setData({ ...data, creationType: g })}
                  className={cn(
                    'border p-5 text-left transition',
                    data.creationType === g ? 'border-charcoal-900 bg-ivory-50' : 'border-ink/15 hover:border-ink/40',
                  )}
                >
                  <span className="text-sm font-medium text-charcoal-900">{g}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 1 && (
          <section>
            <p className="section-kicker mb-2">Step 2 · Occasion & timeline</p>
            <h2 className="font-serif text-3xl text-charcoal-900">When do you need it?</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {OCCASIONS.map((o) => (
                <button
                  key={o}
                  onClick={() => setData({ ...data, occasion: o })}
                  className={cn(
                    'border p-5 text-left text-sm transition',
                    data.occasion === o ? 'border-charcoal-900 bg-ivory-50 text-charcoal-900' : 'border-ink/15 text-ink-muted hover:border-ink/40',
                  )}
                >
                  {o}
                </button>
              ))}
            </div>
            <div className="mt-6 max-w-sm">
              <Input
                label="Event date (optional)"
                type="date"
                value={data.deadline}
                onChange={(e) => setData({ ...data, deadline: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <p className="mt-3 text-xs text-ink-faint">Bridal and lehenga pieces typically take 3–4 weeks. We'll confirm a timeline with your quote.</p>
          </section>
        )}

        {step === 2 && (
          <section>
            <p className="section-kicker mb-2">Step 3 · Colour</p>
            <h2 className="font-serif text-3xl text-charcoal-900">Tell us your palette</h2>
            <div className="mt-6 max-w-lg">
              <Textarea
                label="Preferred colours (comma separated)"
                placeholder="e.g. Peacock green base with antique gold motifs"
                value={data.preferredColor}
                onChange={(e) => setData({ ...data, preferredColor: e.target.value })}
                rows={3}
              />
            </div>
            <p className="mt-3 text-xs text-ink-faint">We'll also share a coordinating swatch palette for your review.</p>
          </section>
        )}

        {step === 3 && (
          <section>
            <p className="section-kicker mb-2">Step 4 · Fabric</p>
            <h2 className="font-serif text-3xl text-charcoal-900">Choose your base</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {FABRICS.map((f) => (
                <button
                  key={f}
                  onClick={() => setData({ ...data, fabric: f })}
                  className={cn(
                    'border p-5 text-left text-sm transition',
                    data.fabric === f ? 'border-charcoal-900 bg-ivory-50 text-charcoal-900' : 'border-ink/15 text-ink-muted hover:border-ink/40',
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 4 && (
          <section>
            <p className="section-kicker mb-2">Step 5 · Embroidery</p>
            <h2 className="font-serif text-3xl text-charcoal-900">Handwork in the Aari tradition</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {EMBROIDERY_STYLES.map((e) => (
                <button
                  key={e}
                  onClick={() => setData({ ...data, embroideryStyle: e })}
                  className={cn(
                    'border p-5 text-left text-sm transition',
                    data.embroideryStyle === e ? 'border-charcoal-900 bg-ivory-50 text-charcoal-900' : 'border-ink/15 text-ink-muted hover:border-ink/40',
                  )}
                >
                  {e}
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 5 && (
          <section>
            <p className="section-kicker mb-2">Step 6 · Design details</p>
            <h2 className="font-serif text-3xl text-charcoal-900">Give it your signature</h2>
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-muted">Neckline</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {NECK_DESIGNS.map((n) => (
                    <button key={n} onClick={() => setData({ ...data, neckDesign: n })} className={cn('border px-3 py-2 text-[13px] transition', data.neckDesign === n ? 'border-charcoal-900 bg-charcoal-900 text-ivory-100' : 'border-ink/15 hover:border-ink/50')}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-muted">Sleeves</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {SLEEVE_DESIGNS.map((s) => (
                    <button key={s} onClick={() => setData({ ...data, sleeveDesign: s })} className={cn('border px-3 py-2 text-[13px] transition', data.sleeveDesign === s ? 'border-charcoal-900 bg-charcoal-900 text-ivory-100' : 'border-ink/15 hover:border-ink/50')}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-muted">Back</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {BACK_DESIGNS.map((b) => (
                    <button key={b} onClick={() => setData({ ...data, backDesign: b })} className={cn('border px-3 py-2 text-[13px] transition', data.backDesign === b ? 'border-charcoal-900 bg-charcoal-900 text-ivory-100' : 'border-ink/15 hover:border-ink/50')}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {step === 6 && (
          <section>
            <p className="section-kicker mb-2">Step 7 · Measurements</p>
            <h2 className="font-serif text-3xl text-charcoal-900">Fit, done right</h2>

            <div className="mt-6 flex gap-3">
              {(['standard', 'profile', 'custom'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setData({ ...data, measurementMode: m })}
                  className={cn(
                    'border px-4 py-2.5 text-[13px] transition',
                    data.measurementMode === m ? 'border-charcoal-900 bg-charcoal-900 text-ivory-100' : 'border-ink/15 hover:border-ink/50',
                  )}
                >
                  {m === 'standard' ? 'Standard size' : m === 'profile' ? 'Saved profile' : 'Custom measurements'}
                </button>
              ))}
            </div>

            <div className="mt-6 max-w-md space-y-4">
              {data.measurementMode === 'standard' && (
                <Select label="Standard size" value={data.standardSize} onChange={(e) => setData({ ...data, standardSize: e.target.value })}>
                  <option value="">Select a size</option>
                  {STANDARD_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                </Select>
              )}
              {data.measurementMode === 'profile' && (
                <Select label="Measurement profile" value={data.measurementProfileId} onChange={(e) => setData({ ...data, measurementProfileId: e.target.value })}>
                  <option value="">{loadingProfiles ? 'Loading…' : 'Choose a profile'}</option>
                  {profiles.map((p) => <option key={p.id} value={p.id}>{p.name || 'Profile'}</option>)}
                </Select>
              )}
              {data.measurementMode === 'custom' && (
                <div className="grid grid-cols-2 gap-4">
                  {(
                    [
                      ['bust', 'Bust'],
                      ['waist', 'Waist'],
                      ['hip', 'Hip'],
                      ['shoulder', 'Shoulder'],
                      ['sleeveLength', 'Sleeve length'],
                      ['armhole', 'Armhole'],
                      ['blouseLength', 'Blouse length'],
                      ['frontNeckDepth', 'Front neck depth'],
                      ['backNeckDepth', 'Back neck depth'],
                    ] as const
                  ).map(([k, label]) => (
                    <Input
                      key={k}
                      label={label}
                      value={data.customMeasurements[k]}
                      onChange={(e) => setData({ ...data, customMeasurements: { ...data.customMeasurements, [k]: e.target.value } })}
                      placeholder="In inches"
                    />
                  ))}
                </div>
              )}
            </div>

            <p className="mt-5 text-xs text-ink-faint">
              <Scissors className="mr-1 inline h-3.5 w-3.5" /> Don't have numbers handy? Pick "Standard size" — we'll confirm exact fit before stitching.
            </p>
          </section>
        )}

        {step === 7 && (
          <section>
            <p className="section-kicker mb-2">Step 8 · References & review</p>
            <h2 className="font-serif text-3xl text-charcoal-900">Share your references</h2>

            <div className="mt-6">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-muted">Reference images (up to 3)</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {images.map((im, i) => (
                  <span key={i} className="relative h-24 w-20 overflow-hidden border border-ink/15 bg-ivory-200">
                    {im.url ? (
                      <>
                        <Image src={im.url} alt="" fill sizes="80px" className="object-cover" />
                        <button onClick={() => setImages(images.filter((_, x) => x !== i))} aria-label="Remove image" className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center bg-charcoal-900/80 text-ivory-100"><X className="h-3 w-3" /></button>
                      </>
                    ) : (
                      <span className="flex h-full items-center justify-center"><Loader2 className="h-4 w-4 animate-spin text-ink-faint" /></span>
                    )}
                  </span>
                ))}
                {images.length < 3 && (
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="flex h-24 w-20 flex-col items-center justify-center gap-1 border border-dashed border-ink/25 text-ink-faint hover:border-ink/50 hover:text-ink"
                  >
                    <ImagePlus className="h-5 w-5" />
                    <span className="text-[10px]">Add</span>
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => e.target.files && uploadImages(e.target.files)} />
              </div>
            </div>

            <div className="mt-6 max-w-xl">
              <Textarea
                label="Anything else we should know?"
                placeholder="Motifs you love, blouse also needed, fabric you already own, budget range…"
                rows={5}
                value={data.additionalNotes}
                onChange={(e) => setData({ ...data, additionalNotes: e.target.value })}
              />
            </div>

            {/* Review */}
            <div className="mt-8 max-w-2xl border border-ink/10 bg-ivory-50 p-6">
              <h3 className="font-serif text-xl text-charcoal-900">Review your request</h3>
              <dl className="mt-4 grid gap-x-8 gap-y-2.5 text-sm sm:grid-cols-2">
                <div><dt className="text-ink-muted">Piece</dt><dd className="font-medium text-charcoal-900">{data.creationType}</dd></div>
                {data.occasion && <div><dt className="text-ink-muted">Occasion</dt><dd className="font-medium text-charcoal-900">{data.occasion}</dd></div>}
                {data.fabric && <div><dt className="text-ink-muted">Fabric</dt><dd className="font-medium text-charcoal-900">{data.fabric}</dd></div>}
                {data.embroideryStyle && <div><dt className="text-ink-muted">Embroidery</dt><dd className="font-medium text-charcoal-900">{data.embroideryStyle}</dd></div>}
                {data.preferredColor && <div><dt className="text-ink-muted">Colours</dt><dd className="font-medium text-charcoal-900">{data.preferredColor}</dd></div>}
                {[data.neckDesign, data.sleeveDesign, data.backDesign].filter(Boolean).length > 0 && (
                  <div><dt className="text-ink-muted">Details</dt><dd className="font-medium text-charcoal-900">{[data.neckDesign, data.sleeveDesign, data.backDesign].filter(Boolean).join(' · ')}</dd></div>
                )}
                <div>
                  <dt className="text-ink-muted">Fit</dt>
                  <dd className="font-medium text-charcoal-900">
                    {data.measurementMode === 'standard' ? `Size ${data.standardSize}` : data.measurementMode === 'profile' ? 'Saved profile' : 'Custom measurements'}
                  </dd>
                </div>
              </dl>
              <p className="mt-5 flex items-center gap-2 text-xs text-ink-faint"><Lock className="h-3.5 w-3.5" /> No payment is taken now — we'll share a written quote before you commit.</p>
            </div>
          </section>
        )}
      </div>

      {/* Nav */}
      <div className="mt-10 flex items-center justify-between gap-4 border-t border-ink/10 pt-6">
        <Button variant="outline" onClick={() => go(-1)} disabled={step === 0}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={() => go(1)}>
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button isLoading={submitting} onClick={submit}>
            <Plus className="h-4 w-4" /> {submitting ? 'Sending to atelier…' : 'Submit creation request'}
          </Button>
        )}
      </div>
    </div>
  );
}

export default function CustomCouturePage() {
  return (
    <main className="mx-auto max-w-shell px-4 sm:px-6 lg:px-10 pt-28 pb-24">
      <header className="mb-10">
        <p className="editorial-eyebrow mb-3">Custom couture</p>
        <h1 className="font-serif text-4xl text-charcoal-900">Made for you, by hand</h1>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-muted">
          Tell us your idea and our designer will craft a moodboard, quote and timeline within 1–2 working days. Nothing is stitched until you approve.
        </p>
      </header>
      <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-gold-600" /></div>}>
        <Wizard />
      </Suspense>
    </main>
  );
}