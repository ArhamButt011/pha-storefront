import { useEffect, useState } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { getShippingQuote } from "@/lib/api/shipping";
import { AU_POSTCODE_PATTERN, SHIPPING_QUOTE_DEBOUNCE_MS } from "@/constants/shipping";
import { hasCalculatedShipping } from "@/utils/shipping";
import type { CartItem } from "@/store/cartSlice";
import type { AddressFields, AddressType, DeliveryMethod, ShippingQuoteState } from "@/types/checkout";

/** Live shipping price for the cart, once a valid postcode and suburb exist. */
export function useShippingQuote(
  items: CartItem[],
  address: AddressFields,
  addressType: AddressType,
  deliveryMethod: DeliveryMethod,
): ShippingQuoteState {
  const [state, setState] = useState<ShippingQuoteState>({ status: "idle" });
  const hasCalculated = hasCalculatedShipping(items);
  const postcode = useDebouncedValue(address.postcode.trim(), SHIPPING_QUOTE_DEBOUNCE_MS);
  const suburb = useDebouncedValue(address.suburb.trim(), SHIPPING_QUOTE_DEBOUNCE_MS);
  const { state: region } = address;

  useEffect(() => {
    if (deliveryMethod === "pickup") {
      setState({ status: "idle" });
      return;
    }
    if (!AU_POSTCODE_PATTERN.test(postcode) || !suburb) {
      setState({ status: hasCalculated ? "needs_address" : "idle" });
      return;
    }

    // Ignores a slower earlier response once the address or cart changed.
    let current = true;
    setState({ status: "loading" });
    getShippingQuote({
      items: items.map((i) => ({ product: i.id, quantity: i.quantity })),
      receiver: { postcode, suburb, state: region, address_type: addressType },
    })
      .then(({ data }) => {
        if (current) setState({ status: "ready", amount: data.shipping_cost / 100, courier: data.calculated?.courier });
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Couldn't calculate shipping";
        if (current) setState({ status: "error", message });
      });
    return () => {
      current = false;
    };
  }, [items, postcode, suburb, region, addressType, deliveryMethod, hasCalculated]);

  return state;
}
