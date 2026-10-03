import type { FeaturedCollection } from "@/types/category";

// Slugs must match the categories created in the dashboard.
export const FEATURED_COLLECTIONS: FeaturedCollection[] = [
  {
    slug: "popular-bundles",
    title: "Popular Bundles",
    description: "Curated part kits built to fit together, priced to bundle.",
    img: "https://images.unsplash.com/photo-1774902410486-648614277f1f?w=1200&h=700&fit=crop",
  },
  {
    slug: "body-kits",
    title: "Body Kits",
    description: "Bumpers, skirts, spoilers and styling upgrades for your build.",
    img: "https://images.unsplash.com/photo-1621568671022-48fa5b60a75a?w=1200&h=700&fit=crop",
  },
];
