// Loading placeholder mirroring CategoryCard's layout, shared between the
// Home page's "Shop by Category" section and the /categories grid page.
export function CategoryCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-bg-2">
      <div className="h-36 animate-pulse bg-bg-3" />
      <div className="p-4 text-center">
        <div className="mx-auto h-4 w-2/3 animate-pulse rounded bg-bg-3" />
      </div>
    </div>
  );
}
