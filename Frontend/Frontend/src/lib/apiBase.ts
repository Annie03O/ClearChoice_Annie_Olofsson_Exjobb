import axios from "axios";

// ✅ En källa till sanning för baseURL
// Dev: om du vill köra proxy, sätt VITE_API_BASE_URL=/api i .env.development
// Prod: sätt VITE_API_BASE_URL=https://din-backend.../api i Vercel
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

// Logga HELA URL:en snyggt
api.interceptors.request.use((config) => {
  // axios kan ha baseURL i instance + url i config
  const fullUrl = `${config.baseURL ?? API_BASE_URL}${config.url ?? ""}`;
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
        await api.post("/auth/refresh"); // => {API_BASE_URL}/auth/refresh
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

// ✅ Helpers – använd axios (inte fetch) så baseURL alltid respekteras
export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await api.get<T>(path, {
    signal,
    // cache headers är inte lika relevanta i axios, men kan skickas om du vill:
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });
  return res.data;
}

export async function apiPost<TRes, TBody>(path: string, body: TBody): Promise<TRes> {
  const res = await api.post<TRes>(path, body);
  return res.data;
}
