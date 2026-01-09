import type { Product } from "../../../models/Types/Search/Product"

type ProductDescDesktopProps = {
    product: Product;
}

export const ProductDescDesktop = ({product}: ProductDescDesktopProps) => {
    return (
        <section className="hidden md:flex">
           <section className="p-[clamp(20px,.8vw,30px)]">
            <h3 className="text-3xl">Description</h3>
            <p className="w-full text-[clamp(20px,.8vw,30px)]">{product.description}</p>
            <h3>Washing Instructions</h3>
                <ul className="list-disc pl-4 text-[clamp(20px,1.1vw,30px)]">
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