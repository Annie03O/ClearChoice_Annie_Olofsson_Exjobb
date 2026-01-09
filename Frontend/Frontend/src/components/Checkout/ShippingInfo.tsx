import { AddressForm } from "./AddressForm";
import { MenuWrapper } from "../ul/MenuWrapper"
import { BillingInfo } from "./BillingInfo";

export type Props = {
    open: boolean;
    closeMenu: () => void;
    onDone: () => void;
}

export type Shipping = { 
    firstName: string, 
    lastName: string, 
    email: string, 
    adress: string, 
    secondAdress: string, 
    zip: string, 
    country: string, 
    city: string
}

export const ShippingInfo = ({open, closeMenu, onDone}: Props) => {
   
    
    return (
               <MenuWrapper open={open} closeMenu={closeMenu} title="Personal Information">
                  {open ? <AddressForm onClose={onDone} open={open}  /> : <BillingInfo />}
                </MenuWrapper>
    )
}