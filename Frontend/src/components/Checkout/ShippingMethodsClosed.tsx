import { useEffect } from "react";
import type { ShippingMethod } from "../../models/Types/Cart/Shipping"
type Props = {
    pickedMethod: ShippingMethod | undefined;
}
export const ShippingMethodsClosed = ({pickedMethod}: Props) => {    
    
    
    return (
        <section className="flex gap-2 flex-wrap items-center">
           <span className="text-sm sm:text-base break-words">Chosen Method: {pickedMethod?.label}</span>
           <img className="h-[1.5em] flex-shrink-0" src={pickedMethod?.logo} alt={""} />
        </section>
    )
}