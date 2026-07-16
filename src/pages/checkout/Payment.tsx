import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Loader2, ShieldCheck } from "lucide-react";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";
import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";
import { CheckoutStepper } from "@/components/checkout/CheckoutStepper";
import { Button } from "@/components/ui/button";
import { createPaymentIntent } from "@/lib/api/payments";
import { stripePromise } from "@/lib/stripe";
import { setOrder } from "@/store/checkoutSlice";
import type { AppDispatch, RootState } from "@/store/store";

function PaymentForm({
  orderId,
  guestToken,
  orderNumber,
}: {
  orderId: string;
  guestToken: string;
  orderNumber: string | null;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setCardError(null);

    // The confirmation page must be able to bootstrap entirely from this
    // URL — a 3DS challenge does a full-page redirect away and back, so
    // nothing in Redux/component state is guaranteed to survive.
    const returnUrl = new URL("/checkout/confirmation", window.location.origin);
    returnUrl.searchParams.set("order_id", orderId);
    returnUrl.searchParams.set("token", guestToken);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl.toString() },
    });

    // Only reached if confirmPayment fails synchronously without redirecting
    // (e.g. a declined card) — a successful confirmation or a 3DS challenge
    // navigates the browser away before this line would run. The backend
    // reuses the same pending PaymentIntent for this order, so simply
    // re-submitting this same form retries against the same intent.
    if (error) {
      setCardError(error.message ?? "Payment failed — please check your card details and try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-bg-2 p-6">
      <h2 className="mb-4 text-lg font-bold text-fg">Payment</h2>

      <PaymentElement />

      {cardError && (
        <p role="alert" className="mt-4 text-sm font-medium text-danger">
          {cardError}
        </p>
      )}

      <Button type="submit" size="lg" className="mt-6 w-full gap-2" disabled={!stripe || submitting}>
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing…
          </>
        ) : (
          "Pay Now"
        )}
      </Button>

      <p className="mt-4 flex items-center justify-center gap-2 text-xs text-fg-muted">
        <ShieldCheck className="h-3.5 w-3.5" />
        Payments are securely processed by Stripe{orderNumber ? ` — order ${orderNumber}` : ""}
      </p>
    </form>
  );
}

export function CheckoutPayment() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const { orderId: sliceOrderId, guestToken: sliceGuestToken, orderNumber } = useSelector(
    (s: RootState) => s.checkout,
  );

  // The slice is wiped on a hard refresh (it's excluded from redux-persist),
  // but Shipping (and the cancelled-order retry path) always pass order_id
  // and token as URL query params too — fall back to those so refreshing
  // /checkout/payment resumes the same payment instead of bouncing to
  // /checkout.
  const paramOrderId = searchParams.get("order_id");
  const paramGuestToken = searchParams.get("token");
  const orderId = sliceOrderId ?? paramOrderId;
  const guestToken = sliceGuestToken ?? paramGuestToken;

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Neither the slice nor the URL carries an order reference — genuinely
    // nothing to resume. Send them back to start a new order.
    if (!orderId || !guestToken) {
      navigate("/checkout", { replace: true });
      return;
    }

    // Slice was empty but the URL had what we needed — rehydrate it so the
    // rest of the flow (e.g. the 3DS return_url built in PaymentForm) works.
    if (!sliceOrderId || !sliceGuestToken) {
      dispatch(setOrder({ orderId, guestToken, orderNumber: orderNumber ?? "" }));
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    createPaymentIntent({ order_id: orderId, token: guestToken })
      .then((res) => {
        if (!cancelled) setClientSecret(res.data.client_secret);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not start payment. Please try again.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [orderId, guestToken, sliceOrderId, sliceGuestToken, orderNumber, dispatch, navigate]);

  if (!orderId || !guestToken) return null;

  const options: StripeElementsOptions | undefined = clientSecret
    ? { clientSecret, appearance: { theme: "stripe" } }
    : undefined;

  return (
    <div className="min-h-screen bg-bg">
      <CheckoutHeader />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <CheckoutStepper currentStep={2} />

        <div className="mx-auto mt-8 max-w-xl">
          {loading && (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-bg-2 p-10 text-center">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
              <p className="text-sm text-fg-muted">Preparing secure payment…</p>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-border bg-bg-2 p-6 text-center">
              <p className="text-sm font-medium text-danger">{error}</p>
              <Button
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          )}

          {!loading && !error && clientSecret && (
            <Elements stripe={stripePromise} options={options}>
              <PaymentForm orderId={orderId} guestToken={guestToken} orderNumber={orderNumber} />
            </Elements>
          )}
        </div>
      </main>
    </div>
  );
}
