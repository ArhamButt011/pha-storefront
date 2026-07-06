import { Link } from "react-router-dom";
import type { CategoryMeta } from "@/data/categories";

export function CategoryCard({ category }: { category: CategoryMeta }) {
  return (
    <Link
      to={`/products/${category.slug}`}
      className="group overflow-hidden rounded-2xl border border-border bg-bg-2 transition-colors hover:border-accent/40"
    >
      <div className="h-36 overflow-hidden">
        <img
          src={category.img}
          alt={category.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      </div>
      <div className="p-4 text-center">
        <h3 className="font-bold text-fg">{category.title}</h3>
      </div>
    </Link>
  );
}
