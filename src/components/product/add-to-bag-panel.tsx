'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Minus, Plus, Ruler, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';

import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';
import { MeasurementForm } from '@/components/product/measurement-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Rating } from '@/components/ui/rating';
import type { Product } from '@/lib/catalog';
import { discountPercent, formatPrice } from '@/lib/format';
import { SITE, whatsappLink } from '@/lib/site';
import { useHydrated } from '@/lib/use-hydrated';
import { cn } from '@/lib/utils';
import { useCartStore, type Measurements } from '@/store/cart';
import { EMPTY_MEASUREMENTS, useMeasurementStore } from '@/store/measurements';

type FieldErrors = Partial<Record<'bust' | 'waist' | 'shoulder' | 'armhole', string>>;

const REQUIRED: (keyof FieldErrors)[] = ['bust', 'waist', 'shoulder', 'armhole'];

export function AddToBagPanel({ product }: { product: Product }) {
  const addLine = useCartStore((state) => state.addLine);
  const hydrated = useHydrated();
  const savedMeasurements = useMeasurementStore((state) => state.saved);
  const saveMeasurementProfile = useMeasurementStore((state) => state.save);

  const [color, setColor] = useState<string | null>(product.colors[0]?.name ?? null);
  const [size, setSize] = useState<string | null>(
    product.sizes.length === 1 ? product.sizes[0] : null,
  );
  const [quantity, setQuantity] = useState(1);
  const [madeToMeasure, setMadeToMeasure] = useState(false);
  const [measurements, setMeasurements] = useState<Measurements>(EMPTY_MEASUREMENTS);
  const [referenceFiles, setReferenceFiles] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [saveProfile, setSaveProfile] = useState(true);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  // Pre-fill from the saved profile once the persisted store has hydrated.
  const [prefilled, setPrefilled] = useState(false);
  useEffect(() => {
    if (!hydrated || prefilled || !savedMeasurements) return;
    setMeasurements(savedMeasurements);
    setPrefilled(true);
  }, [hydrated, prefilled, savedMeasurements]);

  const discount = discountPercent(product.price, product.compareAtPrice);

  function handleAddToCart() {
    setFormError(null);
    setErrors({});

    if (madeToMeasure) {
      const nextErrors: FieldErrors = {};
      REQUIRED.forEach((key) => {
        if (!measurements[key].trim()) nextErrors[key] = 'Required for made-to-measure';
      });

      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors);
        setFormError('Please add the required measurements before adding to your bag.');
        return;
      }

      if (saveProfile) saveMeasurementProfile(measurements);
    } else if (!size) {
      setFormError('Please choose a size, or opt to stitch to your measurements.');
      return;
    }

    addLine({
      productId: product.id,
      slug: product.slug,
      title: product.title,
      image: product.images[0],
      price: product.price,
      size,
      color,
      quantity,
      madeToMeasure,
      measurements: madeToMeasure ? measurements : null,
      referenceFiles,
      notes,
    });
  }

  const inquiryMessage = [
    `Hello ${SITE.shortName}, I would like to inquire about this piece:`,
    `• ${product.title} — ${formatPrice(product.price)}`,
    size ? `• Size: ${size}` : null,
    color ? `• Colour: ${color}` : null,
    madeToMeasure ? '• Please stitch this to my measurements.' : null,
    '',
    `Product: /product/${product.slug}`,
  ]
    .filter(Boolean)
    .join('\n');

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="outline">{product.category.replace(/-/g, ' ')}</Badge>
        {product.isNew ? <Badge variant="gold">New arrival</Badge> : null}
        {product.madeToOrder ? <Badge variant="muted">Made to order</Badge> : null}
      </div>

      <h1 className="mt-4 font-serif text-3xl leading-[1.15] font-medium text-balance sm:text-4xl">
        {product.title}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{product.subtitle}</p>

      <div className="mt-4">
        <Rating value={product.rating} count={product.reviewCount} />
      </div>

      <div className="mt-5 flex flex-wrap items-baseline gap-3">
        <span className="font-serif text-3xl tabular-nums">{formatPrice(product.price)}</span>
        {product.compareAtPrice ? (
          <>
            <span className="text-lg text-ink-300 line-through tabular-nums">
              {formatPrice(product.compareAtPrice)}
            </span>
            <span className="text-sm font-medium text-secondary">Save {discount}%</span>
          </>
        ) : null}
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">
        Inclusive of all taxes · Customisation confirmed on WhatsApp
      </p>

      {/* Craft facts */}
      <dl className="mt-7 grid grid-cols-1 gap-x-6 gap-y-3.5 border-y border-ink-100 py-6 sm:grid-cols-2">
        <div>
          <dt className="eyebrow text-ink-300">Fabric</dt>
          <dd className="mt-1.5 text-sm">{product.fabric}</dd>
        </div>
        <div>
          <dt className="eyebrow text-ink-300">Embroidery</dt>
          <dd className="mt-1.5 text-sm">{product.embroidery}</dd>
        </div>
      </dl>

      {/* Colour */}
      {product.colors.length > 0 ? (
        <div className="mt-7">
          <div className="flex items-baseline justify-between">
            <p className="eyebrow text-ink-400">Colour</p>
            <p className="text-xs text-muted-foreground">{color ?? 'Choose a shade'}</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-3">
            {product.colors.map((swatch) => {
              const selected = color === swatch.name;
              return (
                <button
                  key={swatch.name}
                  type="button"
                  onClick={() => setColor(swatch.name)}
                  aria-label={swatch.name}
                  aria-pressed={selected}
                  className={cn(
                    'flex size-9 items-center justify-center rounded-full border transition-all duration-200',
                    selected
                      ? 'border-gold-400 ring-2 ring-gold-400 ring-offset-2 ring-offset-background'
                      : 'border-ink-200 hover:border-ink-400',
                  )}
                  style={{ backgroundColor: swatch.hex }}
                >
                  {selected ? (
                    <Check className="size-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" strokeWidth={3} />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Size */}
      <div className="mt-7">
        <div className="flex items-baseline justify-between">
          <p className="eyebrow text-ink-400">
            {madeToMeasure ? 'Base size (optional)' : 'Size'}
          </p>
          <Link
            href="/custom-orders#measurements"
            className="text-xs text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
          >
            Size guide
          </Link>
        </div>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {product.sizes.map((option) => {
            const selected = size === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setSize(selected ? null : option);
                  setFormError(null);
                }}
                aria-pressed={selected}
                className={cn(
                  'min-w-12 rounded-md border px-3.5 py-2.5 text-sm transition-all duration-200',
                  selected
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-ink-200 text-ink-500 hover:border-ink-400 hover:text-foreground',
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom measurement toggle */}
      <div className="mt-7 rounded-xl border border-gold-200 bg-gold-100/50 p-4 sm:p-5">
        <label className="flex cursor-pointer items-start gap-3">
          <Checkbox
            checked={madeToMeasure}
            onCheckedChange={(checked) => {
              setMadeToMeasure(checked === true);
              setFormError(null);
              setErrors({});
            }}
            className="mt-0.5"
          />
          <span>
            <span className="block text-sm font-medium">Stitch to my exact measurements</span>
            <span className="mt-1 block text-xs leading-relaxed text-ink-500">
              Share bust, waist, shoulder and armhole details and we will cut your
              piece to your body — included at no extra cost.
            </span>
          </span>
        </label>
      </div>

      <AnimatePresence initial={false}>
        {madeToMeasure ? (
          <motion.div
            key="measurements"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-4">
              <MeasurementForm
                value={measurements}
                onChange={setMeasurements}
                onFilesChange={setReferenceFiles}
                saveProfile={saveProfile}
                onSaveProfileChange={setSaveProfile}
                errors={errors}
                notes={notes}
                onNotesChange={setNotes}
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Quantity + actions */}
      <div className="mt-7 flex flex-wrap items-center gap-4">
        <div className="flex items-center rounded-md border border-ink-200">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="p-3 text-ink-500 transition-colors hover:text-foreground disabled:opacity-40"
            disabled={quantity <= 1}
          >
            <Minus className="size-4" />
          </button>
          <span className="min-w-8 text-center text-sm font-medium tabular-nums">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(10, q + 1))}
            aria-label="Increase quantity"
            className="p-3 text-ink-500 transition-colors hover:text-foreground"
          >
            <Plus className="size-4" />
          </button>
        </div>

        <Button size="lg" onClick={handleAddToCart} className="flex-1 sm:min-w-56">
          <ShoppingBag className="size-4" />
          Add to Cart
        </Button>
      </div>

      <Button asChild variant="whatsapp" size="lg" className="mt-3 w-full">
        <a
          href={whatsappLink(inquiryMessage)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppIcon className="size-4" />
          Inquire on WhatsApp
        </a>
      </Button>

      {formError ? (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {formError}
        </p>
      ) : null}

      {/* Trust strip */}
      <ul className="mt-8 flex flex-col gap-3 border-t border-ink-100 pt-6 text-xs text-ink-500">
        <li className="flex items-center gap-2.5">
          <Truck className="size-4 shrink-0 text-gold-600" aria-hidden="true" />
          Complimentary shipping on orders above ₹15,000
        </li>
        <li className="flex items-center gap-2.5">
          <Ruler className="size-4 shrink-0 text-gold-600" aria-hidden="true" />
          {product.madeToOrder
            ? 'Hand-tailored to order in 2–4 weeks'
            : 'Dispatched within 5–7 working days'}
        </li>
        <li className="flex items-center gap-2.5">
          <ShieldCheck className="size-4 shrink-0 text-gold-600" aria-hidden="true" />
          Silk-mark assured fabrics with colour guarantee
        </li>
      </ul>
    </div>
  );
}
