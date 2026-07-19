// Loading placeholder mirroring ProductCard's layout (image, label, title,
// price + action buttons, stock row) so the shop grid doesn't jump/reflow
// once real data replaces it.
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-bg-2">
      <div className="h-48 animate-pulse bg-bg-3" />

      <div className="flex flex-1 flex-col p-5">
        <div className="h-3 w-1/3 animate-pulse rounded bg-bg-3" />
        <div className="mb-4 mt-2 h-4 w-4/5 animate-pulse rounded bg-bg-3" />

        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="h-6 w-16 animate-pulse rounded bg-bg-3" />
          <div className="flex shrink-0 items-center gap-2">
            <div className="h-10 w-10 animate-pulse rounded-full bg-bg-3" />
            <div className="h-10 w-10 animate-pulse rounded-full bg-bg-3" />
          </div>
        </div>

        <div className="mt-3 h-3 w-20 animate-pulse rounded bg-bg-3" />
      </div>
    </div>
  );
}
