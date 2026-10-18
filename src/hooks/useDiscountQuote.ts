import { useEffect, useState } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { quoteDiscount } from "@/lib/api/orders";
import { DISCOUNT_QUOTE_DEBOUNCE_MS } from "@/constants/storefront";
import type { CartItem } from "@/store/cartSlice";
import type { DiscountQuoteState } from "@/types/checkout";

interface DiscountQuoteInput {
  items: CartItem[];
  // Blank asks for the best automatic discount instead.
  code: string;
  shippingCents?: number;
  email?: string;
}

/** The server's discount for this cart: the code's, else the best automatic. */
export function useDiscountQuote({ items, code, shippingCents = 0, email = "" }: DiscountQuoteInput): DiscountQuoteState {
  const [state, setState] = useState<DiscountQuoteState>({ status: "idle" });
  const debouncedCode = useDebouncedValue(code.trim().toUpperCase(), DISCOUNT_QUOTE_DEBOUNCE_MS);
  const debouncedEmail = useDebouncedValue(email.trim(), DISCOUNT_QUOTE_DEBOUNCE_MS);

  useEffect(() => {
    if (!items.length) {
      setState({ status: "idle" });
      return;
    }
    // Ignores a slower earlier response once the cart or code changed.
    let current = true;
    setState({ status: "loading" });
    quoteDiscount({
      items: items.map((i) => ({ product: i.id, quantity: i.quantity })),
      ...(debouncedCode && { promo_code: debouncedCode }),
      shipping_cents: shippingCents,
      ...(debouncedEmail.includes("@") && { customer_email: debouncedEmail }),
    })
      .then(({ data }) => {
        if (current) setState({ status: "ready", quote: data });
      })
      .catch((err: unknown) => {
        if (current) setState({ status: "error", message: err instanceof Error ? err.message : "Couldn't check that code" });
      });
    return () => {
      current = false;
    };
  }, [items, debouncedCode, shippingCents, debouncedEmail]);

  return state;
}
