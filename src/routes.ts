import { type RouteConfig, route, index, layout } from "@react-router/dev/routes";

export default [
  // Resource routes: plain text/XML, no page chrome.
  route("sitemap.xml", "pages/Sitemap.ts"),
  route("robots.txt", "pages/Robots.ts"),
  // Every page shares the Navbar/Footer chrome; cart and checkout have no loader.
  layout("components/layout/Layout.tsx", [
    index("pages/Home.tsx"),
    route("categories", "pages/CategoriesGrid.tsx"),
    // One route with an optional param: RR7 rejects one file on two routes.
    route("shop/:categoryId?", "pages/ProductsListing.tsx"),
    route("product/:slug", "pages/ProductDetails.tsx"),
    route("bundles", "pages/BundlesListing.tsx"),
    route("blog", "pages/BlogIndex.tsx"),
    route("blog/tag/:tag", "pages/BlogTag.tsx"),
    route("blog/:slug", "pages/BlogPost.tsx"),
    route("pages/:slug", "pages/CustomPage.tsx"),
    route("feedback/:token", "pages/FeedbackPage.tsx"),
    route("cart", "pages/Cart.tsx"),
    route("returns-policy", "pages/ReturnsPolicy.tsx"),
    route("shipping-policy", "pages/ShippingPolicy.tsx"),
    route("checkout", "pages/checkout/Shipping.tsx"),
    route("checkout/payment", "pages/checkout/Payment.tsx"),
    route("checkout/confirmation", "pages/checkout/Confirmation.tsx"),
    route("checkout/invoice", "pages/checkout/Invoice.tsx"),
    // Last: dashboard redirects, else a 404 inside the normal chrome.
    route("*", "pages/NotFoundPage.tsx"),
  ]),
] satisfies RouteConfig;
