import { useEffect, useMemo, useState } from "react";
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

const EMPTY: SelectedVehicle = {
  make: "",
  model: "",
  model_code: "",
  year_from: "",
  year_to: "",
};

export function VehicleSelector() {
  const { vehicle, setVehicle } = useVehicle();
  const navigate = useNavigate();

  const [draft, setDraft] = useState<SelectedVehicle>(vehicle ?? EMPTY);

  useEffect(() => {
    setDraft(vehicle ?? EMPTY);
  }, [vehicle]);

  const { make, model, model_code, year_from } = draft;

  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [modelCodes, setModelCodes] = useState<string[]>([]);

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

  // Stable references so <Select> (wrapped in React.memo) only re-renders
  // its option list when the underlying data actually changes, not on
  // every keystroke/render of this parent.
  const makeOptions = useMemo(
    () => makes.map((m) => ({ value: m, label: m })),
    [makes],
  );
  const modelOptions = useMemo(
    () => models.map((m) => ({ value: m, label: m })),
    [models],
  );
  const modelCodeOptions = useMemo(
    () => modelCodes.map((c) => ({ value: c, label: c })),
    [modelCodes],
  );

  function update(patch: Partial<SelectedVehicle>) {
    setDraft((prev) => ({ ...prev, ...patch }));
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
    const params = new URLSearchParams();
    if (draft.make) {
      params.set("make", draft.make);
      if (draft.model) params.set("model", draft.model);
      if (draft.model_code) params.set("model_code", draft.model_code);
      if (draft.year_from) params.set("year_from", draft.year_from);
      if (draft.year_to) params.set("year_to", draft.year_to);
    }
    navigate(draft.make ? `/shop?${params.toString()}` : "/shop");
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
            <Select
              value={make}
              onValueChange={handleMakeChange}
              placeholder="Select Make"
              options={makeOptions}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Model</label>
            <Select
              value={model}
              onValueChange={handleModelChange}
              placeholder="Select Model"
              disabled={!make}
              options={modelOptions}
            />
          </div>

          <div className="col-span-2 space-y-1.5 lg:col-span-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Model Code</label>
            <Select
              value={model_code}
              onValueChange={handleModelCodeChange}
              placeholder="Select Code"
              disabled={!model}
              options={modelCodeOptions}
            />
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