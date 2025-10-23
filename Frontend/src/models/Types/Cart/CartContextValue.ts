import { createContext } from "react";
import type { Product } from "../Search/Product";
import type { CartItem, updateQtyFn } from "../../../components/Cart/CartButton";
import type { CartAmount } from "./CartAmount";

export type CartContextValue = {
    isOpen: boolean;
    cartItems: CartItem[];
    cartAmount: CartAmount[];
    toggleCart: () => void;
    openCart: () => void;
    closeCart: () => void;
    addToCart: (p: Product, qty?: number) => void;
    removeFromCart: (id: string) => void;
    updateQty: updateQtyFn;
    total: number;
}

export const CartContext = createContext<CartContextValue | undefined>(undefined)