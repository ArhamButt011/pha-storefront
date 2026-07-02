import { useMemo, useState } from "react";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { BundlesHero } from "@/components/bundles/BundlesHero";
import { BundleCard } from "@/components/bundles/BundleCard";
import { WhyChooseBundles } from "@/components/bundles/WhyChooseBundles";
import { BUNDLES } from "@/data/bundles";
import { MAKES } from "@/data/vehicles";

export function BundlesListing() {
  const [vehicleValue, setVehicleValue] = useState("");
  const [appliedMake, setAppliedMake] = useState<string | null>(null);

  function handleFilter() {
    const make = MAKES.find((m) => vehicleValue.startsWith(m));
    setAppliedMake(make ?? null);
  }

  const bundles = useMemo(() => {
    if (!appliedMake) return BUNDLES;
    return BUNDLES.filter((b) => b.fits === "all" || b.fits.includes(appliedMake));
  }, [appliedMake]);

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Popular Bundles" }]} />
      </div>

      <BundlesHero vehicleValue={vehicleValue} onVehicleChange={setVehicleValue} onFilter={handleFilter} />

      <div className="mt-10">
        {bundles.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {bundles.map((b) => (
              <BundleCard key={b.id} bundle={b} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-bg-2 px-6 py-16 text-center text-fg-muted">
            No bundles match that vehicle yet — check back soon.
          </div>
        )}
      </div>

      <div className="mt-16">
        <WhyChooseBundles />
      </div>
    </main>
  );
}
