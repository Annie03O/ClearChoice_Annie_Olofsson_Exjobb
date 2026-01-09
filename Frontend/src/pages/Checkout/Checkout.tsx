import { useEffect, useState } from "react";
import { CheckoutHeader } from "../../components/Checkout/CheckoutHeader";
import { useCart } from "../../hooks/useCart";
import { ShippingInfo } from "../../components/Checkout/ShippingInfo";
import { ShippingMethods } from "../../components/Checkout/ShippingMethod";
import { shippingMethods } from "../../models/objects/shippingMethods";
import type { ShippingMethod } from "../../models/Types/Cart/Shipping";
import { Payment } from "../../components/Checkout/Payment";
import type { PaymentMethod } from "../../models/Types/Cart/PaymentMethod";
import { paymentMethods } from "../../models/objects/paymentMethods";
import { titleCase } from "../../functions/titleCase";

export const Checkout = () => {
  const { orderPrice, totalQty, items } = useCart();
  const [openForm, setOpenForm] = useState(true);
  const [openShipping, setOpenShipping] = useState(false);
  const [method, setMethod] = useState<ShippingMethod>(shippingMethods[0]);
  const [payment, setPayment] = useState<PaymentMethod>(paymentMethods[0]);
  const [openPayment, setOpenPayment] = useState(false);
  const [shippingEnabled, setShippingEnabled] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  useEffect(() => {
    console.log("openForm:", openForm);
  }, [openForm]);

  useEffect(() => {
    console.log("openShipping:", openShipping);
  }, [openShipping]);
  useEffect(() => {
    console.log("openPayment:", openPayment);
  }, [openPayment]);

  const closeForm = () => {
    setOpenForm(false);
    setOpenShipping(true);
  };
  const closePayment = () => {
    setOpenPayment(false);
    
  };

  const goToShippingMethods = () => {
  setOpenForm(false);
  setShippingEnabled(true);
  setOpenShipping(true);
};
const goToPayment = () => {
  console.log("Payment anropas");
  
  setOpenShipping(false);
  setOpenPayment(true)
};

  return (
    <section className="p-2 sm:p-4 flex justify-center items-center">
      <section className="w-full max-w-[1400px]">
        <section className="w-full lg:w-[80%]">
          <CheckoutHeader totalQty={totalQty} orderPrice={orderPrice} />
          <section className={`flex flex-col-reverse lg:flex-row justify-center items-start gap-4 lg:gap-0`}>          
            <section className="border w-full lg:flex-1 bg-white">
               <ShippingInfo open={openForm} closeMenu={closeForm} onDone={goToShippingMethods}/>

               {shippingEnabled ? <ShippingMethods
                 pickedMethod={method}
                 setPickedMethod={setMethod}
                 open={openShipping}
                 onClose={goToPayment}
               /> : null}

               {openPayment ? (
                 <Payment 
                    pickedShipping={method}
                    pickedPayment={payment} 
                    setPayment={setPayment}
                    open={openPayment}
                    closeMenu={closePayment}
               />
               ): null}
               </section>
        <section className="border p-2 sm:p-4 w-full lg:w-[300px] h-fit sticky top-2 self-start flex-shrink-0">
          {/* Order summary component here */}
          <section>
            <h2 className="text-lg sm:text-2xl font-semibold mb-4">Order Summary</h2>
            {
            showOrderSummary === false 
            ? <button 
                 className="underline text-sm sm:text-base" 
                 onClick={
                  () => setShowOrderSummary(true)}
              >
                View
              </button> 
              : <button className="underline text-sm sm:text-base" 
                  onClick={
                    () => setShowOrderSummary(false)
                  }
                >
                  Hide
                </button>
                }
          </section>
          <section className={`flex flex-col ${showOrderSummary ? "block" : "hidden" }`}>          
          <section >
            {items.map(({ product, color, size, qty, id }) => (
              <section key={id} className="flex justify-between mb-2 text-[clamp(10px,1.2vw,20px)]">
                <span>
                  <p className="text-[clamp(15px,1.2vw,20px)]">{product.label}  {qty > 1 ? qty + "x" : ""} {titleCase(color)}, {size?.size},  </p>
                </span>
                <span> 
                  <p className="flex text-[clamp(18px,1.2vw,20px)]">{(product.price! * qty).toFixed(2)} £</p>
                </span>
              </section>
            ))}
          </section>
          <section className="lg:border-t lg:pt-4 lg:mt-4 text-[clamp(10px,1.6vw,20px)] ">
            <h2 className="text-lg lg:text-2xl lg:font-semibold mb-4">Totals</h2>
              <p className="text-[clamp(15px,1.2vw,20px)]">Total items: {totalQty}</p>
              <p className="text-[clamp(15px,1.2vw,20px)]">Order Price: {orderPrice.toFixed(2)} £</p>          
            </section>
          </section>
          </section>
        </section> 
        </section> 
        
      </section>
    </section>
  );
};
