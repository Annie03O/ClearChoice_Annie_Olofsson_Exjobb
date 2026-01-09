import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../ul/Button";
import { faHeart,  faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useSaved } from "../../hooks/useSaved";

export const SavedView = () => {
    const {state, dispatch} = useSaved(); 
    const [isOpen, setIsOpen] = useState(false);

  const handleSaved = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleEscKeyPress = (e: any) => {
      if (e.keyCode === 27 && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen ) {
      document.body.style.setProperty("overflow", "hidden");
    } else {
      document.body.style.removeProperty("overflow");
    }

    
    document.addEventListener("keydown", handleEscKeyPress);

    return () => {
      document.removeEventListener("keydown", handleEscKeyPress);
    };
  }, [isOpen]);

  console.log(state.savedItems);

    return (
        <section>
            <section>
                <button aria-label="open-saved" onClick={handleSaved}>
                    <FontAwesomeIcon icon={faHeart} className="text-[clamp(18px,1.1vw,30px)]"/>
                </button>
            </section>
            <section
              className={`p-2 fixed top-0 right-0 h-dvh w-full sm:w-[90vw] md:max-w-[420px] bg-white border text-[#010057]
              overflow-y-auto overflow-x-hidden
              transition-transform duration-300 z-30
              ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >

                 <header className="headrow flex flex-col">
                    <section>
                      <section className="logo">ClearChoice</section>
                      {/* Gör close som en knapp och ta bort inset-0 */}
                      <button
                        type="button"
                        className="absolute justify-center align-center top-[20px] right-[20px]"
                        onClick={() => setIsOpen(false)}
                        aria-label="Stäng meny"
                      >
                        <span className="absolute w-6 h-[2px] bg-[#010057] origin-center rounded-[1px] rotate-45"></span>
                        <span className="bg-[#010057] w-[24px] h-[2px] absolute tranform-center -rotate-45"></span>
                      </button>
                    </section>
                    <section className="flex gap-[14em]">
                       <h2 className="text-3xl">Saved</h2>
                    </section>
                </header>

                
                {
                 state.savedItems.length === 0 ? <section>No saved objects yet</section> : 
                    state.savedItems.map(({product}) => (
                      
                    <section key={product?.id} className="flex gap-[12px] align-center mb-4">
                        <section><img className="w-[10em]" src={
                          product?.white ? product.images.white : 
                          product?.grey ? product.images.grey : 
                          product?.images.black 
                        } alt={product?.label} /></section>
                        <section className="flex flex-col gap-[.1em]">
                            <h2 className="text-xl nowrap">{product?.label}</h2>
                            <b>Price: {product?.price}£</b>
                            <section className="flex gap-2">
                            <button onClick={() => dispatch({type: "REMOVE_ITEM", id: product!.id })}><FontAwesomeIcon icon={faTrash}/></button>
                    
                            </section>
                        </section>
                    </section>                
                ))}
                 <Button size="small" disabled={state.savedItems.length === 0 ? true : false} onClick={() => dispatch({type: "CLEAR"})}>Clear</Button>
           </section>
        </section>
    )
}