import { useCallback, useMemo, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";

export interface SelectedVehicle {
  make: string;
  model: string;
  model_code: string;
  year_from: string;
  year_to: string;
}

export const VEHICLE_PARAM_KEYS = ["make", "model", "model_code", "year_from", "year_to"] as const;

function vehicleFromSearchParams(params: URLSearchParams): SelectedVehicle | null {
  const make = params.get("make") ?? "";
  if (!make) return null;
  return {
    make,
    model: params.get("model") ?? "",
    model_code: params.get("model_code") ?? "",
    year_from: params.get("year_from") ?? "",
    year_to: params.get("year_to") ?? "",
  };
}

/** No longer holds any actual state — vehicle selection now lives entirely
 * in the URL's query params via useSearchParams. Kept as a passthrough so
 * existing <VehicleProvider> usage in App.tsx doesn't need to change. */
export function VehicleProvider({ children }: { children: ReactNode }) {
  return children;
}

export function useVehicle() {
  const [searchParams, setSearchParams] = useSearchParams();

  const vehicle = useMemo(() => vehicleFromSearchParams(searchParams), [searchParams]);

  const setVehicle = useCallback(
    (next: SelectedVehicle | null) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          VEHICLE_PARAM_KEYS.forEach((key) => params.delete(key));
          if (next?.make) {
            params.set("make", next.make);
            if (next.model) params.set("model", next.model);
            if (next.model_code) params.set("model_code", next.model_code);
            if (next.year_from) params.set("year_from", next.year_from);
            if (next.year_to) params.set("year_to", next.year_to);
          }
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return { vehicle, setVehicle };
}