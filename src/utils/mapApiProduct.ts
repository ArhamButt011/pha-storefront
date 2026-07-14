import type { ApiProduct } from "@/types/apiProduct";
import type { Product } from "@/data/products";

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1600861194942-f883de0dfe96?w=500&h=500&fit=crop";

function formatYearRange(yearFrom: number | null, yearTo: number | null): string {
  if (yearFrom && yearTo) return yearFrom === yearTo ? `${yearFrom}` : `${yearFrom} – ${yearTo}`;
  if (yearFrom) return `${yearFrom} – Present`;
  if (yearTo) return `Up to ${yearTo}`;
  return "—";
}

export function mapApiProductToProduct(item: ApiProduct): Product {
  const hasDiscount = item.compare_price != null && item.compare_price > item.price;
  const primaryCategory = item.categories?.[0];

  const vehicleFitments =
    item.vehicle?.make || item.vehicle?.model
      ? [
          {
            make: item.vehicle.make ?? "—",
            model: item.vehicle.model ?? "—",
            series: item.vehicle.model_code ?? "—",
            yearRange: formatYearRange(item.vehicle.year_from, item.vehicle.year_to),
          },
        ]
      : [];

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
    stock: { status: "in-stock", label: "In Stock" },
   fits: item.vehicle?.make ? [item.vehicle.make] : "all",
   make: item.vehicle?.make ?? null,
   model: item.vehicle?.model ?? null,
   model_code: item.vehicle?.model_code ?? null,
   year_from: item.vehicle?.year_from ?? null,
   year_to: item.vehicle?.year_to ?? null,
vehicleFit: item.vehicle ?? null,
    condition: item.condition ?? undefined,
    authenticity: item.authenticity ?? undefined,
    productNote: item.description || undefined,
    vehicleFitments,
  };
}