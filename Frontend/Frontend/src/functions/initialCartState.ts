import { CART_STORAGE_KEY } from "../components/Cart/CartProvider";
import type { CartState } from "../reducers/CartReducer";

// Init-funktion: körs en gång när reducer skapas
export function initialCartState(): CartState {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return { items: []};

    const parsed = JSON.parse(raw) as CartState;
    
    return {items: Array.isArray(parsed.items) ? parsed.items : []};
  } catch {
    return {items: []};
  }
}