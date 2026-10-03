import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import type { Route } from "./+types/Home";
import { Hero } from "@/sections/Hero";
import { VehicleSelector } from "@/sections/VehicleSelector";
import { Categories } from "@/sections/Categories";
import { FeaturedCollections } from "@/sections/FeaturedCollections";
import { Brands } from "@/sections/Brands";
import { Products } from "@/sections/Products";
import { WhyChooseUs } from "@/sections/WhyChooseUs";
import { LogisticsStats } from "@/sections/LogisticsStats";
import { getCategories } from "@/lib/api/categories";
import { getProducts } from "@/lib/api/product";
import { getCategoryImage } from "@/lib/categoryImages";
import { mapApiProductToProduct } from "@/utils/mapApiProduct";
import { toCollectionLinks } from "@/utils/featuredCollections";
import { FEATURED_COLLECTIONS } from "@/constants/collections";
import { getOrigin } from "@/lib/seo";
import type { CategoryWithImage } from "@/types/category";

// Fills each grid: one 5-column Categories row, two 4-column Products rows.
const FEATURED_CATEGORIES_COUNT = 5;
const FEATURED_PRODUCTS_COUNT = 8;

export async function loader({ request }: Route.LoaderArgs) {
  const [categoriesRes, productsRes, collectionsRes] = await Promise.all([
    getCategories({ limit: FEATURED_CATEGORIES_COUNT, page: 1 }),
    getProducts({ page: 1, limit: FEATURED_PRODUCTS_COUNT }),
    getCategories({ slugs: FEATURED_COLLECTIONS.map((c) => c.slug).join(","), limit: FEATURED_COLLECTIONS.length }),
  ]);

  const featuredCategories: CategoryWithImage[] = categoriesRes.data.items.map((cat, index) => ({
    ...cat,
    img: getCategoryImage(cat.slug, index),
  }));

  return {
    featuredCategories,
    featuredProducts: productsRes.data.items.map(mapApiProductToProduct),
    featuredCollections: toCollectionLinks(collectionsRes.data.items),
    origin: getOrigin(request),
  };
}

export function meta({ data }: Route.MetaArgs) {
  const title = "Parts Hub Australia | Premium Automotive Parts";
  const description =
    "Australia's #1 destination for premium automotive parts. Genuine parts, fast delivery, expert support.";
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    ...(data ? [{ property: "og:url", content: data.origin }] : []),
  ];
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const el = document.querySelector(hash);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [hash]);

  return (
    <main>
      <Hero />
      <VehicleSelector />
      <Categories categories={loaderData.featuredCategories} />
      <FeaturedCollections collections={loaderData.featuredCollections} />
      <Brands />
      <Products products={loaderData.featuredProducts} />
      <WhyChooseUs />
      <LogisticsStats />
    </main>
  );
}
