import type {  CartItem } from "../models/Types/Cart/CartItem";

export type CartState = {
    items: CartItem[],
}
export type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "qty">; qty?: number}
  | { type: "INCREASE"; productId: string }
  | { type: "DECREASE"; productId: string }
  | { type: "REMOVE_ITEM"; id: string}
  | { type: "SET_QTY"; id: string; qty: number}
  | { type: "CLEAR"}



export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const qtyToAdd = action.qty ?? 1;
      const id = action.payload.id;

      const existing = state.items.find((i) => i.id === id);

      
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === id ? {...i, qty: i.qty = + qtyToAdd}: i
          ),
        };
      }

      return { items: [...state.items, { ...action.payload, qty: qtyToAdd}] };
    }

    case "INCREASE": 
       return {
        items: state.items.map(i =>
          i.product.id === action.productId ? {...i, qty: i.qty + 1} : i
        )
       }

    case "DECREASE": 
       return {
        items: state.items.map(i =>
          i.product.id === action.productId ? {...i, qty: i.qty - 1} : i
        ).filter(i => i.qty > 0)
       }

    case "REMOVE_ITEM":
      return { 
        items: state.items.filter((i) => i.id !== action.id ) };

    case "CLEAR":
      return { items: [] };

    case "SET_QTY":
      return { 
        items: state.items.map((i) =>
          i.id === action.id ? {...i, qty: Math.max(1, action.qty)} : i
        ) };

    default:
      return state;
  }
}
