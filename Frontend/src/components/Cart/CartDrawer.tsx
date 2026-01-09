import type React from "react"
import { useCart } from "../../hooks/useCart"
import { useEffect, useRef } from "react";
import "../../styles/style.css";
import { FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import { faTrashCan, faWindowClose } from "@fortawesome/free-regular-svg-icons";
import "../../styles/Cart.css"

export const CartDrawer: React.FC = () => {
    const {isOpen, closeCart, cartItems, removeFromCart, updateQty, total} = useCart();
    const panelRef = useRef<HTMLDivElement>(null);
    const closeBtnRef = useRef<HTMLButtonElement>(null);
    const lastFocuseRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (isOpen) {
            lastFocuseRef.current = document.activeElement as HTMLElement | null;
            (closeBtnRef.current ?? panelRef.current)?.focus?.();
        }
    }, [isOpen])

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeCart();
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey); 
    }, [closeCart]);

    useEffect(() => {
        if (isOpen) {
            const prev = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            
            return () => {
                document.body.style.overflow = prev;
            }
        }
    }, [isOpen])

    if (!isOpen) return null;

    return (
        <section className="fixed inset-0">
        {/* OVERLAY – mousedown stänger */}
            <section
                onMouseDown={closeCart}
                className="absolute inset-0 bg-white/40 transition-opacity opacity-100 pointer-events-auto"
                aria-hidden="true"
                style={{zIndex: 10}}
            />

    {/* PANEL – stoppa både mousedown och click från att bubbla */}
    <section
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Cart"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      tabIndex={-1}
      className="cart-container absolute right-0 top-0 h-full w-full max-w-md 
                shadow-xl transition-transform duration-300 translate-x-0"
      style={{ zIndex: 10 }}
    >
      <header className="flex items-center justify-between border-b p-4">
        <h2>Your Cart</h2>
        <button type="button" onClick={() => { 
            closeCart() 
            setTimeout(() => lastFocuseRef.current?.focus?.(), 0);
        }} 
        aria-label="Close cart" 
        className="p-2"
        >
          <FontAwesomeIcon icon={faWindowClose} />
        </button>
      </header>
              <section className="flex h-[calc(100%-8rem)] flex-col p-4 gap-4 overflow-y-auto">
                {cartItems.length === 0 ? (
                  <p>Your cart is empty.</p>
                ) : (
                  cartItems.map((ci) => (
                    <section key={ci.id} className="flex gap-3 items-center border rounded p-2">
                      {ci.black || ci.white || ci.grey && (
                        <img
                          src={ci.black || ci.white || ci.grey}
                          alt={ci.label}
                          className="h-14 w-14 object-cover rounded"
                        />
                      )}
                      <section className="flex-1">
                        <section className="font-medium">{ci.label}</section>
                        <section className="text-sm opacity-70">{ci.price}</section>
                        <section className="mt-2 flex items-center gap-2">
                          <label htmlFor={`qty-${ci.id}`} className="text-sm">
                            Amount:
                          </label>
                          <input
                            id={`qty-${ci.id}`}
                            type="number"
                            min={1}
                            max={3}
                            value={ci.qty}
                            onChange={(e) =>
                              updateQty(ci.id, Number(e.target.value || 1))
                            }
                            className="w-16 rounded border px-2 py-1"
                          />
                        </section>
                      </section>
                      <button
                        type="button"
                        onClick={() => removeFromCart(ci.id)}
                        aria-label="Remove item"
                        className="p-2"
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                    </section>
                  ))
                )}
              </section>
            
              <footer className="border-t p-4 flex items-center justify-between">
                <section className="font-semibold">Total: {total} £</section>
                <button
                  disabled={cartItems.length === 0}
                  className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
                >
                  To checkout
                </button>
              </footer>
            </section>
          </section>
        );

    
}