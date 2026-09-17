export const CUSTOM_ORDER_STATUSES: Array<{ value: string; label: string; tone: string }> = [
  { value: 'NEW_REQUEST', label: 'Request received', tone: 'amber' },
  { value: 'REQUIREMENTS_CONFIRMED', label: 'Requirements confirmed', tone: 'blue' },
  { value: 'QUOTE_SENT', label: 'Quote sent', tone: 'violet' },
  { value: 'AWAITING_CUSTOMER', label: 'Awaiting your go-ahead', tone: 'stone' },
  { value: 'PAYMENT_PENDING', label: 'Payment pending', tone: 'amber' },
  { value: 'IN_PRODUCTION', label: 'In production', tone: 'violet' },
  { value: 'QUALITY_CHECK', label: 'Quality check', tone: 'teal' },
  { value: 'READY', label: 'Ready for dispatch', tone: 'teal' },
  { value: 'SHIPPED', label: 'Shipped', tone: 'teal' },
  { value: 'COMPLETED', label: 'Completed', tone: 'green' },
  { value: 'CANCELLED', label: 'Cancelled', tone: 'red' },
];

export const CUSTOM_ORDER_STATUS_LABELS: Record<string, string> = Object.fromEntries(
  CUSTOM_ORDER_STATUSES.map((s) => [s.value, s.label]),
);

export const CUSTOM_ORDER_PAYMENT_STATUSES = ['UNPAID', 'PARTIAL', 'PAID'] as const;

export const CANCELLABLE_CUSTOM_ORDER_STATUSES = [
  'NEW_REQUEST',
  'REQUIREMENTS_CONFIRMED',
  'QUOTE_SENT',
  'AWAITING_CUSTOMER',
  'PAYMENT_PENDING',
];

export const ORDER_FLOW = [
  'PENDING_PAYMENT',
  'CONFIRMED',
  'PROCESSING',
  'IN_PRODUCTION',
  'READY_TO_SHIP',
  'SHIPPED',
  'DELIVERED',
] as const;

export const GARMENT_TYPES = [
  'Aari Blouse',
  'Aari Lehenga Choli',
  'Designer Saree Blouse',
  'Bridal Trousseau',
  'Half-Saree (Langa Voni) Set',
  'Custom Aari Couture',
] as const;

export const OCCASIONS = ['Wedding', 'Engagement', 'Reception', 'Festival / Pooja', 'Party', 'Idea without a date'] as const;

export const FABRICS = [
  'Kanjivaram Silk',
  'Banarasi Silk',
  'Raw Silk',
  'Tissue Silk',
  'Georgette',
  'Velvet',
  'Net',
  'Cotton Silk',
  'Not sure — advise me',
] as const;

export const EMBROIDERY_STYLES = [
  'Aari handwork',
  'Zardozi',
  'Bead & pearl work',
  'Mirror work',
  'Sequins',
  'Threadwork',
  'Mix — designer discretion',
] as const;

export const NECK_DESIGNS = [
  'Round',
  'Sweetheart',
  'V-neck',
  'Boat (U)',
  'High neck',
  'Square',
  'Keyhole',
] as const;

export const SLEEVE_DESIGNS = [
  'Cap sleeve',
  'Short sleeve',
  'Elbow sleeve',
  '¾ sleeve',
  'Full sleeve',
  'Sleeveless (dori)',
] as const;

export const BACK_DESIGNS = [
  'Clean back',
  'Dori',
  'Lace-up',
  'Butterfly',
  'Buttons',
  'Cut-out',
  'Back hook',
] as const;

export const STANDARD_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;

export function defaultDeadlineInDays(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}