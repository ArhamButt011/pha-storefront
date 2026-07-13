export interface ApiCategory {
  _id: string;
  id: string;
  name: string;
  slug: string;
  parent: string | null;
  sort_order: number;
}

export interface CategoryWithImage extends ApiCategory {
  img: string;
}