import { apiClient } from "./client";
import type { BeResponse } from "./base";

export interface VehicleYears {
  year_from: number;
  year_to: number | null;
}

export const getVehicleMakes = async () => {
  const { data } = await apiClient.get<BeResponse<string[]>>("/vehicle-model/makes");
  return data;
};

export const getVehicleModels = async (make: string) => {
  const { data } = await apiClient.get<BeResponse<string[]>>("/vehicle-model/models", {
    params: { make },
  });
  return data;
};

export const getVehicleModelCodes = async (make: string, model: string) => {
  const { data } = await apiClient.get<BeResponse<string[]>>("/vehicle-model/model-codes", {
    params: { make, model },
  });
  return data;
};

export const getVehicleYears = async (make: string, model: string, model_code: string) => {
  const { data } = await apiClient.get<BeResponse<VehicleYears>>("/vehicle-model/years", {
    params: { make, model, model_code },
  });
  return data;
};