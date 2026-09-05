// Loading placeholder mirroring ProductDetails' above-the-fold layout
// (image gallery, title, price, stock line, action buttons) so the page
// doesn't jump once real data replaces it.
export function ProductDetailSkeleton() {
  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-20 lg:pt-28 sm:px-6 lg:px-8">
      <div className="mb-6 h-4 w-64 animate-pulse rounded bg-bg-3" />

      <div className="grid gap-10 md:grid-cols-2">
        <div className="flex gap-4">
          <div className="flex w-20 shrink-0 flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-xl bg-bg-3" />
            ))}
          </div>
          <div className="aspect-square flex-1 animate-pulse rounded-2xl bg-bg-3" />
        </div>

        <div>
          <div className="h-3 w-24 animate-pulse rounded-full bg-bg-3" />
          <div className="mt-4 h-7 w-4/5 animate-pulse rounded bg-bg-3" />
          <div className="mt-3 h-4 w-3/5 animate-pulse rounded bg-bg-3" />

          <div className="mt-6 h-9 w-32 animate-pulse rounded bg-bg-3" />

          <div className="mt-5 space-y-2.5">
            <div className="h-4 w-56 animate-pulse rounded bg-bg-3" />
            <div className="h-4 w-40 animate-pulse rounded bg-bg-3" />
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <div className="h-11 w-32 animate-pulse rounded-full bg-bg-3" />
            <div className="h-11 flex-1 animate-pulse rounded-full bg-bg-3" />
          </div>
          <div className="mt-3 h-11 w-full animate-pulse rounded-full bg-bg-3" />

          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-border pt-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-4 w-2/3 animate-pulse rounded bg-bg-3" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
