import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { shippingMethods } from "../../models/objects/shippingMethods";
import type { ShippingMethod } from "../../models/Types/Cart/Shipping";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

type Props = {
    pickedMethod: ShippingMethod | undefined;
    setPickedMethod: Dispatch<SetStateAction<ShippingMethod>>;
    onClose: () => void;
    open: boolean;

}

export const ShippingMethodsOpen:React.FC<Props> = ({pickedMethod, setPickedMethod,  onClose, open}) => {
    const [chosenMethod, setChosenMethod] = useState(false);

     // ESC + body scroll
             useEffect(() => {
               const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
               if (open) document.addEventListener("keydown", onKey);
               document.body.style.overflow = open ? "hidden" : "";
               return () => {
                 document.removeEventListener("keydown", onKey);
                 document.body.style.overflow = "";
               };
             }, [open, onClose]);
           
             if (!open) return null;
          


    return (
     <section className="flex flex-col w-full">
 
        {shippingMethods.map((s) => {
       const selected = pickedMethod?.id === s.id;
       
       return (
        
         <button
          key={s.id}
          type="button"
          onClick={() => { setPickedMethod(s); setChosenMethod(!chosenMethod); onClose()}}
           className="flex text-sm sm:text-lg border text-left items-center w-full h-[clamp(50px, 60px, 70px)]">
              <span className="w-fit border-r h-full flex justify-center items-center flex-shrink-0 px-3">
                 {selected ? <FontAwesomeIcon icon={faCircle} className="text-blue-500"/> : <FontAwesomeIcon icon={faCircle} className="text-gray-400 hover:text-blue-500"/>}
           </span>
           <span className="min-w-[80px] sm:min-w-[130px] border-r h-full flex items-center justify-center flex-shrink-0 px-2">
                   <span className="whitespace-nowrap flex items-center gap-1 sm:gap-2">
                      {s.label}</span>
              <span className="hidden sm:block">
                 <img className={`${
                        s.label === "Post NL" ? "w-[1.2em] h-[1.2em]"
                        : s.label === "UPS" ? "w-[1.6em] h-[1.5em]"
                        : s.label === "FedEx" ? "w-[2em] h-[1.2em]"
                        : "w-[1.3em] h-[0.8em]"} h-[1.5em]`} src={s.logo} alt={s.label} />
               </span>
            </span>
           <span className="border-r min-w-[60px] sm:min-w-fit sm:w-[clamp(10%, 15%, 20%)] h-full flex items-center justify-center text-xs sm:text-base flex-shrink-0 px-2">{s.taxes}</span>
           <span className="whitespace-nowrap h-full min-w-[100px] sm:w-[40%] flex items-center justify-center text-xs sm:text-base flex-shrink-0 px-2">{s.deleveryTime} Days</span>
        </button> 
      )})}
      </section>
    )
}