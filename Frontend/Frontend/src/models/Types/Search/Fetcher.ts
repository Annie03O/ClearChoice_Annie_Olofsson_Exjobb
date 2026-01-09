import { products } from "../../objects/products";

export type Fetcher<T> = (query: string, signal: AbortSignal) => Promise<T[]>;

export const localFetcher = async (q: string) => {
    const query = q.trim().toLowerCase();
    return products.filter(p => p.label.toLowerCase().includes(query))
}