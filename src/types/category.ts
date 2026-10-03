export interface ApiCategory {
  _id: string;
  id: string;
  name: string;
  slug: string;
  parent: string | null;
  sort_order: number;
  product_count: number;
}

export interface CategoryWithImage extends ApiCategory {
  img: string;
}
// Homepage promo tile for one category, matched to it by slug.
export interface FeaturedCollection {
  slug: string;
  title: string;
  description: string;
  img: string;
}

export interface FeaturedCollectionLink extends FeaturedCollection {
  categoryId: string;
}
