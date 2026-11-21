import { PaymentBrandLogo } from "@/components/product/PaymentBrandLogo";
import { ACCEPTED_CARD_BRANDS, BNPL_OPTIONS } from "@/constants/payments";

/** Payment methods accepted at checkout, shown under the buy buttons. */
export function AcceptedPayments() {
  return (
    <div className="mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm">
      <span className="pt-1 font-semibold text-fg">Payments:</span>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {ACCEPTED_CARD_BRANDS.map((brand) => (
            <PaymentBrandLogo key={brand} brand={brand} />
          ))}
        </div>
        {BNPL_OPTIONS.map((option) => (
          <div key={option.brand} className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <PaymentBrandLogo brand={option.brand} />
            <span className="text-fg-muted">
              {option.tagline}{" "}
              <a
                href={option.learnMoreUrl}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-fg underline underline-offset-2 hover:text-accent"
              >
                Learn more
              </a>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
