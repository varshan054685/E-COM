export const FREE_SHIPPING_THRESHOLD = 10000;
export const SHIPPING_FLAT_RATE = 150;

export function isValidPincode(pincode: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pincode);
}

export function isValidPhone(phone: string): boolean {
  return /^[6-9][0-9]{9}$/.test(phone.replace(/[\s-]/g, ''));
}

export function validateAddressInput(input: {
  fullName?: string;
  phone?: string;
  line1?: string;
  city?: string;
  state?: string;
  pincode?: string;
}) {
  const errors: Record<string, string> = {};
  if (!input.fullName || input.fullName.trim().length < 2) errors.fullName = 'Please enter the recipient name';
  if (!input.phone || !isValidPhone(input.phone)) errors.phone = 'Enter a valid 10-digit Indian mobile number';
  if (!input.line1 || input.line1.trim().length < 4) errors.line1 = 'Enter your address';
  if (!input.city || input.city.trim().length < 2) errors.city = 'Enter your city';
  if (!input.state || input.state.trim().length < 2) errors.state = 'Enter your state';
  if (!input.pincode || !isValidPincode(input.pincode)) errors.pincode = 'Enter a valid 6-digit pincode';
  return errors;
}

export function computeShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD || subtotal <= 0 ? 0 : SHIPPING_FLAT_RATE;
}

export function applyCoupon(
  subtotal: number,
  coupon: { type: string; value: number; maxDiscount: number | null; minOrderValue: number } | null,
): { discount: number } {
  if (!coupon || subtotal < coupon.minOrderValue) return { discount: 0 };
  const raw =
    coupon.type === 'PERCENTAGE' ? (subtotal * coupon.value) / 100 : coupon.value;
  const capped = coupon.maxDiscount ? Math.min(raw, coupon.maxDiscount) : raw;
  return { discount: Math.min(capped, subtotal) };
}