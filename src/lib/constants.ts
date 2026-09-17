export const ORDER_STATUSES = [
  { value: 'PENDING_PAYMENT', label: 'Pending Payment', tone: 'amber' },
  { value: 'CONFIRMED', label: 'Confirmed', tone: 'blue' },
  { value: 'PROCESSING', label: 'Processing', tone: 'blue' },
  { value: 'IN_PRODUCTION', label: 'In Production', tone: 'violet' },
  { value: 'READY_TO_SHIP', label: 'Ready to Ship', tone: 'teal' },
  { value: 'SHIPPED', label: 'Shipped', tone: 'teal' },
  { value: 'DELIVERED', label: 'Delivered', tone: 'green' },
  { value: 'CANCELLED', label: 'Cancelled', tone: 'red' },
  { value: 'RETURNED', label: 'Returned', tone: 'stone' },
] as const;

export const ORDER_STATUS_VALUES = ORDER_STATUSES.map((s) => s.value);

export const CUSTOM_ORDER_STATUSES = [
  { value: 'NEW_REQUEST', label: 'New Request', tone: 'amber' },
  { value: 'REVIEWING', label: 'Reviewing', tone: 'blue' },
  { value: 'REQUIREMENTS_CONFIRMED', label: 'Requirements Confirmed', tone: 'blue' },
  { value: 'QUOTE_SENT', label: 'Quote Sent', tone: 'violet' },
  { value: 'AWAITING_CUSTOMER', label: 'Awaiting Customer', tone: 'stone' },
  { value: 'PAYMENT_PENDING', label: 'Payment Pending', tone: 'amber' },
  { value: 'CONFIRMED', label: 'Confirmed', tone: 'green' },
  { value: 'IN_PRODUCTION', label: 'In Production', tone: 'violet' },
  { value: 'QUALITY_CHECK', label: 'Quality Check', tone: 'teal' },
  { value: 'READY', label: 'Ready', tone: 'teal' },
  { value: 'SHIPPED', label: 'Shipped', tone: 'teal' },
  { value: 'COMPLETED', label: 'Completed', tone: 'green' },
  { value: 'CANCELLED', label: 'Cancelled', tone: 'red' },
] as const;

export const CUSTOM_ORDER_STATUS_VALUES = CUSTOM_ORDER_STATUSES.map((s) => s.value);

export const PAYMENT_STATUSES: Record<string, string> = {
  UNPAID: 'Unpaid',
  PAID: 'Paid',
  FAILED: 'Failed',
  REFUNDED: 'Refunded',
};

export const CREATION_TYPES = [
  'Designer Blouse',
  'Bridal Blouse',
  'Saree Styling',
  'Aari Embroidery Work',
  'Custom Dress',
  'Other',
] as const;

export const OCCASIONS = [
  'Wedding',
  'Engagement',
  'Reception',
  'Festive',
  'Casual Wear',
  'Corporate Event',
  'Pooja / Traditional',
  'Other',
] as const;

export const SHIPPING_FLAT_RATE = 150;
export const FREE_SHIPPING_THRESHOLD = 10000;

export const PRODUCT_STATUSES = {
  ACTIVE: 'ACTIVE',
  DRAFT: 'DRAFT',
} as const;

export const BADGE_TYPES = {
  NEW: 'NEW',
  BESTSELLER: 'BESTSELLER',
  LIMITED: 'LIMITED',
  MADE_TO_ORDER: 'MADE_TO_ORDER',
} as const;

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'Custom'] as const;