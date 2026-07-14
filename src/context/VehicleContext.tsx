import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface SelectedVehicle {
  make: string;
  model: string;
  model_code: string;
  year_from: string;
  year_to: string;
}

interface VehicleContextValue {
  vehicle: SelectedVehicle | null;
  setVehicle: (vehicle: SelectedVehicle | null) => void;
}

const STORAGE_KEY = "pha-selected-vehicle";

const VehicleContext = createContext<VehicleContextValue | null>(null);

function readStoredVehicle(): SelectedVehicle | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SelectedVehicle) : null;
  } catch {
    return null;
  }
}

export function VehicleProvider({ children }: { children: ReactNode }) {
  const [vehicle, setVehicle] = useState<SelectedVehicle | null>(() => readStoredVehicle());

  useEffect(() => {
    if (vehicle) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vehicle));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [vehicle]);

  return <VehicleContext.Provider value={{ vehicle, setVehicle }}>{children}</VehicleContext.Provider>;
}

export function useVehicle() {
  const ctx = useContext(VehicleContext);
  if (!ctx) throw new Error("useVehicle must be used within a VehicleProvider");
  return ctx;
}