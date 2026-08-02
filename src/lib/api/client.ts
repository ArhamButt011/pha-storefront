import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:7000/api/v1",
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

// The backend is multi-tenant — every request needs to say which tenant's
// store this is. This storefront is a single-tenant deployment (one store
// per deployment), so its own slug is fixed and known at build time.
apiClient.interceptors.request.use((config) => {
  const tenantSlug = import.meta.env.VITE_TENANT_SLUG;
  if (tenantSlug) config.headers["X-Tenant-Slug"] = tenantSlug;
  return config;
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