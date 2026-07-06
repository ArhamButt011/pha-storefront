import { ShieldCheck, Truck, Headphones } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const REASONS = [
  {
    icon: ShieldCheck,
    title: "Genuine Parts",
    desc: "We source directly from manufacturers to ensure 100% authenticity and perfect fitment every time.",
  },
  {
    icon: Truck,
    title: "Fast Shipping",
    desc: "Expedited dispatch from our Melbourne and Sydney hubs to all corners of Australia and NZ.",
  },
  {
    icon: Headphones,
    title: "Expert Advice",
    desc: "Our team of automotive technicians is ready to help you find the exact part for your specific build.",
  },
];

export function WhyChooseUs() {
  const headRef = useScrollReveal<HTMLDivElement>(0.2);
  const gridRef = useScrollReveal<HTMLDivElement>(0.1);

  return (
    <section id="about" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={headRef} className="reveal mb-14 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Precision, Delivered.</p>
          <h2 className="mx-auto mt-2 max-w-2xl font-display text-2xl font-black tracking-wide text-fg sm:text-3xl">
            We are more than just a shop; we are automotive enthusiasts dedicated to providing the highest quality parts across Australia.
          </h2>
        </div>

        <div ref={gridRef} className="stagger grid gap-8 sm:grid-cols-3">
          {REASONS.map((r) => {
            const Icon = r.icon;
            return (
              <div key={r.title} className="flex flex-col items-center text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-base font-bold text-fg">{r.title}</h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-fg-muted">{r.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
