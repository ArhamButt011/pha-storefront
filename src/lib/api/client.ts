import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:7000/api/v1",
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const message: string =
      err.response?.data?.message ?? err.message ?? "Something went wrong";
    return Promise.reject(new ApiError(message, err.response?.status));
  },
);