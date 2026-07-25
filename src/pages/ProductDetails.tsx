import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Zap } from "lucide-react";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { ImageGallery } from "@/components/product/ImageGallery";
import { ProductDetailSkeleton } from "@/components/product/ProductDetailSkeleton";
import { FitmentBadge } from "@/components/product/FitmentBadge";
import { ProductTabs } from "@/components/product/ProductTabs";
import { ProductConditionQuantityRow } from "@/components/product/ProductConditionQuantityRow";
import { ShippingReturnsPayments } from "@/components/product/ShippingReturnsPayments";
import { SimilarItems } from "@/components/product/SimilarItems";
import { Button } from "@/components/ui/button";
import type { Product } from "@/data/products";
import { getCategoryBySlug } from "@/data/categories";
import { getProductBySlug } from "@/lib/api/product";
import { mapApiProductToProduct } from "@/utils/mapApiProduct";
import { useCart } from "@/hooks/useCart";
import { productToCartItem } from "@/utils/productToCartItem";
import { formatCurrency } from "@/utils/currency";

export function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    // Resets the picker back to 1 on every navigation between products —
    // otherwise a quantity chosen on a high-stock product could visually
    // exceed the next product's (lower) stock cap for a moment.
    setQty(1);

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
    return <ProductDetailSkeleton />;
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
    // { label: "Brand", value: product.brandFull ?? product.brand },
    // SKU and Warranty are shown further down (Part Identifiers / Technical
    // Specifications) instead — showing them here too would repeat the same
    // fact twice on the page.
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

  function handleBuyNow() {
    if (!product) return;
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
              {formatCurrency(product.price)}
            </span>
            {product.oldPrice && (
              <>
                <span className="text-base text-fg-muted/60 line-through">
                  {formatCurrency(product.oldPrice)}
                </span>
                <span className="rounded-full bg-ok/15 px-2.5 py-1 text-xs font-bold text-ok">
                  Save {formatCurrency(product.oldPrice - product.price)}
                </span>
              </>
            )}
          </div>

          <ProductConditionQuantityRow
            condition={product.condition}
            qty={qty}
            onQtyChange={setQty}
            stockCount={product.stockCount}
            stockStatus={product.stock.status}
          />

          {product.stock.status === "out-of-stock" && (
            <p className="mt-5 text-sm font-semibold text-danger">{product.stock.label}</p>
          )}

          <div className="mt-5 flex flex-col gap-3">
            <Button
              className="w-full gap-2"
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
            <Button
              variant="outline"
              size="lg"
              className="w-full gap-2"
              onClick={handleBuyNow}
              disabled={product.stock.status === "out-of-stock"}
            >
              <Zap className="h-4 w-4" />
              Buy Now
            </Button>
          </div>

          <ShippingReturnsPayments shippingCost={product.shippingCost} />

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

      <SimilarItems
        categoryId={product.categoryId}
        categorySlug={product.categorySlug}
        categoryTitle={category?.title}
        excludeProductId={product.id}
      />
    </main>
  );
}
