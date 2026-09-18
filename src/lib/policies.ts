import { SITE } from './site';

export type PolicySection = {
  heading: string;
  body: string[];
};

export type Policy = {
  slug: string;
  title: string;
  summary: string;
  /** ISO date of the last revision. */
  updated: string;
  sections: PolicySection[];
};

const UPDATED = '2026-08-01';

export const POLICIES: Policy[] = [
  {
    slug: 'shipping-returns',
    title: 'Shipping & Returns',
    summary:
      'How we deliver ready pieces, made-to-order couture and custom commissions — plus what can and cannot be returned.',
    updated: UPDATED,
    sections: [
      {
        heading: 'Dispatch timelines',
        body: [
          'Ready-to-ship pieces are dispatched within 5–7 working days.',
          'Made-to-order blouses and sarees are hand-finished and typically dispatched within 2–4 weeks.',
          'Custom commissions follow the timeline confirmed in your quote — usually 4–6 weeks for bridal Aari work.',
        ],
      },
      {
        heading: 'Shipping charges',
        body: [
          'Shipping is complimentary on orders above ₹15,000. Below that, a flat rate of ₹250 applies within India.',
          'Domestic orders are sent insured and tracked. International shipping is quoted individually — message us on WhatsApp with your destination and we will confirm the cost.',
        ],
      },
      {
        heading: 'Alterations',
        body: [
          'Every made-to-measure piece includes one complimentary alteration within 30 days of delivery, provided the original measurements we recorded are unchanged.',
        ],
      },
      {
        heading: 'Returns & exchanges',
        body: [
          'Ready-to-ship pieces may be returned unworn, unwashed and with tags intact within 7 days of delivery for a refund or exchange.',
          'Made-to-order, altered and custom-commissioned pieces are cut specifically for you and cannot be returned. If something is not right, contact us — we will alter or repair it.',
          'Items marked as final sale, and hand-painted pieces where variation is inherent to the craft, are not returnable.',
        ],
      },
      {
        heading: 'Damaged or incorrect items',
        body: [
          'Please inspect your parcel on arrival and message us within 48 hours with photographs if anything is damaged or incorrect. We will arrange a replacement or repair at our cost.',
        ],
      },
    ],
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    summary:
      'What we collect when you shop or commission a piece, how it is used, and the choices you have.',
    updated: UPDATED,
    sections: [
      {
        heading: 'What we collect',
        body: [
          'Contact details you give us — name, phone number, email and delivery address.',
          'Order details, including your measurements and any reference images you share for a commission.',
          'Basic analytics about how the site is used, collected in aggregate.',
        ],
      },
      {
        heading: 'How we use it',
        body: [
          'To produce, deliver and support your order — including sharing your measurements with our tailoring team.',
          'To respond to inquiries and send order updates.',
          'To send collection previews if you subscribe to our newsletter. You can unsubscribe from any email.',
        ],
      },
      {
        heading: 'Measurements and reference images',
        body: [
          `Your measurements are used only to cut your garment. They are stored against your customer record so we can repeat a fit for future orders, and are never shared, sold or published.`,
        ],
      },
      {
        heading: 'Payments',
        body: [
          'Payments are handled by our payment partner. We do not store full card numbers on our servers.',
        ],
      },
      {
        heading: 'Your choices',
        body: [
          `You can ask us to correct or delete your personal data at any time by writing to ${SITE.email}.`,
        ],
      },
    ],
  },
  {
    slug: 'terms',
    title: 'Terms of Service',
    summary:
      'The terms that apply when you order from the boutique, including quotes, payments, and craft-related variation.',
    updated: UPDATED,
    sections: [
      {
        heading: 'Product representation',
        body: [
          'Handcrafted and hand-painted pieces vary slightly between units — in embroidery density, dye depth and weave. These variations are inherent to hand work and are not defects.',
          'Colours may appear differently depending on your screen. We are happy to share additional photographs before you confirm an order.',
        ],
      },
      {
        heading: 'Pricing and quotes',
        body: [
          'Prices on the site are in Indian Rupees and inclusive of applicable taxes.',
          'Custom commissions are confirmed only once you approve the written quote. Fabric cost changes may require a revised quote before work begins.',
        ],
      },
      {
        heading: 'Orders and payment',
        body: [
          'A commission begins once the agreed advance is received. The balance is payable before dispatch.',
          'Read-to-wear orders are confirmed once payment is complete.',
        ],
      },
      {
        heading: 'Cancellations',
        body: [
          'Ready-to-ship orders can be cancelled before dispatch for a full refund.',
          'Custom commissions can be cancelled before cutting begins. Once fabric is cut, the advance is non-refundable as the materials are dedicated to your piece.',
        ],
      },
      {
        heading: 'Contact',
        body: [
          `Questions about these terms can go to ${SITE.email} or ${SITE.phoneDisplay}.`,
        ],
      },
    ],
  },
];

export function getPolicy(slug: string): Policy | undefined {
  return POLICIES.find((policy) => policy.slug === slug);
}

export function getAllPolicySlugs(): string[] {
  return POLICIES.map((policy) => policy.slug);
}
