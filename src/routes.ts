import { type RouteConfig, route, index, layout } from "@react-router/dev/routes";

export default [
  // Everything shares the same Navbar/Footer chrome now (dev's "Work on
  // displaying the same nav bar across the whole app" — checkout used to be
  // top-level, outside Layout, before that). SSR'd: Home, Categories, Shop,
  // Product, Bundles. Client-driven, no loaders (see MIGRATION.md): /cart
  // and /checkout/* — still fine under the same layout(), since none of
  // them depend on server-fetched data to render their shell.
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
    route("checkout", "pages/checkout/Shipping.tsx"),
    route("checkout/payment", "pages/checkout/Payment.tsx"),
    route("checkout/confirmation", "pages/checkout/Confirmation.tsx"),
    route("checkout/invoice", "pages/checkout/Invoice.tsx"),
  ]),
] satisfies RouteConfig;
