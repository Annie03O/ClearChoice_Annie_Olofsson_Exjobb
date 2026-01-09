import { ItemInCart } from "../../components/Cart/ItemInCart";
import { CartSummary } from "../../components/Cart/CartSummary";
import { Button } from "../../components/ul/Button";
import { useUserAuth } from "../../hooks/Auth/useUserAuth";
import { useState } from "react";
import { Modal } from "../../components/ul/Modal";
import { Login } from "../Nav/Auth/Login";
import { useLocation } from "react-router";

export const CartPage = () => {
   const { isAuthenticated } = useUserAuth();
   const [showAuthModal, setShowAuthModal] = useState(false);
   const [login, setLogin] = useState(false);     
   const location = useLocation();
   
   const handleClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

  };
   return (
     <section className="flex justify-center items-center px-2 sm:px-4">
         <section className="w-full max-w-[1200px] bg-white text-[#010057] pl-2 sm:pl-3 flex flex-col">         
         <section className="flex flex-col w-full justify-center items-center">
            <h1 className="text-2xl sm:text-4xl relative top-2 w-full">Cart</h1>
            <section className="flex flex-col lg:flex-row justify-center items-start w-full gap-4 lg:gap-0">
               <section className="w-full flex-1 min-w-0">
                  <ItemInCart page={true}/>
               </section>
               <section className="flex flex-col w-full lg:w-[400px] gap-4 flex-shrink-0">
                  <CartSummary/>
                  {!isAuthenticated ?
                  <section className="w-full flex flex-col gap-4">

                     <section className="text-sm sm:text-base">
                        <span>Members get 30% off on the shipping fee as well as additional discounts on selected items. 
                           Each new member get the first order free of shipping as well as 20% off on the whole first order. </span>
                     </section>
                     <section className="flex justify-center">

                       <Button variant="thirtiary" size="large" onClick={handleClick}>Sign in</Button>               
                     </section>
                  </section> : ""
                  }
                  <Modal
                          open={showAuthModal}
                          onClose={() => setShowAuthModal(false)}
                          title="Not logged in"
                        >
                           <Login onClose={() => {
                            setShowAuthModal(false);
                            }}
                            lastVisited={location.pathname }                        
                            />
                  </Modal>
                          <section>
               </section>
            </section>
            </section>
         
         </section>
     </section>
     </section>
   ) 
}