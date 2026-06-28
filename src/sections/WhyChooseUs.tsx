import { ShieldCheck, Zap, HeadphonesIcon } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const REASONS = [
  {
    icon: ShieldCheck,
    title: "100% Genuine Parts",
    desc: "Every component we sell is sourced directly from certified manufacturers, ensuring maximum performance and safety.",
  },
  {
    icon: Zap,
    title: "Nationwide Express Delivery",
    desc: "We know you need your car back on the road. We offer next-day delivery to most major Australian cities.",
  },
  {
    icon: HeadphonesIcon,
    title: "Expert Technical Support",
    desc: "Unsure what fits your vehicle? Our team of qualified mechanics is on standby to help you find the exact part.",
  },
];

export function WhyChooseUs() {
  const textRef = useScrollReveal<HTMLDivElement>(0.2);
  const imagesRef = useScrollReveal<HTMLDivElement>(0.15);

  return (
    <section id="about" className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-accent/5 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-20 lg:grid-cols-2">
          {/* Text side */}
          <div ref={textRef} className="reveal">
            <h2 className="font-display text-3xl font-black tracking-wider text-fg sm:text-5xl">
              WHY CHOOSE{" "}
              <span className="text-accent">PARTS HUB?</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-fg-muted">
              We're not just another parts store. With over a decade of experience serving Australian motorists,
              we've built our reputation on reliability, authenticity, and unparalleled customer service.
            </p>

            <div className="mt-10 space-y-8">
              {REASONS.map((r) => {
                const Icon = r.icon;
                return (
                  <div key={r.title} className="flex items-start gap-5">
                    <div className="pulse-ring relative mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/15">
                      <Icon className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-fg">{r.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{r.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Image grid */}
          <div ref={imagesRef} className="reveal grid grid-cols-2 gap-4">
            <div className="mt-12 space-y-4">
              <img
                src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=500&fit=crop"
                alt="Car engine"
                className="float h-64 w-full rounded-2xl border border-border object-cover"
                loading="lazy"
              />
              <img
                src="https://images.unsplash.com/photo-1493238792000-8113da705763?w=400&h=300&fit=crop"
                alt="Car at night"
                className="h-44 w-full rounded-2xl border border-border object-cover"
                loading="lazy"
              />
            </div>
            <div className="space-y-4">
              <img
                src="https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=400&h=300&fit=crop"
                alt="Mechanic working on car"
                className="h-44 w-full rounded-2xl border border-border object-cover"
                loading="lazy"
              />
              <div className="float-delay flex h-64 flex-col items-center justify-center rounded-2xl bg-accent p-8 text-center">
                <span className="font-display text-5xl font-black text-accent-fg">10+</span>
                <span className="mt-2 text-sm font-semibold text-accent-fg/85">Years of Excellence in Australia</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
