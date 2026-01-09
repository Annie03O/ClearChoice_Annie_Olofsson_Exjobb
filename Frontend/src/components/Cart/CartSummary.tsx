import { useNavigate } from "react-router";
import { useCart } from "../../hooks/useCart"
import { Button } from "../ul/Button";
import { useUserAuth } from "../../hooks/Auth/useUserAuth";

export const CartSummary = () => {
    const {orderPrice, totalPrice} = useCart();
    const { isAuthenticated } = useUserAuth();
       
    const navigate = useNavigate();

    const goToCheckout = () => {
      navigate("/Checkout")
    }
    const goToProducts = () => {
      navigate("/Products")
    }
    
    return (
        <section className="text-[clamp(16px,1.6vw,30px)] flex flex-col gap-3 sm:gap-4 p-2 sm:p-4 relative bg-white w-full">
         <section className="flex flex-col sm:flex-row border-b pb-1 gap-2 sm:gap-0">
            <label className="sm:w-2/3 text-sm sm:text-base" htmlFor="discount">Discounts</label>
            <button className="underline whitespace-nowrap text-xs sm:text-sm">Add a cupon</button>
         </section>
         <section className="flex flex-col border-b pb-1">
            <section className="flex flex-col sm:flex-row gap-2 sm:gap-0">
               <label className="sm:w-2/3 text-sm sm:text-base" htmlFor="ordervalue">Order value</label>
               <span className="font-semibold text-sm sm:text-base">{orderPrice} £</span>
            </section>
            <section className="flex flex-col sm:flex-row gap-2 sm:gap-0">
               <label className="sm:w-2/3 text-sm sm:text-base" htmlFor="tax">Estimated shipping fee</label>
               <span className="font-semibold text-sm sm:text-base">{isAuthenticated ? "4.19 £ " : "5.99 £"}</span>
            </section>
         </section>
          <section className="flex flex-col sm:flex-row border-b pb-1 gap-2 sm:gap-0">
             <label className="sm:w-2/3 text-sm sm:text-base" htmlFor="total">Total</label>
             <span className="font-semibold text-sm sm:text-base"> {totalPrice.toFixed(2)} £</span>
          </section>
          <section className="flex flex-col sm:flex-row gap-2 sm:gap-1 w-full">
              <Button size="full-width" variant="secondary" onClick={goToProducts}>Continue shopping</Button>
              <Button size="full-width" onClick={goToCheckout}>Go to checkout</Button>
          </section>
         </section>
    )
}