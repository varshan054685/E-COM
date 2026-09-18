/**
 * Single source of truth for boutique contact details, navigation and links.
 * Change the brand here and it updates the header, footer, WhatsApp FAB and
 * every product inquiry button.
 */

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '919876543210';

export const SITE = {
  name: 'JGTHS Designer Boutique & Aari Couture',
  shortName: 'JGTHS',
  tagline: 'Crafted to be remembered',
  description:
    'Exquisite Aari couture, hand-painted fabrics and traditional weaves — handcrafted in Coimbatore for your most memorable occasions.',

  address: '326, Chinna Thottam Road, Chinniyampalayam',
  city: 'Coimbatore',
  state: 'Tamil Nadu',
  pincode: '641048',
  country: 'India',

  phoneDisplay: '+91 98765 43210',
  phoneHref: '+919876543210',
  whatsapp: WHATSAPP,
  email: 'hello@jgthscouture.in',

  hours: [
    { days: 'Monday – Saturday', time: '10:00 AM – 8:00 PM' },
    { days: 'Sunday', time: 'By appointment only' },
  ],

  instagram: 'https://instagram.com',
  facebook: 'https://facebook.com',
  pinterest: 'https://pinterest.com',
  youtube: 'https://youtube.com',

  currency: 'INR',
} as const;

export const NAV_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'Custom Orders', href: '/custom-orders' },
  { label: 'Kids', href: '/kids' },
  { label: 'About', href: '/about' },
] as const;

export const FOOTER_LINKS = {
  shop: [
    { label: 'Bridal Aari Blouses', href: '/shop?category=bridal-aari' },
    { label: 'Signature Sarees', href: '/shop?category=designer-sarees' },
    { label: 'Hand-Painted Fabrics', href: '/shop?category=hand-painted' },
    { label: 'Kids Party Wear', href: '/shop?category=kids-party-wear' },
    { label: 'View Everything', href: '/shop' },
  ],
  help: [
    { label: 'Custom Orders', href: '/custom-orders' },
    { label: 'Size & Measurement Guide', href: '/custom-orders#measurements' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'About the Atelier', href: '/about' },
  ],
  policies: [
    { label: 'Shipping & Returns', href: '/policies/shipping-returns' },
    { label: 'Privacy Policy', href: '/policies/privacy' },
    { label: 'Terms of Service', href: '/policies/terms' },
  ],
} as const;

/** Build a wa.me deep link with a pre-filled message. */
export function whatsappLink(message: string): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_DEFAULT_MESSAGE =
  'Hello! I would like to know more about your Aari couture collection.';
