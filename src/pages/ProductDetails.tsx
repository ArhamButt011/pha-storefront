import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Truck, PackageCheck, Zap } from "lucide-react";
import type { Route } from "./+types/ProductDetails";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { ImageGallery } from "@/components/product/ImageGallery";
import { FitmentBadge } from "@/components/product/FitmentBadge";
import { ProductTabs } from "@/components/product/ProductTabs";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { Button } from "@/components/ui/button";
import { getCategoryBySlug } from "@/data/categories";
import { getProductBySlug } from "@/lib/api/product";
import { ApiError } from "@/lib/api/client";
import { mapApiProductToProduct } from "@/utils/mapApiProduct";
import { useCart } from "@/hooks/useCart";
import { productToCartItem } from "@/utils/productToCartItem";
import { getOrigin, safeJsonLd, stripHtml, mapAvailability, mapItemCondition } from "@/lib/seo";
import type { ApiProduct } from "@/types/apiProduct";

function buildProductJsonLd(product: ApiProduct, origin: string) {
  const canonicalUrl = `${origin}/product/${product.slug}`;
  // Same precedence pha-dashboard's own Google Merchant adapter resolves
  // (listing override wins, else the product's own value) — see
  // listing.resolver.js#resolveIdentifiers. NOT the same thing as `sku`
  // (an internal stock code) — conflating the two would itself be a
  // feed/page mismatch, since the real feed sends this value, not the SKU.
  const mpn = product.display?.mpn ?? product.mpn ?? null;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: stripHtml(product.description) || product.title,
    ...(product.attachments?.length ? { image: product.attachments.map((a) => a.url) } : {}),
    ...(product.sku ? { sku: product.sku } : {}),
    // Omitted entirely when the backend has no brand for this product —
    // the feed never fabricates one either (resolveIdentifiers only sends
    // brand alongside a present mpn; a fabricated "Generic" here would
    // itself be a page/feed mismatch of the kind this migration needs to
    // avoid, even though the on-page *display* still shows "Generic" via
    // mapApiProductToProduct's own, pre-existing fallback).
    ...(product.brand ? { brand: { "@type": "Brand", name: product.brand } } : {}),
    offers: {
      "@type": "Offer",
      // Straight from the backend response — never rounded/reformatted, so
      // this can never drift from the Merchant Center feed for the same SKU.
      price: String(product.price),
      priceCurrency: "AUD",
      availability: `https://schema.org/${mapAvailability(product.stock_status)}`,
      itemCondition: `https://schema.org/${mapItemCondition(product.display?.condition ?? product.condition)}`,
      url: canonicalUrl,
      ...(mpn ? { mpn } : {}),
    },
  };
}

export async function loader({ params, request }: Route.LoaderArgs) {
  const { slug } = params;

  try {
    const res = await getProductBySlug(slug!);
    return { product: res.data, origin: getOrigin(request) };
  } catch (err) {
    // Only an affirmative "doesn't exist" becomes a 404 — Merchant Center
    // and Google both treat 404 as "permanently gone" and will drop the
    // page from the index, which is the wrong outcome for a transient
    // backend/network error. Anything else propagates and renders the
    // root ErrorBoundary as a 500 instead.
    if (err instanceof ApiError && err.status === 404) {
      throw new Response("Not Found", { status: 404 });
    }
    throw err;
  }
}

export function meta({ data }: Route.MetaArgs) {
  if (!data) return [];
  const { product, origin } = data;
  const canonicalUrl = `${origin}/product/${product.slug}`;
  const title = `${product.title} | Parts Hub Australia`;
  const description = stripHtml(product.description).slice(0, 300) || product.title;
  const image = product.attachments?.[0]?.url;

  return [
    { title },
    { name: "description", content: description },
    { property: "og:type", content: "product" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: canonicalUrl },
    ...(image ? [{ property: "og:image", content: image }] : []),
  ];
}

export default function ProductDetails({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const product = mapApiProductToProduct(loaderData.product);
  const jsonLd = buildProductJsonLd(loaderData.product, loaderData.origin);

  const category = getCategoryBySlug(product.categorySlug);
  const gallery = product.gallery ?? [product.img];

  const infoRows = [
    product.sku ? { label: "SKU #", value: product.sku } : null,
    product.material ? { label: "Material", value: product.material } : null,
  ].filter((row): row is { label: string; value: string } => row !== null);

  function handleAddToCart() {
    if (product.stock.status === "out-of-stock") return;
    try {
      addToCart(productToCartItem(product, qty));
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (err) {
      console.error(err);
    }
  }

  function handleBuyNow() {
    if (product.stock.status === "out-of-stock") return;
    try {
      addToCart(productToCartItem(product, qty));
      navigate("/checkout");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-20 lg:pt-28 sm:px-6 lg:px-8">
      {/* React 19 hoists <link>/<title>/<meta> rendered anywhere in the tree
          into <head> — the route module's `links` export can't do this
          since it has no access to loader data (needed for the slug). */}
      <link rel="canonical" href={`${loaderData.origin}/product/${loaderData.product.slug}`} />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />

      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            ...(category
              ? [{ label: category.title, href: `/shop/${category.slug}` }]
              : [{ label: "All Parts", href: "/shop" }]),
            { label: product.title },
          ]}
        />
      </div>

      <div className="grid gap-10 md:grid-cols-2">
        <ImageGallery images={gallery} alt={product.title} />

        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            {product.grade && (
              <span className="rounded-full bg-bg-3 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-fg-muted">
                {product.grade}
              </span>
            )}
          </div>

          <h1 className="mt-3 font-display text-2xl font-black leading-tight text-fg sm:text-3xl">
            {product.title}
          </h1>
          {product.shortDescription && (
            <p className="mt-3 text-fg-muted">{product.shortDescription}</p>
          )}

          {product.fitmentConfirmedFor && (
            <div className="mt-5">
              <FitmentBadge vehicleLabel={product.fitmentConfirmedFor} />
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-black text-accent">
              A${product.price.toLocaleString()}.00
            </span>
            {product.oldPrice && (
              <>
                <span className="text-base text-fg-muted/60 line-through">
                  A${product.oldPrice.toLocaleString()}.00
                </span>
                <span className="rounded-full bg-ok/15 px-2.5 py-1 text-xs font-bold text-ok">
                  Save ${(product.oldPrice - product.price).toLocaleString()}.00
                </span>
              </>
            )}
          </div>

          <div className="mt-5 space-y-2 text-sm text-fg-muted">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 shrink-0 text-accent" /> Fast Dispatch
              from Melbourne HQ
            </div>
            <div className="flex items-center gap-2">
              <PackageCheck className="h-4 w-4 shrink-0 text-accent" />{" "}
              {product.stock.label}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <QuantityStepper value={qty} onChange={setQty} />
            <Button
              className="mt-2 w-full gap-2"
              onClick={handleAddToCart}
              size="lg"
              disabled={product.stock.status === "out-of-stock"}
            >
              {product.stock.status === "out-of-stock"
                ? "Out of Stock"
                : added
                ? "Added to Cart"
                : "Add to Cart"}
            </Button>
          </div>
          <Button
            variant="outline"
            size="lg"
            className="mt-3 w-full gap-2"
            onClick={handleBuyNow}
            disabled={product.stock.status === "out-of-stock"}
          >
            <Zap className="h-4 w-4" />
            Buy Now
          </Button>

          {infoRows.length > 0 && (
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-border pt-6 text-sm">
              {infoRows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="text-fg-muted">{row.label}</span>
                  <span className="font-semibold text-fg">{row.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-16">
        <ProductTabs product={product} />
      </div>
    </main>
  );
}
