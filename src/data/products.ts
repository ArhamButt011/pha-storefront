export type StockStatus = "in-stock" | "limited" | "out-of-stock";
export type Badge = "top-rated" | "sale";

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductVehicleFit {
  make: string | null;
  model: string | null;
  model_code: string | null;
  year_from: number | null;
  year_to: number | null;
}

export interface VehicleFitmentRow {
  make: string;
  model: string;
  series: string;
  yearRange: string;
}

export interface ProductReview {
  name: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  slug: string;
  categorySlug: string;
  categoryName?: string;
  brand: string;
  partType: string;
  title: string;
  img: string;
  rating: number;
  price: number;
  oldPrice?: number;
  badge?: Badge;
  stock: { status: StockStatus; label: string };
  fits: string[] | "all";
  vehicleFit?: ProductVehicleFit | null;
make?: string | null;
  model?: string | null;
  model_code?: string | null;
  year_from?: number | null;
  year_to?: number | null;
  grade?: string;
  gallery?: string[];
  sku?: string;
  mpn?: string;
  supersededPartNumbers?: string[];
  shippingCost?: number | null;
  /** Raw available units from the backend; null = untracked/unlimited. */
  stockCount?: number | null;
  brandFull?: string;
  warranty?: string;
  material?: string;
  condition?: string;
  conditionNotes?: string;
  authenticity?: string;
  productNote?: string;
  vehicleFitments?: VehicleFitmentRow[];
  shortDescription?: string;
  engineeringNote?: string;
  features?: string[];
  specs?: ProductSpec[];
  compatibility?: string[];
  fitmentConfirmedFor?: string;
  reviewCount?: number;
  reviews?: ProductReview[];
}