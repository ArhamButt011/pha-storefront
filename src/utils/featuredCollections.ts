import { FEATURED_COLLECTIONS } from "@/constants/collections";
import { SHOP_FILTER_PARAMS } from "@/constants/shopFilters";
import type { ApiCategory, FeaturedCollectionLink } from "@/types/category";

/** Collections whose category exists, in their configured order. */
export function toCollectionLinks(categories: ApiCategory[]): FeaturedCollectionLink[] {
  const idBySlug = new Map(categories.map((c) => [c.slug, c._id]));
  return FEATURED_COLLECTIONS.flatMap((collection) => {
    const categoryId = idBySlug.get(collection.slug);
    return categoryId ? [{ ...collection, categoryId }] : [];
  });
}

/** Shop page with only this category ticked in the filters. */
export const shopCategoryHref = (categoryId: string) =>
  `/shop?${new URLSearchParams({ [SHOP_FILTER_PARAMS.categories]: categoryId })}`;
