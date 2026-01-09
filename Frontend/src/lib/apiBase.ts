import axios from "axios";

const isProduction = import.meta.env.MODE === 'production';
const apiBaseUrl = isProduction 
  ? "http://localhost:4000/api"  // GitHub Pages points to local Backend
  : "/api";                        // Local dev uses Vite proxy

export const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Logga HELA URL:en snyggt
api.interceptors.request.use((config) => {
  const fullUrl = `${config.baseURL ?? ""}${config.url ?? ""}`;
  console.log("[API] Request to:", fullUrl, "withCredentials:", config.withCredentials);
  return config;
});

let refreshing = false;
let queue: Array<(tokenOk: boolean) => void> = [];

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    const is401 = err.response?.status === 401;
    const isRefresh = original?.url?.includes("/auth/refresh");

    if (is401 && !original._retry && !isRefresh) {
      if (refreshing) {
        await new Promise<void>((resolve, reject) => {
          queue.push((ok) => (ok ? resolve() : reject(err)));
        });
        return api(original);
      }

      original._retry = true;

      try {
        refreshing = true;
        await api.post("/auth/refresh"); // => /api/auth/refresh
        queue.forEach((fn) => fn(true));
        queue = [];
        return api(original);
      } catch (refreshErr) {
        queue.forEach((fn) => fn(false));
        queue = [];
        return Promise.reject(refreshErr);
      } finally {
        refreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

// ✅ axios-helpers
export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`/api${path}`, {
    method: "GET",
    credentials: "include",
    cache: "no-store", // ✅ viktigt: undvik 304
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache", // ✅ extra
      Pragma: "no-cache",
    },
  });

  const text = await res.text();
  if (!res.ok) throw new Error(text || `Request failed (${res.status})`);

  // Om tom body (ska inte hända med 200, men skyddar)
  if (!text) throw new Error(`Empty response body (${res.status}).`);

  return JSON.parse(text) as T;
}

export async function apiPost<TRes, TBody>(path: string, body: TBody): Promise<TRes> {
  const res = await api.post<TRes>(path, body);
  return res.data;
}
