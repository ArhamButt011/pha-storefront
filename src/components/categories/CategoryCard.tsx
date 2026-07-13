import { Link } from "react-router-dom";
import type { CategoryWithImage } from "@/types/category";

export function CategoryCard({ category }: { category: CategoryWithImage }) {
  return (
    <Link
      to={`/products/${category._id}`}
      className="group overflow-hidden rounded-2xl border border-border bg-bg-2 transition-colors hover:border-accent/40"
    >
      <div className="h-36 overflow-hidden">
        <img
          src={category.img}
          alt={category.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      </div>
      <div className="p-4 text-center">
        <h3 className="font-bold text-fg">{category.name}</h3>
      </div>
    </Link>
  );
}