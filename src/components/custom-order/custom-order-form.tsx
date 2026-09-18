'use client';

import { useState } from 'react';
import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';
import { Button } from '@/components/ui/button';
import { Input, Textarea, fieldClasses } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SITE, whatsappLink } from '@/lib/site';

const PIECE_TYPES = [
  'Bridal Aari Blouse',
  'Designer / Party Blouse',
  'Saree Styling',
  'Aari Embroidery Work Only',
  'Kids Party Wear',
  'Hand-Painted Fabric',
  'Something else',
];

const OCCASIONS = [
  'Wedding',
  'Engagement',
  'Reception',
  'Half Saree Ceremony',
  'Festive / Pooja',
  'Birthday',
  'Other',
];

const BUDGETS = [
  'Under ₹10,000',
  '₹10,000 – ₹25,000',
  '₹25,000 – ₹50,000',
  '₹50,000+',
  'Still deciding',
];

type FormState = {
  name: string;
  phone: string;
  pieceType: string;
  occasion: string;
  budget: string;
  neededBy: string;
  notes: string;
};

const INITIAL: FormState = {
  name: '',
  phone: '',
  pieceType: PIECE_TYPES[0],
  occasion: OCCASIONS[0],
  budget: BUDGETS[1],
  neededBy: '',
  notes: '',
};

/**
 * There is no server in this build, so a request is composed into a formatted
 * WhatsApp message — which is exactly how the boutique takes custom orders.
 */
export function CustomOrderForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<'name' | 'phone', string>>>({});

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((previous) => ({ ...previous, [key]: value }));
    if (key === 'name' || key === 'phone') {
      setErrors((previous) => ({ ...previous, [key]: undefined }));
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: Partial<Record<'name' | 'phone', string>> = {};
    if (!form.name.trim()) nextErrors.name = 'Please tell us your name.';
    if (!/^[+\d][\d\s-]{7,}$/.test(form.phone.trim())) {
      nextErrors.phone = 'Please enter a reachable phone number.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const message = [
      `New custom order request — ${SITE.shortName}`,
      '',
      `Name: ${form.name.trim()}`,
      `Phone: ${form.phone.trim()}`,
      `Piece: ${form.pieceType}`,
      `Occasion: ${form.occasion}`,
      `Budget: ${form.budget}`,
      form.neededBy ? `Needed by: ${form.neededBy}` : null,
      form.notes.trim() ? `\nNotes: ${form.notes.trim()}` : null,
      '',
      'I will share reference images in this chat.',
    ]
      .filter(Boolean)
      .join('\n');

    window.open(whatsappLink(message), '_blank', 'noopener,noreferrer');
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="co-name">Your name</Label>
          <Input
            id="co-name"
            value={form.name}
            onChange={(event) => update('name', event.target.value)}
            placeholder="Priya Raman"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name ? <p className="text-xs text-destructive">{errors.name}</p> : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="co-phone">Phone / WhatsApp</Label>
          <Input
            id="co-phone"
            type="tel"
            value={form.phone}
            onChange={(event) => update('phone', event.target.value)}
            placeholder="+91 90000 00000"
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
          />
          {errors.phone ? <p className="text-xs text-destructive">{errors.phone}</p> : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="co-piece">What would you like made?</Label>
          <select
            id="co-piece"
            value={form.pieceType}
            onChange={(event) => update('pieceType', event.target.value)}
            className={fieldClasses}
          >
            {PIECE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="co-occasion">Occasion</Label>
          <select
            id="co-occasion"
            value={form.occasion}
            onChange={(event) => update('occasion', event.target.value)}
            className={fieldClasses}
          >
            {OCCASIONS.map((occasion) => (
              <option key={occasion} value={occasion}>
                {occasion}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="co-budget">Budget</Label>
          <select
            id="co-budget"
            value={form.budget}
            onChange={(event) => update('budget', event.target.value)}
            className={fieldClasses}
          >
            {BUDGETS.map((budget) => (
              <option key={budget} value={budget}>
                {budget}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="co-date">Needed by</Label>
          <Input
            id="co-date"
            type="date"
            value={form.neededBy}
            onChange={(event) => update('neededBy', event.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="co-notes">Design notes</Label>
        <Textarea
          id="co-notes"
          value={form.notes}
          onChange={(event) => update('notes', event.target.value)}
          placeholder="Colours, sleeve style, neckline, embroidery references…"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-muted-foreground">
          No payment now. We review your reference images and send a quote within 24
          hours.
        </p>
        <Button type="submit" variant="whatsapp" size="lg" className="shrink-0">
          <WhatsAppIcon className="size-4" />
          Send request
        </Button>
      </div>
    </form>
  );
}
