import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCart } from "../../hooks/useCart";
import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

export const ItemInCart = ({page}: {page: boolean}) => {
    const {items, dispatch} = useCart(); 
     
    return ( 
        items.length === 0 ? <section>Cart is empty</section> : 
            items.map(({product, color, id, size, qty}) => (
               <section 
                 key={
                  product.id
                 } 
                 className={
                  page 
                   ? "flex flex-col sm:flex-row mb-4 gap-3 w-full overflow-x-auto pr-2" 
                   : "flex flex-col sm:flex-row mb-4 gap-3 border p-2 w-full overflow-x-auto"
                  }>
                   <section 
                     className="border w-full sm:w-[clamp(165px,20vw,200px)] sm:h-[clamp(159px,20vw,200px)] flex-shrink-0" >
                     <img   
                       className="w-full sm:w-[clamp(165px,20vw,200px)] h-[clamp(150px,auto,200px)] sm:h-[clamp(159px,20vw,200px)] object-cover object-center"                      
                       src={
                         color === "white" ? product.images.white : 
                         color === "black" ? product.images.black : 
                         product.images.grey 
                       } 
                       alt="" />
                     </section>
                   <section 
                     className="flex flex-col gap-[.1em] flex-1 min-w-0">
                      <h2 
                        className="text-[clamp(18px,1.5vw,25px)] whitespace-nowrap">
                          {product.label}
                      </h2>
                      <b 
                       className={`
                          flex flex-row 
                        ${page 
                        ? "text-[clamp(18px,1.5vw,20px)]" : 
                        "text-[.9em]"}`}>
                          <span 
                           className="hidden md:block">
                            Price:
                          </span> 
                          {product.price}£
                        </b>
                       <ul 
                        className="flex md:flex-col gap-1">
                        <li 
                         className={`
                          flex flex-row 
                          ${page 
                          ? "text-[clamp(18px,1.5vw,20px)]" 
                          : "text-[.9em]"}
                          
                          `
                          
                        }
                        >
                          <span 
                           className="hidden md:block">
                            Color:
                          </span> 
                          {color === "white" 
                            ? "White" 
                            : color === "black" 
                            ? "Black" : "Grey" 
                          }
                          <span 
                           className="md:hidden">
                            ,
                          </span>
                        </li>
                        <li 
                         className={`
                          flex flex-row 
                          ${page 
                          ? "text-[clamp(18px,1.5vw,20px)]" 
                          : "text-[.9em]"
                          }`}
                        >
                          <span 
                           className="hidden md:block">
                            Size:
                          </span> 
                          {size?.size}
                        </li>
                        <li 
                         className={
                          page 
                          ? "text-[clamp(18px,1.5vw,20px)]" 
                          : "text-[.9em]"
                          }>
                          <span 
                           className="hidden md:block">
                            Amount: {qty}
                           </span>
                          </li>
                       </ul>
                       <section 
                        className="flex gap-2">
                            <button 
                             onClick={() => dispatch(
                              {
                                type: "DECREASE", 
                                productId: product.id
                              }
                            )
                            }>
                              <FontAwesomeIcon 
                                className="text-[clamp(18px,1.5vw,30px)]" 
                                icon={faMinus}
                              />
                            </button>
                               <span 
                                className="text-[clamp(18px,1.5vw,30px)]">
                                 {qty}
                              </span>
                           <button
                            onClick={() => dispatch(
                              {
                                type: "INCREASE", 
                                productId: product.id
                                }
                              )}>
                              <FontAwesomeIcon 
                                className="text-[clamp(18px,1.5vw,30px)]" 
                                icon={faPlus}/>
                            </button>
                           <button onClick={() => dispatch(
                              { 
                               type: "REMOVE_ITEM", 
                               id: id 
                              }
                             )}>
                              <FontAwesomeIcon 
                                className="text-[clamp(18px,1.5vw,30px)]" 
                                icon={faTrash}
                              />
                          </button>    
                       </section>
                   </section>
               </section>                
            ))
    )
}