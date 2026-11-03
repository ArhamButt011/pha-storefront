import { Mail } from "lucide-react";
import type { Route } from "./+types/ShippingPolicy";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Button } from "@/components/ui/button";
import { SHIPPING_POLICY_POINTS } from "@/constants/shippingPolicy";
import { SUPPORT_EMAIL } from "@/constants/contact";

// Static content, no loader — same pattern as ReturnsPolicy.
export function meta({}: Route.MetaArgs) {
  const title = "Shipping Policy | Parts Hub Australia";
  const description =
    "Read Parts Hub Australia's shipping policy — return window, condition requirements, and how refunds are processed.";
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
  ];
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

      <div className="mt-8 rounded-2xl border border-border bg-bg-2 p-6 sm:p-8">
        <ul className="space-y-4">
          {SHIPPING_POLICY_POINTS.map((point) => (
            <li key={point} className="flex gap-3 text-sm leading-relaxed text-fg-muted sm:text-base">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex flex-col items-start gap-3 rounded-2xl border border-border bg-bg-2 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <p className="text-sm text-fg-muted">Questions about your order? Get in touch and we'll help.</p>
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
