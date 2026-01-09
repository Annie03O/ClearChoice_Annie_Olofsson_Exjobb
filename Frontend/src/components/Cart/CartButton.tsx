import React from "react";
import { useCart } from "../../hooks/useCart";
import type { Product } from "../../models/Types/Search/Product";
import { FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
export type updateQtyFn = (id:string, qty: number) => void;
export type CartItem = Product & { qty: number}

export const CartButton: React.FC = () => {
    const {toggleCart, cartItems} = useCart();
    const count = cartItems.reduce((n, it) => n + it.qty, 0); 
    
    return (
        <button aria-haspopup="dialog" onClick={toggleCart}>
            <FontAwesomeIcon icon={faCartShopping}/>
            {count > 0 && (
                <span>
                    {count}
                </span>
            )}
        </button>
    )
}