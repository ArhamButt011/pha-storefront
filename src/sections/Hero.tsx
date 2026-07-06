import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[85vh] items-center overflow-hidden pt-16"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&h=1200&fit=crop')" }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-bg via-bg/80 to-bg/50" />
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-bg via-bg/40 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Premium Performance Excellence
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl font-black leading-tight text-fg sm:text-5xl lg:text-6xl">
            Australia's Trusted
            <br />
            <span className="text-accent glow-orange">Automotive Parts</span> Supplier
          </h1>

          {/* Subtitle */}
          <p className="mt-6 max-w-xl text-base leading-relaxed text-fg-muted">
            Genuine &amp; Aftermarket Parts for Thousands of Vehicles. Precision engineered
            components for BMW, Mercedes, Tesla, and Porsche specialists.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="gap-2">
              Shop Parts
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="gap-2" asChild>
              <a href="#vehicle-selector">
                <Search className="h-4 w-4" />
                Find Your Vehicle
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
