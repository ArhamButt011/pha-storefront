import { type RouteConfig, route, index, layout } from "@react-router/dev/routes";

export default [
  // SSR'd — crawled surface (Home, Categories, Shop, Product, Bundles) plus
  // /cart, which shares the same Navbar/Footer chrome. See MIGRATION.md for
  // why /cart still renders correctly with no server data dependency.
  layout("components/layout/Layout.tsx", [
    index("pages/Home.tsx"),
    route("categories", "pages/CategoriesGrid.tsx"),
    // A single route with an optional param, not two separate route()
    // entries — RR7 requires distinct route ids per file, and both entries
    // pointing at the same component file collided ("duplicate route id").
    route("shop/:categoryId?", "pages/ProductsListing.tsx"),
    route("product/:slug", "pages/ProductDetails.tsx"),
    route("bundles", "pages/BundlesListing.tsx"),
    route("cart", "pages/Cart.tsx"),
    route("returns-policy", "pages/ReturnsPolicy.tsx"),
  ]),

  // Session/Stripe routes — never crawled. No loaders; all data fetching
  // stays in useEffect exactly as before (see MIGRATION.md).
  route("checkout", "pages/checkout/Shipping.tsx"),
  route("checkout/payment", "pages/checkout/Payment.tsx"),
  route("checkout/confirmation", "pages/checkout/Confirmation.tsx"),
  route("checkout/invoice", "pages/checkout/Invoice.tsx"),
] satisfies RouteConfig;
