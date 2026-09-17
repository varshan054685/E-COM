export const SITE = {
  name: 'JGTHS Designer Boutique & Aari Couture',
  shortName: 'JGTHS',
  tagline: 'Crafted to be remembered',
  addressLine1: '326, Chinna Thottam Road',
  addressLine2: 'Chinniyampalayam',
  city: 'Coimbatore',
  state: 'Tamil Nadu',
  pincode: '641048',
  country: 'India',
  fullAddress:
    '326, Chinna Thottam Road, Chinniyampalayam, Coimbatore, Tamil Nadu 641048, India',
  phone: '+91 98765 43210',
  whatsapp: process.env.WHATSAPP_NUMBER || '919876543210',
  email: 'hello@jgthscouture.in',
  hours: [
    { days: 'Monday – Saturday', time: '10:00 AM – 8:00 PM' },
    { days: 'Sunday', time: 'By appointment' },
  ],
  mapsEmbed:
    'https://www.google.com/maps?q=Chinniyampalayam,Coimbatore,Tamil+Nadu+641048&output=embed',
  mapsLink: 'https://www.google.com/maps/search/?api=1&query=Chinniyampalayam%2C%20Coimbatore%2C%20Tamil%20Nadu%20641048',
  instagram: 'https://instagram.com',
  facebook: 'https://facebook.com',
  currency: 'INR',
};

export function whatsappLink(message: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}