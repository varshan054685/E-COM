import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Ruler } from 'lucide-react';

import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';
import { Button } from '@/components/ui/button';
import { IMG } from '@/lib/images';
import { SITE, WHATSAPP_DEFAULT_MESSAGE, whatsappLink } from '@/lib/site';

export function CustomOrderCta() {
  return (
    <section className="relative isolate overflow-hidden">
      <Image
        src={IMG.customCouture}
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-primary/92" aria-hidden="true" />

      <div className="relative mx-auto max-w-3xl px-4 py-20 text-center text-primary-foreground sm:py-24">
        <p className="eyebrow flex items-center justify-center gap-2 text-gold-300">
          <Ruler className="size-3.5" aria-hidden="true" />
          Bespoke couture
        </p>
        <h2 className="mt-5 font-serif text-3xl leading-[1.15] font-medium text-balance sm:text-4xl lg:text-[2.75rem]">
          Have something specific in mind?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-primary-foreground/80 sm:text-base">
          Share a reference, a colour palette or a sketch. We will quote your piece,
          source the fabric and stitch it to your measurements — usually within four
          weeks.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" variant="gold">
            <Link href="/custom-orders">
              Start a custom order
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-primary-foreground/35 text-primary-foreground hover:border-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <a
              href={whatsappLink(WHATSAPP_DEFAULT_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon className="size-4" />
              Chat with {SITE.shortName}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
