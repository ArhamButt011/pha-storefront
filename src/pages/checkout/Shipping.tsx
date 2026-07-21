import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";
import { CheckoutStepper } from "@/components/checkout/CheckoutStepper";
import { FitmentGuaranteeBanner } from "@/components/checkout/FitmentGuaranteeBanner";
import { ShippingForm, type ShippingDetails } from "@/components/checkout/ShippingForm";
import { CheckoutOrderSummary } from "@/components/checkout/CheckoutOrderSummary";
import { useCart } from "@/hooks/useCart";
import { useVehicle } from "@/context/VehicleContext";
import { createOrder } from "@/lib/api/orders";
import { setOrder } from "@/store/checkoutSlice";
import type { AppDispatch } from "@/store/store";

const INITIAL_SHIPPING: ShippingDetails = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  suburb: "",
  state: "VIC",
  postcode: "",
  billingSameAsShipping: true,
};

function isShippingComplete(s: ShippingDetails) {
  return Boolean(s.fullName.trim() && s.email.trim() && s.phone.trim() && s.address.trim() && s.suburb.trim() && s.postcode.trim());
}

export function CheckoutShipping() {
  const { items, totalPrice } = useCart();
  const { vehicle } = useVehicle();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [shipping, setShipping] = useState<ShippingDetails>(INITIAL_SHIPPING);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) navigate("/cart", { replace: true });
  }, [items.length, navigate]);

  if (items.length === 0) return null;

const vehicleLabel = vehicle?.make
  ? [vehicle.make, vehicle.model, vehicle.model_code].filter(Boolean).join(" ")
  : undefined;

  function updateShipping(patch: Partial<ShippingDetails>) {
    setShipping((prev) => ({ ...prev, ...patch }));
  }

  async function handleContinue() {
    if (!isShippingComplete(shipping)) {
      setError("Please fill in all shipping details before continuing.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Prices/stock are re-derived server-side from product/variant ids —
      // only ids and quantities are sent, never the cart's own line prices.
      const res = await createOrder({
        items: items.map((item) => ({ product: item.id, quantity: item.quantity })),
        customer: {
          name: shipping.fullName,
          email: shipping.email,
          phone: shipping.phone,
        },
        shipping_address: {
          address: shipping.address,
          suburb: shipping.suburb,
          state: shipping.state,
          postcode: shipping.postcode,
        },
        // The form only collects a single address today (no separate billing
        // address fields exist yet even when "same as shipping" is unchecked)
        // — always send null (same-as-shipping) until that UI is built.
        billing_address: null,
      });

      const order = res.data;
      dispatch(
        setOrder({
          orderId: order._id,
          guestToken: order.guest_access_token,
          orderNumber: order.order_number,
        }),
      );

      const params = new URLSearchParams({ order_id: order._id, token: order.guest_access_token });
      navigate(`/checkout/payment?${params.toString()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not place your order. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* <CheckoutHeader /> */}

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <CheckoutStepper currentStep={1} />

        {vehicleLabel && (
          <div className="mt-8">
            <FitmentGuaranteeBanner vehicleLabel={vehicleLabel} />
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div>
            <ShippingForm values={shipping} onChange={updateShipping} />
            {error && (
              <p role="alert" className="mt-4 text-sm font-medium text-danger">
                {error}
              </p>
            )}
          </div>
          <div className="min-w-0 lg:sticky lg:top-8 lg:self-start">
            <CheckoutOrderSummary
              items={items}
              subtotal={totalPrice}
              vehicleMake={vehicle?.make}
              onContinue={handleContinue}
              submitting={submitting}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
