import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useVehicle } from "@/context/VehicleContext";

export function Hero() {
  const { setVehicle } = useVehicle();

  return (
    <section
      id="home"
      className="relative flex min-h-[85vh] items-center overflow-hidden pt-16"
    >
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&h=1200&fit=crop')" }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-bg via-bg/80 to-bg/50" />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-bg via-bg/40 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
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
              {/* An unsubmitted vehicle draft shouldn't follow the user into
                  the shop — clear it so /shop starts unfiltered. */}
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