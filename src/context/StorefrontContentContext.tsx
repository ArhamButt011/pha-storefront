import { createContext, useContext, type ReactNode } from "react";
import { EMPTY_STOREFRONT_CONTENT } from "@/constants/storefront";
import type { StorefrontContent } from "@/types/storefront";

const StorefrontContentContext = createContext<StorefrontContent>(EMPTY_STOREFRONT_CONTENT);

// Filled once by the Layout loader, every page reads the same snapshot.
export function StorefrontContentProvider({ value, children }: { value: StorefrontContent; children: ReactNode }) {
  return <StorefrontContentContext.Provider value={value}>{children}</StorefrontContentContext.Provider>;
}

export function useStorefrontContent() {
  return useContext(StorefrontContentContext);
}
