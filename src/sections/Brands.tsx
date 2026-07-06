const BRANDS = ["BMW", "MERCEDES", "AUDI", "TESLA", "PORSCHE", "TOYOTA", "VOLKSWAGEN", "FORD"];

export function Brands() {
  return (
    <section id="brands" className="overflow-hidden border-y border-border bg-bg-2/40 py-10">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bg to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-bg to-transparent" />

        <div className="flex w-max animate-marquee items-center gap-16 whitespace-nowrap hover:[animation-play-state:paused]">
          {[...BRANDS, ...BRANDS].map((brand, i) => (
            <span
              key={i}
              className="font-display text-sm font-bold tracking-[0.15em] text-fg-muted transition-colors hover:text-accent sm:text-base"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
