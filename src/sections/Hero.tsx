import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useVehicle } from "@/context/VehicleContext";

export function Hero() {
  const { setVehicle } = useVehicle();

  return (
    <section
      id="home"
      className="relative flex min-h-[65vh] lg:min-h-[85vh] items-center overflow-hidden lg:pt-16 pt-0"
    >
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero.webp')" }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-bg/45 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Premium Performance Excellence
            </span>
          </div>

          <h1 className="font-display text-4xl font-black leading-tight text-fg sm:text-5xl lg:text-6xl">
            Australia's Trusted
            <br />
            <span className="text-accent glow-orange">Automotive Parts</span> Supplier
          </h1>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="gap-2">
              {/* Clear any vehicle draft so /shop starts unfiltered. */}
              <Link to="/shop" onClick={() => setVehicle(null)}>
                Shop Parts
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}