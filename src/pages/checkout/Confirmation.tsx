import { Link } from "react-router-dom";
import { Truck, Wrench } from "lucide-react";
import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";
import { OrderConfirmedHero } from "@/components/checkout/confirmation/OrderConfirmedHero";
import { WhatsNextCard } from "@/components/checkout/confirmation/WhatsNextCard";
import { LoyaltyProgramBanner } from "@/components/checkout/confirmation/LoyaltyProgramBanner";
import { PrecisionGuaranteedCard } from "@/components/checkout/confirmation/PrecisionGuaranteedCard";
import { ConfirmationSummaryLinks } from "@/components/checkout/confirmation/ConfirmationSummaryLinks";
import { Button } from "@/components/ui/button";
import { DUMMY_ORDER, getDummyOrderTotals } from "@/data/dummyOrder";
import { WHATS_NEXT_ITEMS } from "@/constants/checkout";

const WHATS_NEXT_ICONS = [Truck, Wrench];

export function OrderConfirmation() {
  const { total } = getDummyOrderTotals();
  const pointsEarned = Math.round(total / 10);

  return (
    <div className="min-h-screen bg-bg">
      <CheckoutHeader showReturnToCart={false} />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div>
            <OrderConfirmedHero orderReference={DUMMY_ORDER.reference} />

            <h2 className="mb-4 mt-8 text-lg font-bold text-fg">What's Next</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {WHATS_NEXT_ITEMS.map((item, i) => (
                <WhatsNextCard key={item.title} item={item} icon={WHATS_NEXT_ICONS[i]} />
              ))}
            </div>

            <div className="mt-4">
              <LoyaltyProgramBanner pointsEarned={pointsEarned} />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg">View Order Status</Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>

          <div className="min-w-0 space-y-6 lg:sticky lg:top-8 lg:self-start">
            <PrecisionGuaranteedCard img={DUMMY_ORDER.items[0].img} />
            <ConfirmationSummaryLinks />
          </div>
        </div>
      </main>
    </div>
  );
}
