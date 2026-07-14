import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:7000/api/v1",
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const message: string =
      err.response?.data?.message ?? err.message ?? "Something went wrong";
    return Promise.reject(new Error(message));
  },
);