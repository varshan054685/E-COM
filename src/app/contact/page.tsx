'use client';

import { useState } from 'react';
import type { Metadata } from 'next';
import { Clock, Loader2, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { SITE, whatsappLink } from '@/lib/site';
import { Button } from '@/components/ui/Button';
import { Field, Input, Textarea } from '@/components/ui/Field';
import { toast } from '@/components/ui/Toaster';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type: 'contact' }),
      });
      const j = await res.json();
      if (res.ok) {
        setSent(true);
        toast('Message sent', { description: 'The boutique will reply within a day.', variant: 'success' });
      } else {
        toast(j.error || 'Could not send your message', { variant: 'error' });
      }
    } catch {
      toast('Something went wrong. Please try WhatsApp instead.', { variant: 'error' });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="bg-ivory-100">
      <div className="mx-auto max-w-shell px-4 sm:px-6 lg:px-10 pt-32 pb-20">
        <p className="editorial-eyebrow mb-4">Contact</p>
        <h1 className="font-serif text-5xl text-charcoal-900 sm:text-6xl">Say hello</h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-muted">
          Questions about a piece, a fitting, or a custom order? The boutique replies fastest
          on WhatsApp — and always in person.
        </p>

        <div className="mt-14 grid gap-10 lg:grid-cols-12">
          {/* Info column */}
          <div className="space-y-8 lg:col-span-5">
            <div className="border border-ink/10 bg-ivory-50 p-7">
              <ul className="space-y-5 text-[15px]">
                <li className="flex gap-4">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-gold-600" />
                  <span className="text-ink-muted">{SITE.fullAddress}</span>
                </li>
                <li className="flex gap-4">
                  <Phone className="mt-1 h-5 w-5 shrink-0 text-gold-600" />
                  <a href={`tel:${SITE.phone.replace(/\s/g, '')}`} className="text-charcoal-900 hover:underline">{SITE.phone}</a>
                </li>
                <li className="flex gap-4">
                  <MessageCircle className="mt-1 h-5 w-5 shrink-0 text-gold-600" />
                  <a
                    href={whatsappLink("Hi JGTHS, I'd like to know more about your boutique and couture services.")}
                    target="_blank"
                    rel="noreferrer"
                    className="text-charcoal-900 hover:underline"
                  >
                    Chat with the boutique on WhatsApp
                  </a>
                </li>
                <li className="flex gap-4">
                  <Mail className="mt-1 h-5 w-5 shrink-0 text-gold-600" />
                  <a href={`mailto:${SITE.email}`} className="text-charcoal-900 hover:underline">{SITE.email}</a>
                </li>
                <li className="flex gap-4">
                  <Clock className="mt-1 h-5 w-5 shrink-0 text-gold-600" />
                  <span className="text-ink-muted">
                    {SITE.hours.map((h) => (
                      <span key={h.days} className="block">{h.days}: {h.time}</span>
                    ))}
                  </span>
                </li>
              </ul>
            </div>

            <div className="border border-ink/10 overflow-hidden">
              <iframe
                title="JGTHS Designer Boutique location"
                src={SITE.mapsEmbed}
                className="h-72 w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Form column */}
          <div className="lg:col-span-7">
            <div className="border border-ink/10 bg-ivory-50 p-7 sm:p-10">
              {sent ? (
                <div className="py-10 text-center">
                  <MessageCircle className="mx-auto h-8 w-8 text-gold-600" />
                  <h2 className="mt-4 font-serif text-3xl text-charcoal-900">Message received</h2>
                  <p className="mt-3 text-sm text-ink-muted">
                    Thank you — we read every message. Expect a reply within one working day.
                  </p>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-5">
                  <h2 className="font-serif text-2xl text-charcoal-900">Write to us</h2>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Your name" required>
                      <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" />
                    </Field>
                    <Field label="Email" required>
                      <Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" />
                    </Field>
                  </div>
                  <Field label="Phone (optional)">
                    <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" />
                  </Field>
                  <Field label="Message" required>
                    <Textarea required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us about the piece or occasion…" />
                  </Field>
                  <Button type="submit" isLoading={sending} size="lg">Send message</Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
