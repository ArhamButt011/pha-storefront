import { useCartSync } from "@/hooks/useCartSync";

// Renders nothing; keeps a saved cart in step with current product data.
export function CartSync() {
  useCartSync();
  return null;
}
