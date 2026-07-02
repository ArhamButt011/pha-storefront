import { useNavigate } from "react-router-dom";
import { CarFront, Search } from "lucide-react";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useVehicle, type SelectedVehicle } from "@/context/VehicleContext";
import { YEARS, MODELS_BY_MAKE, MAKES, ENGINES } from "@/data/vehicles";

export function VehicleSelector() {
  const { vehicle, setVehicle } = useVehicle();
  const navigate = useNavigate();

  const year = vehicle?.year ?? "";
  const make = vehicle?.make ?? "";
  const model = vehicle?.model ?? "";
  const engine = vehicle?.engine ?? "";

  const models = make ? MODELS_BY_MAKE[make] : Object.values(MODELS_BY_MAKE).flat();

  function update(patch: Partial<SelectedVehicle>) {
    setVehicle({ year, make, model, engine, ...patch });
  }

  function handleFindParts() {
    navigate("/products");
  }

  return (
    <section
      id="vehicle-selector"
      className="relative z-20 -mt-16 mx-4 rounded-2xl border border-border bg-bg-2/95 px-5 py-7 shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-md sm:mx-8 sm:px-8 sm:py-8 lg:mx-16"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 flex items-center gap-2">
          <CarFront className="h-5 w-5 text-accent" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-fg">Select Your Vehicle</h2>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:items-end">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Year</label>
            <Select value={year} onChange={(e) => update({ year: e.target.value })}>
              <option value="">Select Year</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Make</label>
            <Select
              value={make}
              onChange={(e) => update({ make: e.target.value, model: "", engine: "" })}
            >
              <option value="">Select Make</option>
              {MAKES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Model</label>
            <Select
              value={model}
              onChange={(e) => update({ model: e.target.value })}
            >
              <option value="">Select Model</option>
              {models.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Engine</label>
            <Select value={engine} onChange={(e) => update({ engine: e.target.value })}>
              <option value="">Select Engine</option>
              {ENGINES.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </Select>
          </div>

          <Button size="md" className="col-span-2 gap-2 lg:col-span-1" onClick={handleFindParts}>
            <Search className="h-4 w-4" />
            Find Parts
          </Button>
        </div>
      </div>
    </section>
  );
}
