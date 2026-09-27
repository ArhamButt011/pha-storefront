export interface ApiAttachment {
  _id: string;
  url: string;
  original_name: string | null;
  mime_type: string | null;
  type: "image" | "video" | "file";
  uid: string;
  file_name: string | null;
}

export interface ApiCategoryRef {
  _id: string;
  name: string;
  slug: string;
}

export interface ApiVehicle {
  make: string | null;
  model: string | null;
  model_code: string | null;
  year_from: number | null;
  year_to: number | null;
}

export interface ApiListingFitment {
  make: string;
  model: string;
  model_code: string;
  year_from: number | null;
  year_to: number | null;
}

// Public-safe subset of an eBay listing; only on the detail response.
export interface ApiMarketplaceListing {
  platform: string;
  title_override: string | null;
  description_override: string | null;
  price_override: number | null;
  photos: string[];
  condition: string | null;
  condition_notes: string | null;
  warranty: string | null;
  mpn: string | null;
  superseded_part_number: string[];
  authenticity: string | null;
  aspects: Record<string, string>;
  fitment: ApiListingFitment[];
}

// Server-resolved values (override, else product); render as-is. Detail only.
export interface ApiProductDisplay {
  condition: string | null;
  authenticity: string | null;
  warranty: string | null;
  condition_notes: string | null;
  // Same precedence as above and as the Google Merchant feed.
  mpn: string | null;
  vehicle_fitments: ApiVehicle[];
}

// standard: flat shipping_cost per unit; calculated: courier quote at checkout.
export type ShippingMethod = "standard" | "calculated";

export interface ApiProduct {
  _id: string;
  title: string;
  slug: string;
  description: string;
  type: string;
  status: string;
  is_published_online: boolean;
  price: number;
  compare_price: number | null;
  cost_price: number | null;
  sku: string | null;
  // Manufacturer part number; `sku` is the internal stock code.
  mpn: string | null;
  shipping_cost: number | null;
  shipping_method?: ShippingMethod;
  brand: string | null;
  condition: string;
  authenticity: string | null;
  vehicle: ApiVehicle;
  attachments: ApiAttachment[];
  categories: ApiCategoryRef[];
  tags: string[];
  created_at?: string;
  stock_control: boolean;
  stock_count: number | null;
  stock_status: "in_stock" | "low_stock" | "out_of_stock";
  listings?: ApiMarketplaceListing[];
  display?: ApiProductDisplay;
}

// GET /product/search/suggest: just what the autocomplete renders.
export interface ApiProductSuggestion {
  _id: string;
  title: string;
  slug: string;
  sku: string | null;
  mpn: string | null;
  price: number;
  attachments: ApiAttachment[];
}