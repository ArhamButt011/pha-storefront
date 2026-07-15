import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Truck, PackageCheck, Send } from "lucide-react";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { ImageGallery } from "@/components/product/ImageGallery";
import { FitmentBadge } from "@/components/product/FitmentBadge";
import { ProductTabs } from "@/components/product/ProductTabs";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { Button } from "@/components/ui/button";
import type { Product } from "@/data/products";
import { getCategoryBySlug } from "@/data/categories";
import { getProductBySlug } from "@/lib/api/product";
import { mapApiProductToProduct } from "@/utils/mapApiProduct";
import { useCart } from "@/hooks/useCart";
import { productToCartItem } from "@/utils/productToCartItem";

export function ProductDetails() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!slug) {
        setError("Product not found.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await getProductBySlug(slug);
        if (cancelled) return;
        setProduct(mapApiProductToProduct(res.data));
      } catch (err) {
        if (!cancelled) {
          setError("This part may have been removed or the link is incorrect.");
          toast.error("Couldn't load this product. Please try again.");
        }
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-4 pb-16 pt-32 text-center sm:px-6 lg:px-8">
        <p className="text-fg-muted">Loading product…</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="mx-auto max-w-3xl px-4 pb-16 pt-32 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-2xl font-black text-fg">
          Product not found
        </h1>
        <p className="mt-3 text-fg-muted">
          {error ?? "This part may have been removed or the link is incorrect."}
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-block text-accent hover:underline"
        >
          Back to all parts
        </Link>
      </main>
    );
  }

  const category = getCategoryBySlug(product.categorySlug);
  const gallery = product.gallery ?? [product.img];

  const infoRows = [
    product.sku ? { label: "SKU #", value: product.sku } : null,
    // { label: "Brand", value: product.brandFull ?? product.brand },
    product.warranty ? { label: "Warranty", value: product.warranty } : null,
    product.material ? { label: "Material", value: product.material } : null,
  ].filter((row): row is { label: string; value: string } => row !== null);

  function handleAddToCart() {
    if (!product) return;

    if (product.stock.status === "out-of-stock") {
      return;
    }

    try {
      addToCart(productToCartItem(product, qty));
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-20 lg:pt-28 sm:px-6 lg:px-8">
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
            {/* <div className="ml-auto flex items-center gap-2 text-sm">
              <StarRating rating={product.rating} />
              <span className="font-semibold text-fg">{product.rating.toFixed(1)}</span>
              {product.reviewCount && <span className="text-fg-muted">({product.reviewCount} Reviews)</span>}
            </div> */}
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
              ${product.price.toLocaleString()}.00
            </span>
            {product.oldPrice && (
              <>
                <span className="text-base text-fg-muted/60 line-through">
                  ${product.oldPrice.toLocaleString()}.00
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
              {added ? "Added to Cart" : "Add to Cart"}
            </Button>
          </div>
          {/* <Button variant="outline" size="lg" className="mt-3 w-full gap-2">
            <Send className="h-4 w-4" />
            Buy with Afterpay
          </Button> */}

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
