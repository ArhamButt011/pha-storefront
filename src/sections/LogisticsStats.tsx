import { MapPin, PackageSearch } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Button } from "@/components/ui/button";

const STATS = [
  { value: "98%", label: "On-Time Delivery" },
  { value: "2-Day", label: "Average Transit" },
];

export function LogisticsStats() {
  const textRef = useScrollReveal<HTMLDivElement>(0.2);
  const mapRef = useScrollReveal<HTMLDivElement>(0.15);

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Text side */}
          <div ref={textRef} className="reveal">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">National Network</p>
            <h2 className="mt-2 font-display text-2xl font-black tracking-wide text-fg sm:text-3xl">
              Australia-Wide Logistical Excellence
            </h2>
            <p className="mt-4 text-fg-muted">
              Strategically located distribution hubs allow us to reach 90% of Australia
              within 48 hours. Our real-time tracking and animated route mapping ensure
              you're always in the loop.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {STATS.map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-bg-2 px-4 py-5">
                  <div className="font-display text-3xl font-black text-accent">{s.value}</div>
                  <div className="mt-1.5 text-xs font-medium uppercase tracking-wider text-fg-muted">{s.label}</div>
                </div>
              ))}
            </div>

            <Button size="lg" className="mt-8 gap-2">
              <PackageSearch className="h-5 w-5" />
              Track Your Order
            </Button>
          </div>

          {/* Map graphic */}
          <div ref={mapRef} className="reveal">
            <div className="grid-bg relative flex h-72 items-center justify-center overflow-hidden rounded-2xl border border-border bg-bg-3 sm:h-96">
              <div className="flex flex-col items-center">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-accent" />
                </span>
                <span className="mt-2 flex items-center gap-1 rounded-full bg-bg/90 px-2.5 py-1 text-[11px] font-semibold text-fg shadow-soft">
                  <MapPin className="h-3 w-3 text-accent" /> Melbourne Hub
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
