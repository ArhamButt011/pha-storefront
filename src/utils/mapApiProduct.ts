import type { ApiProduct, ApiVehicle } from "@/types/apiProduct";
import type { Product, VehicleFitmentRow } from "@/data/products";
import { mapApiStockStatus, stockLabel } from "@/constants/stock";

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1600861194942-f883de0dfe96?w=500&h=500&fit=crop";

function formatYearRange(yearFrom: number | null, yearTo: number | null): string {
  if (yearFrom && yearTo) return yearFrom === yearTo ? `${yearFrom}` : `${yearFrom} – ${yearTo}`;
  if (yearFrom) return `${yearFrom} – Present`;
  if (yearTo) return `Up to ${yearTo}`;
  return "—";
}

// Formatting only — which fitments to show and de-duplication already
// happened server-side (item.display.vehicle_fitments).
function fitmentToRow(f: ApiVehicle): VehicleFitmentRow {
  return {
    make: f.make || "—",
    model: f.model || "—",
    series: f.model_code || "—",
    yearRange: formatYearRange(f.year_from, f.year_to),
  };
}

// Additional spec rows sourced from the listing: superseded/cross-reference
// part numbers and any free-form item specifics (e.g. "Color: Black").
function buildListingSpecs(item: ApiProduct) {
  const listing = item.listings?.[0];
  if (!listing) return [];

  const specs: { label: string; value: string }[] = [];
  if (listing.superseded_part_number.length > 0) {
    specs.push({ label: "Superseded Part Number(s)", value: listing.superseded_part_number.join(", ") });
  }
  for (const [label, value] of Object.entries(listing.aspects)) {
    if (value) specs.push({ label, value });
  }
  return specs;
}

export function mapApiProductToProduct(item: ApiProduct): Product {
  const hasDiscount = item.compare_price != null && item.compare_price > item.price;
  const primaryCategory = item.categories?.[0];
  const display = item.display;

  const galleryImages =
    item.attachments && item.attachments.length > 0
      ? item.attachments.map((a) => a.url)
      : [PLACEHOLDER_IMG];

  return {
    id: item._id,
    categorySlug: primaryCategory?.slug ?? "",

    slug: item.slug,
    categoryName: primaryCategory?.name,
    brand: item.brand ?? "Generic",
    partType: item.tags?.[0] ?? primaryCategory?.name ?? "Part",
    title: item.title,
    img: galleryImages[0],
    gallery: galleryImages,
    rating: 0,
    price: item.price,
    oldPrice: hasDiscount ? item.compare_price! : undefined,
    badge: hasDiscount ? "sale" : undefined,
    stock: (() => {
      const status = mapApiStockStatus(item.stock_status);
      return { status, label: stockLabel(status, item.stock_count) };
    })(),
   fits: item.vehicle?.make ? [item.vehicle.make] : "all",
   make: item.vehicle?.make ?? null,
   model: item.vehicle?.model ?? null,
   model_code: item.vehicle?.model_code ?? null,
   year_from: item.vehicle?.year_from ?? null,
   year_to: item.vehicle?.year_to ?? null,
vehicleFit: item.vehicle ?? null,
    sku: item.sku ?? undefined,
    // `display` is the backend's already-resolved precedence (listing
    // override wins, else the product's own value) — rendered as-is rather
    // than re-derived here. Title/description/price/photo overrides are
    // deliberately excluded from `display` server-side: those are meant for
    // that specific marketplace's listing page, not the storefront (the
    // description override in particular is a full HTML page template, not
    // plain text fit for this display).
    condition: display?.condition ?? item.condition ?? undefined,
    conditionNotes: display?.condition_notes ?? undefined,
    authenticity: display?.authenticity ?? item.authenticity ?? undefined,
    warranty: display?.warranty ?? undefined,
    productNote: item.description || undefined,
    vehicleFitments: (display?.vehicle_fitments ?? []).map(fitmentToRow),
    specs: buildListingSpecs(item),
  };
}