import { type Dispatch, type SetStateAction } from "react";
import type { ShippingMethod } from "../../models/Types/Cart/Shipping";
import { MenuWrapper } from "../ul/MenuWrapper";
import  { ShippingMethodsOpen } from "./ShippingMethodsOpen";
import { ShippingMethodsClosed } from "./ShippingMethodsClosed";

type Props = {
    pickedMethod: ShippingMethod | undefined;
    setPickedMethod: Dispatch<SetStateAction<ShippingMethod>>;
    open: boolean;
    onClose: () => void;
}

export const ShippingMethods: React.FC<Props> = ({pickedMethod, setPickedMethod, open,  onClose}) => {

    console.log("ShippingMethods", open);
    console.log(pickedMethod);
    
    
    return (
     <MenuWrapper open={open} closeMenu={onClose} title="Shipping Methods">
                          
       <section className="flex flex-col w-full max-w-[400px] sm:max-w-[600px] px-2">
 
        {open  ? (
          <ShippingMethodsOpen 
            pickedMethod={pickedMethod} 
            setPickedMethod={setPickedMethod} 
            onClose={onClose} 
            open={open}
          />
        ) :  
         <ShippingMethodsClosed pickedMethod={pickedMethod}  /> }
      </section>

    </MenuWrapper>
      )
};
