import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Truck, Wrench, Loader2, AlertTriangle, XCircle } from "lucide-react";
import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";
import { OrderConfirmedHero } from "@/components/checkout/confirmation/OrderConfirmedHero";
import { WhatsNextCard } from "@/components/checkout/confirmation/WhatsNextCard";
import { LoyaltyProgramBanner } from "@/components/checkout/confirmation/LoyaltyProgramBanner";
import { PrecisionGuaranteedCard } from "@/components/checkout/confirmation/PrecisionGuaranteedCard";
import { ConfirmationSummaryLinks } from "@/components/checkout/confirmation/ConfirmationSummaryLinks";
import { Button } from "@/components/ui/button";
import { getOrder, type ApiOrder } from "@/lib/api/orders";
import { ApiError } from "@/lib/api/client";
import { clearCart } from "@/store/cartSlice";
import { resetCheckout } from "@/store/checkoutSlice";
import type { AppDispatch } from "@/store/store";
import { WHATS_NEXT_ITEMS } from "@/constants/checkout";

const WHATS_NEXT_ICONS = [Truck, Wrench];
const POLL_INTERVAL_MS = 2500;
const POLL_TIMEOUT_MS = 30_000;
const PRECISION_IMG =
  "https://images.unsplash.com/photo-1600861194942-f883de0dfe96?w=400&h=400&fit=crop";

type Phase = "loading" | "polling" | "ready" | "timeout" | "cancelled" | "error";

export function OrderConfirmation() {
  // Source of truth is the URL, never Redux — stripe.confirmPayment() can do
  // a full-page 3DS redirect that wipes any in-memory/non-persisted state.
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const orderId = searchParams.get("order_id");
  const token = searchParams.get("token");

  const [order, setOrderState] = useState<ApiOrder | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const clearedRef = useRef(false);

  useEffect(() => {
    if (!orderId || !token) {
      setPhase("error");
      setErrorMessage("Missing order reference — this link looks incomplete.");
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const startedAt = Date.now();

    async function poll() {
      try {
        const res = await getOrder(orderId!, token!);
        if (cancelled) return;
        setOrderState(res.data);

        if (res.data.status === "paid" || res.data.status === "fulfilled" || res.data.status === "partially_refunded" || res.data.status === "refunded") {
          setPhase("ready");
          return;
        }
        if (res.data.status === "cancelled") {
          setPhase("cancelled");
          return;
        }
        // Still pending_payment — the webhook may not have landed yet.
        if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
          setPhase("timeout");
          return;
        }
        setPhase("polling");
        timer = setTimeout(poll, POLL_INTERVAL_MS);
      } catch (err) {
        if (cancelled) return;

        // A bad order_id/token is unrecoverable — fail fast. Anything else
        // (a dropped connection, a transient 5xx) is likely momentary right
        // after paying, so keep polling until the timeout instead of
        // showing an error to someone who just successfully paid.
        if (err instanceof ApiError && err.status === 404) {
          setPhase("error");
          setErrorMessage(err.message || "Could not load your order.");
          return;
        }

        if (Date.now() - startedAt > POLL_TIMEOUT_MS) {
          setPhase("timeout");
          return;
        }
        setPhase("polling");
        timer = setTimeout(poll, POLL_INTERVAL_MS);
      }
    }

    poll();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [orderId, token]);

  useEffect(() => {
    if (phase === "ready" && !clearedRef.current) {
      clearedRef.current = true;
      dispatch(clearCart());
      dispatch(resetCheckout());
    }
  }, [phase, dispatch]);

  if (phase === "loading" || phase === "polling") {
    return (
      <div className="min-h-screen bg-bg">
        <CheckoutHeader showReturnToCart={false} />
        <main className="mx-auto flex max-w-xl flex-col items-center gap-3 px-4 py-24 text-center sm:px-6">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
          <h1 className="text-lg font-bold text-fg">Confirming your payment…</h1>
          <p className="text-sm text-fg-muted">
            This usually takes just a few seconds. Please don't close this page.
          </p>
        </main>
      </div>
    );
  }

  if (phase === "timeout") {
    return (
      <div className="min-h-screen bg-bg">
        <CheckoutHeader showReturnToCart={false} />
        <main className="mx-auto flex max-w-xl flex-col items-center gap-3 px-4 py-24 text-center sm:px-6">
          <AlertTriangle className="h-8 w-8 text-accent" />
          <h1 className="text-lg font-bold text-fg">Still confirming your payment</h1>
          <p className="text-sm text-fg-muted">
            This is taking longer than expected. You'll receive an email confirmation once it's done — no need to pay
            again. If you don't hear back soon, contact us with order reference{" "}
            <span className="font-semibold text-fg">#{order?.order_number ?? "—"}</span>.
          </p>
          <Button variant="outline" asChild className="mt-2">
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </main>
      </div>
    );
  }

  if (phase === "cancelled") {
    return (
      <div className="min-h-screen bg-bg">
        <CheckoutHeader showReturnToCart={false} />
        <main className="mx-auto flex max-w-xl flex-col items-center gap-3 px-4 py-24 text-center sm:px-6">
          <XCircle className="h-8 w-8 text-danger" />
          <h1 className="text-lg font-bold text-fg">This order was cancelled</h1>
          <p className="text-sm text-fg-muted">
            Order #{order?.order_number ?? "—"} was cancelled before payment completed. Please return to your cart
            to place a new order.
          </p>
          <div className="mt-2 flex gap-3">
            <Button asChild>
              <Link to="/cart">Return to Cart</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="min-h-screen bg-bg">
        <CheckoutHeader showReturnToCart={false} />
        <main className="mx-auto flex max-w-xl flex-col items-center gap-3 px-4 py-24 text-center sm:px-6">
          <AlertTriangle className="h-8 w-8 text-danger" />
          <h1 className="text-lg font-bold text-fg">Couldn't load your order</h1>
          <p className="text-sm text-fg-muted">{errorMessage}</p>
          <Button variant="outline" asChild className="mt-2">
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </main>
      </div>
    );
  }

  // phase === "ready"
  if (!order) return null;
  const pointsEarned = Math.round(order.total / 100 / 10);

  return (
    <div className="min-h-screen bg-bg">
      <CheckoutHeader showReturnToCart={false} />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div>
            <OrderConfirmedHero orderReference={order.order_number} />

            {order.has_stock_issue && (
              <div className="mt-6 flex items-start gap-2 rounded-xl border border-accent/30 bg-accent/10 p-4 text-sm text-fg">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <p>
                  One or more items in this order may be delayed due to a stock discrepancy — our team has been
                  notified and will be in touch if anything changes with your shipment.
                </p>
              </div>
            )}

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
              <Button size="lg" asChild>
                <Link to={`/checkout/invoice?order_id=${order._id}&token=${token}`}>View Order Status</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/shop">Continue Shopping</Link>
              </Button>
            </div>
          </div>

          <div className="min-w-0 space-y-6 lg:sticky lg:top-8 lg:self-start">
            <PrecisionGuaranteedCard img={PRECISION_IMG} />
            <ConfirmationSummaryLinks />
          </div>
        </div>
      </main>
    </div>
  );
}
