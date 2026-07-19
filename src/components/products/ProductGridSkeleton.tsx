import { ProductCardSkeleton } from "@/components/products/ProductCardSkeleton";
import { cn } from "@/utils/cn";

export interface ProductGridSkeletonProps {
  count: number;
  className?: string;
}

// Same grid classes as the real product grid in ProductsListing, so swapping
// skeleton <-> real cards doesn't reflow the page.
export function ProductGridSkeleton({ count, className }: ProductGridSkeletonProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
