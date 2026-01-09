import type { Product } from "../../../models/Types/Search/Product";

type ProductDescProps = {
    product: Product;
}

export const ProductDescMobile = ({product}:ProductDescProps) => {

    return ( 
            <section className="w-[90%] lg:hidden md:block h-max">                   
                     <h3 className="text-3xl">Description</h3>
                    <section className=" ">    
                      <p>{product.description}</p>
                      <h3 className="text-2xl">Washing Instructions</h3>
                        <ul className="list-disc list-inside">
                            <li>Tempature {product.washing?.temp}°C</li>
                            {product.washing?.similarColors ? <li>Wash with similar colors</li> : ""}
                            {product.washing?.canBleach ? <li>Can use bleach</li> : <li>Do not bleach</li>}
                            <li>{product.washing?.dry}</li>
                            <li>{product.washing?.iron}</li>
                            {product.washing?.dryClean ? <li>Can be dry cleaned</li> : <li>Do not dry clean</li>}                
                        </ul>
            
                    </section>
               </section>

    )
}