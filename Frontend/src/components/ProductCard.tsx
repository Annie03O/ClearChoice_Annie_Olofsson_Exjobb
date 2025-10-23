import { Link } from "react-router-dom"
import type { Product } from "../models/Types/Search/Product";


type ProductPresentationProps = {
    oneProduct: Product;
    addToCart: (p: Product) => void;
}

export const ProductCard = ({oneProduct, addToCart}: ProductPresentationProps) => {
    return (
        <section className={oneProduct.class}>
                <article className="product-container">
                    <h2>{oneProduct.label}</h2>
                    <section className="visuals">
                        <img src={ oneProduct.black || oneProduct.white || oneProduct.grey ||  ""} 
                            alt={oneProduct.description} />
                    </section>
                    <section className="actions">
                        <p>Price: {oneProduct.price}£</p>
                            <section className="buttons">
                                <Link to={"/Products/" + oneProduct.id} key={oneProduct.id}>
                                    <button type="submit" className="showProduct">View Product</button>
                                </Link>
                                
                                <button type="submit" className="addToCart" onClick={() => addToCart(oneProduct)}>Add to cart</button>
                            </section>
                    </section>
                </article>
              </section>
    )
}