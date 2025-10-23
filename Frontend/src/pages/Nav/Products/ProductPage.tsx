import { products } from "../../../models/objects/products";
import { useParams } from "react-router";
import "../../../styles/Products/ProductsPage.css"
import type { Product } from "../../../models/Types/Search/Product";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

type ProductPrestentationProps = {
    allProductsList: Product[];
    addToCart: (oneProduct: Product) => void;
}

export const handleAddToCart = (product: Product) => {
    console.log(product, "har lagts till i kundvagnen");
}

export const ProductPage = ({
    allProductsList,
    addToCart
}: ProductPrestentationProps) => {
    const { id } = useParams();

    if (!id) return <h2>Page not found</h2>

    const product = products.find((p) => p.id === String(id));

    if (!product) {
        return <h2>Product not found</h2>
    }

    return <>
        <section className="product-card">
            <section className="product-info">
                <img src={product.black} alt={product.description} />
                <h3>Description</h3>
                <p>{product.description}</p>
                <h3>Washing Instructions</h3>
                    <ul className="washing-instructions">
                        <li>Tempature {product.washing.temp}°C</li>
                        {product.washing.similarColors ? <li>Wash with similar colors</li> : ""}
                        {product.washing.canBleach ? <li>Can use bleach</li> : <li>Do not bleach</li>}
                        <li>{product.washing.dry}</li>
                        <li>{product.washing.iron}</li>
                        {product.washing.dryClean ? <li>Can be dry cleaned</li> : <li>Do not dry clean</li>}                
                    </ul>
            </section>
            <section className="payment">
                <h1>{product.label}</h1>
                <p className="colors-p">Colors</p>
                <section className="color-picker">    
                    <span className="bg-white w-[50px] h-[50px]"></span>
                    <span className="bg-black w-[50px] h-[50px]"></span>
                    <span className="bg-[#9f9f9f] w-[50px] h-[50px]"></span>
                </section>
                <p>Price: {product.price} £</p>
                <section className="buttons">
                    <button onClick={() => addToCart(allProductsList[0])}>Add to cart</button>
                    <FontAwesomeIcon className="save-icon" icon={faHeart}/>
                </section>
            </section>
        </section>
    </>
}