import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import ReactDOM  from "react-dom";

type ModalProps = {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    calculator?: boolean; 
}

export const Modal: React.FC<ModalProps> = ({open, onClose, title, children, calculator }) => {
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

    const width = calculator ? "w-[clamp(280px,90vw,365px)]"
    :  "w-[clamp(300px,90vw,1500px)]";

    return ReactDOM.createPortal(
        <section className="fixed inset-0 z-50">
            <section className="absolute inset-0 bg-black/40" onClick={onClose}/>
            <section className="absolute inset-0 flex items-center  justify-center p-4">
                <article
                    role="dialog"
                    aria-modal="true"
                    aria-label={title ?? "Dialog"}
                    className={`${width} rounded bg-[#E2E8F0] p-4 shadow-xl`}
                    onClick={(e) => e.stopPropagation()}
                    >
                        <section className="bg-white rounded">
                           <header className="mb-4 flex items-center justify-between border-b w-full pb-1 h-[fit-content]" >
                               <h2 className="ml-2 text-[clamp(18px,1.6vw,40px)] font-semibold text-black">{title}</h2>
                               <button 
                                  type="submit"
                                  onClick={onClose}
                                  aria-label="Stäng"
                                  className="flex justify-center items-center rounded-3xl mt-2 mr-2 bg-[#9f9f9f] border h-8 w-[clamp(30px,2vw,70px)] h-[clamp(30px,2vw,70px)] relative ">
                                 <FontAwesomeIcon icon={faClose} className="text-b1lack text-[clamp(20px,2vw,26px)]"/>
                                 
                               </button>
                           </header>
                           {children}
                       </section>
                </article>
            </section>
        </section>,   
        document.body
    )
};
