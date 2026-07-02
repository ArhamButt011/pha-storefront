import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { VehicleChip } from "@/components/products/VehicleChip";
import { FilterSidebar, type FacetOption } from "@/components/products/FilterSidebar";
import { ResultsHeader } from "@/components/products/ResultsHeader";
import { ProductCard } from "@/components/products/ProductCard";
import { Pagination } from "@/components/ui/pagination";
import { getCategoryBySlug } from "@/data/categories";
import { getProductsByCategory, type Product } from "@/data/products";
import { useVehicle } from "@/context/VehicleContext";

const PAGE_SIZE = 9;

function countFacet(products: Product[], key: "brand" | "partType"): FacetOption[] {
  const counts = new Map<string, number>();
  for (const p of products) {
    counts.set(p[key], (counts.get(p[key]) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([name, count]) => ({ name, count }));
}

export function ProductsListing() {
  const { slug } = useParams();
  const category = slug ? getCategoryBySlug(slug) : undefined;
  const { vehicle } = useVehicle();

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPartTypes, setSelectedPartTypes] = useState<string[]>([]);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  const categoryProducts = useMemo(() => getProductsByCategory(slug), [slug]);

  const vehicleFiltered = useMemo(() => {
    if (!vehicle?.make) return categoryProducts;
    return categoryProducts.filter((p) => p.fits === "all" || p.fits.includes(vehicle.make));
  }, [categoryProducts, vehicle]);

  const brandFacets = useMemo(() => countFacet(vehicleFiltered, "brand"), [vehicleFiltered]);
  const partTypeFacets = useMemo(() => countFacet(vehicleFiltered, "partType"), [vehicleFiltered]);

  const filtered = useMemo(() => {
    const min = priceMin ? Number(priceMin) : undefined;
    const max = priceMax ? Number(priceMax) : undefined;

    return vehicleFiltered.filter((p) => {
      if (selectedBrands.length && !selectedBrands.includes(p.brand)) return false;
      if (selectedPartTypes.length && !selectedPartTypes.includes(p.partType)) return false;
      if (min !== undefined && p.price < min) return false;
      if (max !== undefined && p.price > max) return false;
      return true;
    });
  }, [vehicleFiltered, selectedBrands, selectedPartTypes, priceMin, priceMax]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    switch (sort) {
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "rating":
        return list.sort((a, b) => b.rating - a.rating);
      default:
        return list;
    }
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function toggleBrand(name: string) {
    setSelectedBrands((prev) => (prev.includes(name) ? prev.filter((b) => b !== name) : [...prev, name]));
    setPage(1);
  }

  function togglePartType(name: string) {
    setSelectedPartTypes((prev) => (prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]));
    setPage(1);
  }

  function clearAll() {
    setSelectedBrands([]);
    setSelectedPartTypes([]);
    setPriceMin("");
    setPriceMax("");
    setPage(1);
  }

  const title = category?.title ?? "All Parts";
  const description = category?.description ?? "Browse our full range of performance parts for your vehicle.";
  const breadcrumbItems = category
    ? [{ label: "Home", href: "/" }, { label: category.breadcrumbParent, href: "/categories" }, { label: category.title }]
    : [{ label: "Home", href: "/" }, { label: "All Parts" }];

  const vehicleLabel = vehicle?.make ? [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(" ") : undefined;

  return (
    <main className="mx-auto max-w-7xl px-4 pb-8 pt-28 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Breadcrumb items={breadcrumbItems} />
        {vehicle?.make && <VehicleChip vehicle={vehicle} />}
      </div>

      <div className="mb-8">
        <h1 className="font-display text-3xl font-black tracking-wide text-fg sm:text-4xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-fg-muted">{description}</p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <FilterSidebar
          brands={brandFacets}
          selectedBrands={selectedBrands}
          onToggleBrand={toggleBrand}
          partTypes={partTypeFacets}
          selectedPartTypes={selectedPartTypes}
          onTogglePartType={togglePartType}
          priceMin={priceMin}
          priceMax={priceMax}
          onPriceMinChange={(v) => { setPriceMin(v); setPage(1); }}
          onPriceMaxChange={(v) => { setPriceMax(v); setPage(1); }}
          onClearAll={clearAll}
          vehicleFitmentLabel={vehicleLabel}
        />

        <div className="min-w-0 flex-1">
          <ResultsHeader count={sorted.length} sort={sort} onSortChange={setSort} />

          {pageItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {pageItems.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-bg-2 px-6 py-16 text-center text-fg-muted">
              No parts match your current filters.
            </div>
          )}

          <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} className="mt-10" />
        </div>
      </div>
    </main>
  );
}
