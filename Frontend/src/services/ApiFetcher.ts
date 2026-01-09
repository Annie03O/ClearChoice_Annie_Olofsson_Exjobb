import type { Fetcher } from "../models/Types/Search/Fetcher"; 
import type { Product } from "../models/Types/Search/Product"; 
import { api } from "../lib/apiBase"; 

export const apiFetcher: Fetcher<Product> = async (q, signal) => {
  const query = q.trim();

  // valfritt: om tom query, returnera tom lista direkt
  if (!query) return [];

  try {
    const res = await api.get<Product[]>("/search", {
      params: { query },   // => /api/search?query=...
      signal,              // axios v1+ stöder AbortController signal
      headers: { Accept: "application/json" },
    });

    return res.data;
  } catch (err: any) {
    // Om requesten abortas
    if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED") {
      throw err; // eller return [] om du vill tysta abort
    }

    const status = err?.response?.status;
    const message =
      err?.response?.data?.message ??
      (typeof err?.response?.data === "string" ? err.response.data : "") ??
      err?.message;

    throw new Error(`Search failed (${status ?? "?"}): ${message ?? ""}`.trim());
  }
};
