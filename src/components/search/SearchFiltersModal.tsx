import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription } from "@/components/ui/modal";
import { Select, type SelectOption } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/lib/api/categories";
import { LiveSearchResults } from "./LiveSearchResults";
import {
  getVehicleMakes,
  getVehicleModels,
  getVehicleModelCodes,
  getVehicleYears,
} from "@/lib/api/vehicle-model";
import {
  SHOP_FILTER_PARAMS,
  CONDITION_LABELS,
  AUTHENTICITY_LABELS,
  type AuthenticityFilterValue,
  type ConditionFilterValue,
} from "@/constants/shopFilters";
import { VEHICLE_PARAM_KEYS } from "@/context/VehicleContext";
import { useShopFilters } from "@/hooks/useShopFilters";
import type { ApiCategory } from "@/types/category";
import type { Product } from "@/data/products";

// Static option lists live at module scope (not re-created per render/keystroke).
// No "" entry — an empty value falls through to the native placeholder (muted
// text), same as Category, instead of rendering as a real selected option in
// full-strength text color.
const CONDITION_OPTIONS: SelectOption[] = Object.entries(CONDITION_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const AUTHENTICITY_OPTIONS: SelectOption[] = Object.entries(AUTHENTICITY_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export interface SearchFiltersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchFiltersModal({ open, onOpenChange }: SearchFiltersModalProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearAll: clearAllUrlFilters } = useShopFilters();

  const [search, setSearch] = useState("");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [condition, setCondition] = useState<ConditionFilterValue | "">("");
  const [authenticity, setAuthenticity] = useState<AuthenticityFilterValue | "">("");
  const [mpn, setMpn] = useState("");
  const [sku, setSku] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [modelCode, setModelCode] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");

  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [modelCodes, setModelCodes] = useState<string[]>([]);

  // Re-seed every field from the URL whenever the modal (re)opens, so it
  // always reflects whatever filters are currently applied — editable from
  // there, not reset to blank — rather than from component-local state that
  // only ever existed inside this one mounted instance.
  useEffect(() => {
    if (!open) return;
    setSearch(searchParams.get(SHOP_FILTER_PARAMS.search) ?? "");
    setCategoryIds(searchParams.getAll(SHOP_FILTER_PARAMS.categories));
    setCondition((searchParams.get(SHOP_FILTER_PARAMS.condition) as ConditionFilterValue | null) ?? "");
    setAuthenticity(
      (searchParams.get(SHOP_FILTER_PARAMS.authenticity) as AuthenticityFilterValue | null) ?? "",
    );
    setMpn(searchParams.get(SHOP_FILTER_PARAMS.mpn) ?? "");
    setSku(searchParams.get(SHOP_FILTER_PARAMS.sku) ?? "");
    setPriceMin(searchParams.get(SHOP_FILTER_PARAMS.priceMin) ?? "");
    setPriceMax(searchParams.get(SHOP_FILTER_PARAMS.priceMax) ?? "");

    const [makeKey, modelKey, modelCodeKey, yearFromKey, yearToKey] = VEHICLE_PARAM_KEYS;
    setMake(searchParams.get(makeKey) ?? "");
    setModel(searchParams.get(modelKey) ?? "");
    setModelCode(searchParams.get(modelCodeKey) ?? "");
    setYearFrom(searchParams.get(yearFromKey) ?? "");
    setYearTo(searchParams.get(yearToKey) ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    getCategories({ limit: 100 })
      .then((res) => { if (!cancelled) setCategories(res.data.items); })
      .catch(console.error);
    return () => { cancelled = true; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    getVehicleMakes()
      .then((res) => { if (!cancelled) setMakes(res.data); })
      .catch(console.error);
    return () => { cancelled = true; };
  }, [open]);

  useEffect(() => {
    if (!make) { setModels([]); return; }
    let cancelled = false;
    getVehicleModels(make)
      .then((res) => { if (!cancelled) setModels(res.data); })
      .catch(() => { if (!cancelled) setModels([]); });
    return () => { cancelled = true; };
  }, [make]);

  useEffect(() => {
    if (!make || !model) { setModelCodes([]); return; }
    let cancelled = false;
    getVehicleModelCodes(make, model)
      .then((res) => { if (!cancelled) setModelCodes(res.data); })
      .catch(() => { if (!cancelled) setModelCodes([]); });
    return () => { cancelled = true; };
  }, [make, model]);

  // Stable option references so the (React.memo'd) <Select> only re-renders
  // when the underlying data actually changes, not on every keystroke in
  // unrelated fields (e.g. typing in Search shouldn't re-render every Select).
  const categoryOptions = useMemo(
    () => categories.map((c) => ({ value: c._id, label: c.name })),
    [categories],
  );
  const makeOptions = useMemo(() => makes.map((m) => ({ value: m, label: m })), [makes]);
  const modelOptions = useMemo(() => models.map((m) => ({ value: m, label: m })), [models]);
  const modelCodeOptions = useMemo(() => modelCodes.map((c) => ({ value: c, label: c })), [modelCodes]);

  const handleMakeChange = useCallback((next: string) => {
    setMake(next);
    setModel("");
    setModelCode("");
    setYearFrom("");
    setYearTo("");
  }, []);

  const handleModelChange = useCallback((next: string) => {
    setModel(next);
    setModelCode("");
    setYearFrom("");
    setYearTo("");
  }, []);

  const handleModelCodeChange = useCallback(
    async (next: string) => {
      setModelCode(next);
      setYearFrom("");
      setYearTo("");
      if (!next) return;
      try {
        const res = await getVehicleYears(make, model, next);
        setYearFrom(String(res.data.year_from));
        setYearTo(res.data.year_to != null ? String(res.data.year_to) : "");
      } catch (err) {
        console.error(err);
      }
    },
    [make, model],
  );

  // Clears the form AND applies immediately (unlike Search, which only takes
  // effect on submit) — otherwise the shop page's title/categories/etc. stay
  // showing the old filters until Search is pressed again with nothing set.
  const handleClearAll = useCallback(() => {
    setSearch("");
    setCategoryIds([]);
    setCondition("");
    setAuthenticity("");
    setMpn("");
    setSku("");
    setPriceMin("");
    setPriceMax("");
    handleMakeChange("");
    clearAllUrlFilters();
  }, [handleMakeChange, clearAllUrlFilters]);

  const handleSubmit = useCallback(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set(SHOP_FILTER_PARAMS.search, search.trim());
    // Repeated params (one per selected category) — matches how the shop
    // page's own Part Type checkboxes already encode a multi-value filter.
    categoryIds.forEach((id) => params.append(SHOP_FILTER_PARAMS.categories, id));
    if (condition) params.set(SHOP_FILTER_PARAMS.condition, condition);
    if (authenticity) params.set(SHOP_FILTER_PARAMS.authenticity, authenticity);
    if (mpn.trim()) params.set(SHOP_FILTER_PARAMS.mpn, mpn.trim());
    if (sku.trim()) params.set(SHOP_FILTER_PARAMS.sku, sku.trim());
    if (priceMin) params.set(SHOP_FILTER_PARAMS.priceMin, priceMin);
    if (priceMax) params.set(SHOP_FILTER_PARAMS.priceMax, priceMax);

    if (make) {
      const [makeKey, modelKey, modelCodeKey, yearFromKey, yearToKey] = VEHICLE_PARAM_KEYS;
      params.set(makeKey, make);
      if (model) params.set(modelKey, model);
      if (modelCode) params.set(modelCodeKey, modelCode);
      if (yearFrom) params.set(yearFromKey, yearFrom);
      if (yearTo) params.set(yearToKey, yearTo);
    }

    onOpenChange(false);
    const qs = params.toString();
    navigate(`/shop${qs ? `?${qs}` : ""}`);
  }, [
    search,
    categoryIds,
    condition,
    authenticity,
    mpn,
    sku,
    priceMin,
    priceMax,
    make,
    model,
    modelCode,
    yearFrom,
    yearTo,
    onOpenChange,
    navigate,
  ]);

  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") handleSubmit();
    },
    [handleSubmit],
  );

  const handleSelectProduct = useCallback(
    (product: Product) => {
      onOpenChange(false);
      navigate(`/product/${product.slug}`);
    },
    [onOpenChange, navigate],
  );

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent className="max-w-2xl">
        <ModalHeader>
          <ModalTitle>Search &amp; Filter Parts</ModalTitle>
          <ModalDescription>
            Find the exact part by keyword, category, condition, vehicle fitment, or identifiers.
          </ModalDescription>
        </ModalHeader>

        <div className="max-h-[65vh] space-y-5 overflow-y-auto pr-1">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Search</label>
            <Input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Part number, title, brand…"
            />
            <LiveSearchResults query={search} onSelectProduct={handleSelectProduct} onViewAll={handleSubmit} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Category</label>
              <MultiSelect
                value={categoryIds}
                onValueChange={setCategoryIds}
                placeholder="All Categories"
                options={categoryOptions}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Condition</label>
              <Select
                value={condition}
                onValueChange={(v) => setCondition(v as ConditionFilterValue | "")}
                placeholder="Select Condition"
                options={CONDITION_OPTIONS}
                isSearchable={false}
                isClearable
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Authenticity</label>
              <Select
                value={authenticity}
                onValueChange={(v) => setAuthenticity(v as AuthenticityFilterValue | "")}
                placeholder="Select Authenticity"
                options={AUTHENTICITY_OPTIONS}
                isSearchable={false}
                isClearable
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">
                Manufacturer Part Number (MPN)
              </label>
              <Input value={mpn} onChange={(e) => setMpn(e.target.value)} placeholder="e.g. LR052388" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">
                Stock Number (SKU)
              </label>
              <Input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="e.g. PHA-000016" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-fg-muted">Price Range (A$)</label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                inputMode="numeric"
                placeholder="Min"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
              />
              <span className="shrink-0 text-xs text-fg-muted">to</span>
              <Input
                type="number"
                inputMode="numeric"
                placeholder="Max"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
              />
            </div>
          </div>

          <div className="border-t border-border pt-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-fg-muted">Vehicle Fitment</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Select
                value={make}
                onValueChange={handleMakeChange}
                placeholder="Make"
                options={makeOptions}
                isClearable
              />
              <Select
                value={model}
                onValueChange={handleModelChange}
                placeholder="Model"
                disabled={!make}
                options={modelOptions}
                isClearable
              />
              <Select
                value={modelCode}
                onValueChange={handleModelCodeChange}
                placeholder="Model Code"
                disabled={!model}
                options={modelCodeOptions}
                isClearable
              />
              <Input
                type="number"
                min="1900"
                max="2100"
                placeholder="Year"
                value={yearFrom}
                onChange={(e) => setYearFrom(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mt-7 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs font-semibold text-accent hover:underline"
          >
            Clear All
          </button>
          <Button size="lg" className="gap-2" onClick={handleSubmit}>
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
}
