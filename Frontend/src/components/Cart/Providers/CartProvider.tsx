import type React from "react";
import { useMemo, useState } from "react";
import type { CartAmount} from "../../../models/Types/Cart/CartAmount";
import type { Product } from "../../../models/Types/Search/Product";
import { CartContext, type CartContextValue } from "../../../models/Types/Cart/CartContextValue";
import type { CartItem } from "../CartButton";

export type UpdateQty = (id: string, qty: number) => void;


export const CartProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems] = useState<CartItem[]>([]);
  const [cartAmount, setCartAmount] = useState<CartAmount[]>([]);
  const toggleCart = () => setIsOpen(v => !v);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

const addToCart = (p: Product, qty = 1) => {
  setCartAmount(cur => {
    const i = cur.findIndex(ci => ci.product.id === p.id);
    if (i === -1) return [...cur, { product: p, amount: qty }];          // ✅ rätt form
    return cur.map((ci, idx) => (idx === i ? { ...ci, amount: ci.amount + qty } : ci));     // ✅ rätt form
  });

  openCart();
};


  const removeFromCart = (id: string) => {
    setCartAmount(cur => cur.filter(ci => ci.product.id !== id));
  };

  const updateQty = (id: string, amount: number) => {

    setCartAmount(cur =>
        cur.map(ci =>
            ci.product.id === id ? { ...ci, amount: Math.max(1, amount) } : ci
        )
    );
    };

    const total = useMemo(
      () => cartAmount.reduce((sum, ci) => sum + ci.product.price * ci.amount, 0), 
      [cartItems]
    ); 



  const value: CartContextValue = {
    isOpen,
    cartItems,
    cartAmount,
    toggleCart,
    openCart,
    closeCart,
    addToCart,
    removeFromCart,
    updateQty,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
