import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { shopCategoryHref } from "@/utils/featuredCollections";
import type { FeaturedCollectionLink } from "@/types/category";

export function CollectionCard({ collection }: { collection: FeaturedCollectionLink }) {
  return (
    <Link
      to={shopCategoryHref(collection.categoryId)}
      className="product-card shine group relative block h-64 overflow-hidden rounded-2xl sm:h-72"
    >
      <img src={collection.img} alt={collection.title} className="card-img h-full w-full object-cover" loading="lazy" />
      {/* Scrim keeps white text legible over any photo. */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <h3 className="font-display text-xl font-black tracking-wide text-white sm:text-2xl">{collection.title}</h3>
        <p className="mt-1.5 max-w-md text-sm text-white/80">{collection.description}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-all group-hover:gap-2.5">
          Shop now <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
