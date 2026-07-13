import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CarFront, Search } from "lucide-react";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useVehicle, type SelectedVehicle } from "@/context/VehicleContext";
import {
  getVehicleMakes,
  getVehicleModels,
  getVehicleModelCodes,
  getVehicleYears,
} from "@/lib/api/vehicle-model";

export function VehicleSelector() {
  const { vehicle, setVehicle } = useVehicle();
  const navigate = useNavigate();

  const make = vehicle?.make ?? "";
  const model = vehicle?.model ?? "";
  const model_code = vehicle?.model_code ?? "";
  const year_from = vehicle?.year_from ?? "";
  const year_to = vehicle?.year_to ?? "";

  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [modelCodes, setModelCodes] = useState<string[]>([]);

  // Load makes once on mount.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await getVehicleMakes();
        if (!cancelled) setMakes(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // Load models whenever the selected make changes.
  useEffect(() => {
    if (!make) { setModels([]); return; }
    let cancelled = false;
    async function load() {
      try {
        const res = await getVehicleModels(make);
        if (!cancelled) setModels(res.data);
      } catch (err) {
        if (!cancelled) setModels([]);
        console.error(err);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [make]);

  // Load model codes whenever the selected make/model changes.
  useEffect(() => {
    if (!make || !model) { setModelCodes([]); return; }
    let cancelled = false;
    async function load() {
      try {
        const res = await getVehicleModelCodes(make, model);
        if (!cancelled) setModelCodes(res.data);
      } catch (err) {
        if (!cancelled) setModelCodes([]);
        console.error(err);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [make, model]);

  function update(patch: Partial<SelectedVehicle>) {
    setVehicle({ make, model, model_code, year_from, year_to, ...patch });
  }

  function handleMakeChange(nextMake: string) {
    update({ make: nextMake, model: "", model_code: "", year_from: "", year_to: "" });
  }

  function handleModelChange(nextModel: string) {
    update({ model: nextModel, model_code: "", year_from: "", year_to: "" });
  }

  async function handleModelCodeChange(nextModelCode: string) {
    update({ model_code: nextModelCode, year_from: "", year_to: "" });
    try {
      const res = await getVehicleYears(make, model, nextModelCode);
      update({
        model_code: nextModelCode,
        year_from: String(res.data.year_from),
        year_to: res.data.year_to != null ? String(res.data.year_to) : "",
      });
    } catch (err) {
      console.error(err);
    }
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

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] lg:items-end">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Make</label>
            <Select value={make} onChange={(e) => handleMakeChange(e.target.value)}>
              <option value="">Select Make</option>
              {makes.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Model</label>
            <Select value={model} onChange={(e) => handleModelChange(e.target.value)} disabled={!make}>
              <option value="">Select Model</option>
              {models.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </Select>
          </div>

          <div className="col-span-2 space-y-1.5 lg:col-span-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Model Code</label>
            <Select value={model_code} onChange={(e) => handleModelCodeChange(e.target.value)} disabled={!model}>
              <option value="">Select Code</option>
              {modelCodes.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </div>

          <div className="col-span-2 space-y-1.5 lg:col-span-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Year</label>
            <Input
              type="number"
              min="1900"
              max="2100"
              value={year_from}
              onChange={(e) => update({ year_from: e.target.value })}
              placeholder="e.g. 2015"
            />
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