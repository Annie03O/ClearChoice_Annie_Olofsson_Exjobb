import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCart } from "../../hooks/useCart"
import { Button } from "../ul/Button";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import {  useNavigate } from "react-router";
import { ItemInCart } from "./ItemInCart";
import { useUserAuth } from "../../hooks/Auth/useUserAuth";

export const CartView = () => {
    const {items, totalQty, totalPrice, orderPrice, dispatch}  = useCart(); 
    const [isOpenCart, setIsOpenCart] = useState(false);
    const {isAuthenticated} = useUserAuth();
    
  const handleCart = () => {
    setIsOpenCart(!isOpenCart);
  };

  useEffect(() => {
    const handleEscKeyPress = (e: any) => {
      if (e.keyCode === 27 && isOpenCart) {
        setIsOpenCart(false);
      }
      
    };

    if (isOpenCart ) {
      document.body.style.setProperty("overflow", "hidden");
    } else {
      document.body.style.removeProperty("overflow");
    }

    document.addEventListener("keydown", handleEscKeyPress);

    return () => {
      document.removeEventListener("keydown", handleEscKeyPress);
    };
  }, [isOpenCart]);

  console.log(items);

  const navigate = useNavigate();
  
  const goToCheckout = () => {
    navigate("Cart")
    setIsOpenCart(false)
  }
  
    return (
        <section>
            <section>
                <button className="flex  items-center justify-center" aria-label="open-cart" onClick={handleCart}>
                    <FontAwesomeIcon icon={faShoppingCart} className="text-[clamp(18px,1.1vw,30px)]"/>
                    {items.length > 0 ? <span className=" text-[1.2em]  rounded-xl pb-2">{totalQty}</span> : ""} 
                </button>
            </section>
            <section
              className={`p-2 fixed top-0 right-0 w-full sm:w-[90vw] md:w-[500px] h-dvh 
                bg-white text-[#010057]  
              overflow-y-auto overflow-x-hidden
              transition-transform duration-300 z-30
              ${isOpenCart ? "translate-x-0" : "translate-x-full"}`}
            >

                 <header className="headrow flex flex-col">
                    <section>
                      <section className="logo">ClearChoice</section>
                      {/* Gör close som en knapp och ta bort inset-0 */}
                      <button
                        type="button"
                        className="absolute justify-center align-center top-[20px] right-[20px]"
                        onClick={() => setIsOpenCart(false)}
                        aria-label="Stäng meny"
                      >
                        <span className="absolute w-6 h-[2px] bg-[#010057] origin-center rounded-[1px] rotate-45"></span>
                        <span className="bg-[#010057] w-[24px] h-[2px] absolute tranform-center -rotate-45"></span>
                      </button>
                    </section>
                    <section className="flex gap-[14em]">
                       <h2 className="text-3xl">Cart </h2>
                    </section>
                </header>

                
                <ItemInCart page={false}/>
                <hr/>
                {items.length > 0 ? ( 
                  <section>
                    <section>Order: {orderPrice}£</section>
                    <section className="text-[1em]">Estimated shipping fee: {isAuthenticated ? "4.19£" : "5.99£"}</section>
                    <section>Total: {totalPrice.toFixed(2)}£</section>
                    <section className="flex gap-2">
                      <Button size="small" variant="secondary" onClick={() => dispatch({type: "CLEAR"})}>Empty Cart</Button>
                      <Button size="small" onClick={goToCheckout}>Checkout</Button>
                    </section> 
                </section>) : ""}
           </section>
        </section>
    )
}