export type ProductBadge = {
  type: 'NEW' | 'BESTSELLER' | 'LIMITED' | 'MADE_TO_ORDER';
  label: string;
};

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  categorySlug?: string | null;
  categoryName?: string | null;
  images: string[];
  badge?: ProductBadge | null;
  stock: number;
  isMadeToOrder?: boolean;
  ratingAmount?: number | null;
  reviewCount?: number;
};

export type CartLine = {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  image: string | null;
  price: number;
  compareAtPrice: number | null;
  size: string | null;
  color: string | null;
  quantity: number;
  stock: number;
  categorySlug: string | null;
};

export type AddressInput = {
  label?: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
};

export type MeasurementInput = {
  name: string;
  bust?: string;
  waist?: string;
  hip?: string;
  shoulder?: string;
  sleeveLength?: string;
  armhole?: string;
  blouseLength?: string;
  frontNeckDepth?: string;
  backNeckDepth?: string;
  notes?: string;
  isDefault?: boolean;
};

export type CustomOrderInput = {
  creationType: string;
  occasion?: string;
  preferredColor?: string;
  fabric?: string;
  embroideryStyle?: string;
  neckDesign?: string;
  sleeveDesign?: string;
  backDesign?: string;
  additionalNotes?: string;
  standardSize?: string;
  useCustomMeasurements: boolean;
  measurements?: Record<string, string>;
  measurementProfileId?: string;
  deadline?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  images?: string[];
};

export type HomeContent =
  | null
  | Record<string, string | Record<string, string | string[]>>;