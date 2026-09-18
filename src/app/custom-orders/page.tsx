import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarCheck, MessageCircle, PenTool, Ruler, Scissors, Truck } from 'lucide-react';

import { CustomOrderForm } from '@/components/custom-order/custom-order-form';
import { PageHero } from '@/components/layout/page-hero';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { IMG } from '@/lib/images';
import { SITE, WHATSAPP_DEFAULT_MESSAGE, whatsappLink } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Custom Orders',
  description:
    'Commission a made-to-measure Aari blouse, bridal piece or hand-painted fabric. Share your reference, we quote and stitch to your measurements.',
};

const STEPS = [
  {
    Icon: MessageCircle,
    title: 'Share your idea',
    copy: 'Send inspiration photos, colours and the occasion over WhatsApp or through the form below.',
  },
  {
    Icon: Ruler,
    title: 'Measurements & consultation',
    copy: 'Visit the studio in Coimbatore, or follow our measurement guide from home — we review every set before cutting.',
  },
  {
    Icon: PenTool,
    title: 'Quote & design approval',
    copy: 'You receive a costed quote, fabric options and a sketch within 24 hours. Nothing starts until you approve.',
  },
  {
    Icon: Scissors,
    title: 'Handcrafted to order',
    copy: 'Your piece is patterned, embroidered and stitched by hand — three to four weeks for bridal work.',
  },
  {
    Icon: Truck,
    title: 'Final fitting & delivery',
    copy: 'One complimentary alteration, then it ships insured anywhere in India.',
  },
];

const COMMISSIONS = [
  'Bridal Aari & zardosi blouses',
  'Designer crop tops & party blouses',
  'Aari embroidery on your own fabric',
  'Hand-painted sarees, dupattas and blouses',
  'Coordinated family & trousseau sets',
  'Kids party wear and pattu frocks',
];

const MEASUREMENT_GUIDE = [
  { label: 'Bust', detail: 'Around the fullest part of the bust, tape parallel to the floor.' },
  { label: 'Waist', detail: 'At the narrowest point of your torso, usually just above the navel.' },
  { label: 'Shoulder', detail: 'From shoulder tip to shoulder tip across the back.' },
  { label: 'Armhole', detail: 'Around the arm at the shoulder joint, tape snug but not tight.' },
  { label: 'Sleeve length', detail: 'From the shoulder tip to where you want the sleeve to end.' },
  { label: 'Blouse length', detail: 'From the shoulder seam down to the hem you prefer.' },
];

export default function CustomOrdersPage() {
  return (
    <>
      <PageHero
        eyebrow="Bespoke couture"
        title="Commissioned to your measurements"
        description="A piece designed around your body, your colours and your occasion — hooked, painted and stitched by hand in our Coimbatore atelier."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild variant="whatsapp">
            <a
              href={whatsappLink(WHATSAPP_DEFAULT_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Talk to a designer
            </a>
          </Button>
          <Button asChild variant="outline">
            <Link href="#measurements">Measurement guide</Link>
          </Button>
        </div>
      </PageHero>

      {/* Process */}
      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:py-20 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="How it works"
            title="Five steps from idea to heirloom"
            description="Clear timelines, no surprises — and a real person answering every message."
          />
        </Reveal>

        <ol className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map(({ Icon, title, copy }, index) => (
            <Reveal as="li" key={title} delay={index * 0.07}>
              <span className="flex size-11 items-center justify-center rounded-full bg-primary/8 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <p className="eyebrow mt-4 text-gold-600">Step {index + 1}</p>
              <h3 className="mt-2 font-serif text-lg leading-snug">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* What we make */}
      <section className="bg-ivory-200/60 py-16 sm:py-20">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-4 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
          <Reveal>
            <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-ivory-200 shadow-soft">
              <Image
                src={IMG.craft}
                alt="Close-up of hand Aari embroidery being worked"
                fill
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <SectionHeading
              eyebrow="What we make"
              title="Anything you can describe"
              description="If you can share a reference, we can usually make it. Popular commissions include:"
            />
            <ul className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {COMMISSIONS.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink-500">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold-400" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" className="mt-8">
              <Link href="/shop">Or shop ready collections</Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* Measurement guide */}
      <section id="measurements" className="scroll-mt-28 mx-auto max-w-[1400px] px-4 py-16 sm:py-20 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Measurement guide"
            title="Six numbers we need from you"
            description="Wear a well-fitting blouse or a light inner garment while measuring, and keep the tape comfortably snug — not tight."
          />
        </Reveal>

        <dl className="mt-11 grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {MEASUREMENT_GUIDE.map((row, index) => (
            <Reveal key={row.label} delay={index * 0.05}>
              <div className="border-t border-ink-100 pt-5">
                <dt className="font-serif text-lg">{row.label}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {row.detail}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>

        <div className="mt-12 flex flex-col gap-4 rounded-xl border border-gold-200 bg-gold-100/50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex items-start gap-3">
            <CalendarCheck className="mt-0.5 size-5 shrink-0 text-gold-700" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-ink-500">
              Prefer to be measured in person? Studio appointments are available{' '}
              {SITE.hours[0].days.toLowerCase()}, {SITE.hours[0].time}.
            </p>
          </div>
          <Button asChild variant="gold" className="shrink-0">
            <Link href="/contact">Book an appointment</Link>
          </Button>
        </div>
      </section>

      {/* Request form */}
      <section className="border-t border-ink-100 bg-ivory-200/50 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Start your order"
              title="Tell us about your piece"
              description="Fill this in and we will open WhatsApp with your details ready to send — reference images can be attached right in the chat."
              align="center"
            />
          </Reveal>

          <div className="mt-11 rounded-2xl border border-ink-100 bg-card p-6 shadow-soft sm:p-9">
            <CustomOrderForm />
          </div>
        </div>
      </section>
    </>
  );
}
