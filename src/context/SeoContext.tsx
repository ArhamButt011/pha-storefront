import { createContext, useContext, type ReactNode } from "react";
import { EMPTY_SEO_SETTINGS } from "@/constants/seo";
import type { PublicSeoSettings } from "@/types/seo";

const SeoContext = createContext<PublicSeoSettings>(EMPTY_SEO_SETTINGS);

// Filled once by the Layout loader, like StorefrontContentContext.
export function SeoProvider({ value, children }: { value: PublicSeoSettings; children: ReactNode }) {
  return <SeoContext.Provider value={value}>{children}</SeoContext.Provider>;
}

export function useSeo() {
  return useContext(SeoContext);
}
