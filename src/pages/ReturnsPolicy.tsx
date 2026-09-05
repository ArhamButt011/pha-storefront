import { Mail } from "lucide-react";
import type { Route } from "./+types/ReturnsPolicy";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { Button } from "@/components/ui/button";
import { RETURNS_POLICY_POINTS } from "@/constants/returnsPolicy";
import { SUPPORT_EMAIL } from "@/constants/contact";

// Static content, no loader — same pattern as BundlesListing. Still gets a
// `meta` export since this is real, crawlable content worth indexing.
export function meta({}: Route.MetaArgs) {
  const title = "Returns Policy | Parts Hub Australia";
  const description =
    "Read Parts Hub Australia's returns policy — eligibility window, condition requirements, and how refunds are processed.";
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
  ];
}

export default function ReturnsPolicy() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Returns Policy" }]} />
      </div>

      <h1 className="font-display text-3xl font-black tracking-wide text-fg sm:text-4xl">
        Returns Policy
      </h1>

      <div className="mt-8 rounded-2xl border border-border bg-bg-2 p-6 sm:p-8">
        <ul className="space-y-4">
          {RETURNS_POLICY_POINTS.map((point) => (
            <li key={point} className="flex gap-3 text-sm leading-relaxed text-fg-muted sm:text-base">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex flex-col items-start gap-3 rounded-2xl border border-border bg-bg-2 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <p className="text-sm text-fg-muted">Questions about a return? Get in touch and we'll help.</p>
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
