import { Mail } from "lucide-react";
import type { Route } from "./+types/ShippingPolicy";
import { buildMeta } from "@/lib/seo";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Button } from "@/components/ui/button";
import { SHIPPING_POLICY_SECTIONS } from "@/constants/shippingPolicy";
import { SUPPORT_EMAIL } from "@/constants/contact";

// Static content, no loader, like ReturnsPolicy.
export function meta({ matches }: Route.MetaArgs) {
  return buildMeta(matches, {
    title: "Shipping Policy",
    description: "Our shipping policy: dispatch times, delivery costs, tracking, and click & collect.",
    path: "/shipping-policy",
  });
}

export default function ShippingPolicy() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Shipping Policy" }]} />
      </div>

      <h1 className="font-display text-3xl font-black tracking-wide text-fg sm:text-4xl">
        Shipping Policy
      </h1>

      {SHIPPING_POLICY_SECTIONS.map((section) => (
        <section key={section.title} className="mt-8 rounded-2xl border border-border bg-bg-2 p-6 sm:p-8">
          <h2 className="mb-5 font-display text-lg font-bold tracking-wide text-fg">{section.title}</h2>
          <ul className="space-y-4">
            {section.points.map((point) => (
              <li key={point} className="flex gap-3 text-sm leading-relaxed text-fg-muted sm:text-base">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <div className="mt-8 flex flex-col items-start gap-3 rounded-2xl border border-border bg-bg-2 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h2 className="mb-1 font-display text-lg font-bold tracking-wide text-fg">Need Help?</h2>
          <p className="text-sm text-fg-muted">
            Have questions about your delivery or collection? Get in touch with our team, and we'll be happy to help.
          </p>
        </div>
        <Button asChild className="gap-2 shrink-0">
          <a href={`mailto:${SUPPORT_EMAIL}`}>
            <Mail className="h-4 w-4" />
            Contact Us
          </a>
        </Button>
      </div>
    </main>
  );
}
