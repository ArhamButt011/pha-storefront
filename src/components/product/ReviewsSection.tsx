import { StarRating } from "@/components/ui/star-rating";
import { Button } from "@/components/ui/button";
import type { Product } from "@/data/products";

export function ReviewsSection({ product }: { product: Product }) {
  const reviews = product.reviews ?? [];
  const count = product.reviewCount ?? reviews.length;

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-fg">Customer Reviews</h2>
          <div className="mt-1.5 flex items-center gap-2">
            <StarRating rating={product.rating} />
            <span className="text-sm font-semibold text-fg">{product.rating.toFixed(1)} / 5.0</span>
            {count > 0 && <span className="text-sm text-fg-muted">({count} Reviews)</span>}
          </div>
        </div>
        <Button variant="outline">Write a Review</Button>
      </div>

      <div className="mt-6 space-y-4">
        {reviews.length > 0 ? (
          reviews.map((r) => (
            <div key={`${r.name}-${r.date}`} className="rounded-2xl border border-border bg-bg-2 p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bg-3 font-bold text-fg">
                  {r.name.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-fg">{r.name}</div>
                  <div className="text-xs text-fg-muted">
                    {new Date(r.date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                  </div>
                </div>
                <StarRating rating={r.rating} />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">{r.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-fg-muted">No reviews yet — be the first to share your experience.</p>
        )}
      </div>
    </section>
  );
}
