// src/cart/CartProvider.tsx
import React, { createContext, useMemo, useReducer, useEffect } from "react";
import { cartReducer, type CartAction, type CartState } from "../../reducers/CartReducer";
import { initialCartState } from "../../functions/initialCartState";
import { useUserAuth } from "../../hooks/Auth/useUserAuth";

type CartContextValue = CartState & {
  dispatch: React.Dispatch<CartAction>;
  totalQty: number;
  orderPrice: number;
  totalPrice: number;
};

export const CartContext = createContext<CartContextValue | null>(null);

export const CART_STORAGE_KEY = "clearchoice_cart_v1";


export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, initialCartState);
  const {isAuthenticated} = useUserAuth();

  // Spara items vid förändring
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const totalQty = useMemo(
    () => state.items.reduce((sum, i) => sum + i.qty, 0),
    [state.items]
  );

  const orderPrice = useMemo(
    () => state.items.reduce((sum, i) => sum + i.qty * (i.product.price ?? 0), 0),
    [state.items]
  );

const totalPrice = useMemo(() => {
  const itemsTotal = state.items.reduce(
    (sum, i) => sum + i.qty * (i.product.price ?? 0),
    0
  );

  if (itemsTotal === 0) return 0;

  return itemsTotal + (isAuthenticated ? 4.19 : 5.99);
}, [state.items, isAuthenticated]);

  const value: CartContextValue = {
    ...state,
    dispatch,
    totalQty,
    totalPrice,
    orderPrice
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
