import { useState, type Dispatch, type SetStateAction } from "react";
import type { PaymentMethod } from "../../models/Types/Cart/PaymentMethod";
import { MenuWrapper } from "../ul/MenuWrapper";
import { paymentMethods } from "../../models/objects/paymentMethods";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { useCart } from "../../hooks/useCart";
import { useCheckout } from "../../hooks/useCheckout";
import type { ShippingMethod } from "../../models/Types/Cart/Shipping";
import { submitOrder } from "../../functions/Order/submitOrder"; 
import type { CreateOrderBody } from "../../models/Types/Cart/CreateOrderBody";

type OrderPaymentMethod = "CARD" | "KLARNA" | "PAYPAL" | "SWISH" ;

type Props = {
    pickedPayment: PaymentMethod| undefined;
    setPayment: Dispatch<SetStateAction<PaymentMethod>>;
    open: boolean;
    closeMenu: () => void;
    onClose?: () => void;
    pickedShipping: ShippingMethod | undefined;
}
export const Payment: React.FC<Props> = ({pickedPayment, setPayment, open, closeMenu, pickedShipping}) => {
     const [chosenMethod, setChosenMethod] = useState(false);
     const {items, dispatch} = useCart();
     const {address} = useCheckout();
 
     console.log("ShippingMethods", open);
     console.log(pickedPayment);

    const navigate = useNavigate();
  
    const handlePaymentSelect = async (p: PaymentMethod) => {
      setPayment(p);
      const normalizedAddress = {
        firstName: address.firstName,
        lastName: address.lastName,
        address: address.address ?? address.address,                 // ✅ viktig
        secondAddress: address.secondAddress ?? address.secondAddress, // ✅ viktig
        zip: address.zip,
        city: address.city,
        country: address.country,
      };

      const orderBody: CreateOrderBody =  {
        email: address.email, 
        items: items.map(i => {
          const [productId, colorFromId, sizeFromId] = String(i.id).split("_");
      
          const rawSize = i.size ?? sizeFromId;

          const size = 
            typeof rawSize === "object" && rawSize !== null 
             ? String((rawSize as any).size)
             : rawSize != null 
               ? String(rawSize)
               : undefined

          return {
            productId, 
            qty: i.qty,
            color: i.color ?? colorFromId,
            size
          }
        }),
        shippingFee: pickedShipping?.taxes ?? 0,
        paymentMethod: p.category.toUpperCase() as OrderPaymentMethod,
        address: normalizedAddress,
        shippingMethodId: pickedShipping?.id ?? undefined,
      }

      console.log("ORDER BODY SENT:", orderBody);
      console.log("ORDER ITEMS SENT:", orderBody.items);

      const order = await submitOrder(orderBody);

      sessionStorage.setItem("lastOrderNumber", order.orderNumber);
          
      if (order.guestToken) {
        sessionStorage.setItem("guestToken", order.guestToken);
      }
      
      navigate(`/Receipt/${order.orderId}`);

      dispatch({type: "CLEAR"})
    }
     return (
        <MenuWrapper open={open} closeMenu={closeMenu} title="Payment">
            <section className="flex flex-col w-full max-w-[500px] sm:max-w-[700px] px-2">
 
            {chosenMethod === false ? paymentMethods.map((p) => {
                const selected = pickedPayment?.id === p.id;
               
                return (
                 <button
                   key={p.id}
                   className="grid grid-cols-[60px_1fr_1fr] sm:grid-cols-[80px_150px_1fr] text-sm sm:text-lg border text-left items-center w-full h-[clamp(50px,60px,70px)]" 
                   onClick={() =>  handlePaymentSelect(p)}
              >
                <span className="border-r h-full flex justify-center items-center px-3">
                  <FontAwesomeIcon
                    icon={faCircle}
                    className={selected ? "text-blue-500" : "text-gray-400 hover:text-blue-500 "}
                  />
                </span>
                <span className="border-r h-full flex items-center justify-center px-2">
                  <span className="whitespace-nowrap flex items-center gap-1 sm:gap-2">
                    {p.category}
                    <img
                      className={`
                        ${p.category === "paypal" ? "w-[2em] h-[1em]"
                        : p.category === "swish" ? "w-[3em] h-[1.5em]"
                        : p.category === "card" ? "w-[1.2em] h-[1.2em]"
                        : "w-[1.3em] h-[.8em]"}
                      `}
                      src={p.logo}
                      alt={p.category}
                    />
                  </span>
                </span>
                <span className="h-full flex items-center justify-center text-xs sm:text-base px-2">
                  {p.text}
                </span>
              </button>
              
             )})
             : ""} 
            </section>            
        </MenuWrapper>
     )
    

}