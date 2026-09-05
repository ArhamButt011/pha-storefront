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

// Curated, public-safe subset of a MarketplaceListing (currently eBay only) —
// only present on the product detail response, not the list.
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

// Backend-resolved "which value wins" precedence (listing override vs. the
// product's own value) plus deduped vehicle fitment — render this as-is
// rather than re-deriving it on the client. Only on the detail response.
export interface ApiProductDisplay {
  condition: string | null;
  authenticity: string | null;
  warranty: string | null;
  condition_notes: string | null;
  // Backend-resolved listing-override-wins-else-product's-own-value — same
  // precedence as condition/authenticity/warranty above (see
  // listing.resolver.js#resolveIdentifiers in pha-dashboard, the same
  // precedence the Google Merchant feed itself uses for this field).
  mpn: string | null;
  vehicle_fitments: ApiVehicle[];
}

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
  // Manufacturer Part Number — distinct from `sku` (an internal stock
  // code). Confirmed against pha-dashboard's real API response and its
  // Google Merchant adapter, which reads this same field (see
  // listing.resolver.js#resolveIdentifiers).
  mpn: string | null;
  shipping_cost: number | null;
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

// Lightweight shape returned by GET /product/search/suggest — only the
// fields the autocomplete dropdown renders (see product.service.js's
// getProductSuggestions), not a full ApiProduct.
export interface ApiProductSuggestion {
  _id: string;
  title: string;
  slug: string;
  sku: string | null;
  mpn: string | null;
  price: number;
  attachments: ApiAttachment[];
}