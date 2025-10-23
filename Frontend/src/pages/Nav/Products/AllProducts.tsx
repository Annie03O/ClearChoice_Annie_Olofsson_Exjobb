import type { Product } from "../../../models/Types/Search/Product";
import "../../../styles/Products/AllProducts.css"
import { ProductCard } from "../../../components/ProductCard";

type ProductPresentationProps = {
    allProductsList: Product[];
    addToCart: (oneProduct: Product) => void;
}

export const handleAddToCart = (product: Product) => {
    console.log(product, "har lagts till i kundvagnen");
}

export const AllProducts = ({
    allProductsList,
    addToCart
}: ProductPresentationProps) => {

    return (
        <main className="allProducts">
            {allProductsList.map((p) => (
            //    <section className={p.class}>
            //     <article className="product-container">
            //         <h2>{p.label}</h2>
            //         <section className="visuals">
            //             <img src={
            //                 p.black ? p.black: 
            //                 p.white ? p.white:
            //                 p.grey ? p.grey: 
            //                 ""
            //                 } alt={p.description} />
            //         </section>
            //         <section className="actions">
            //             <p>Price: {p.price}£</p>
            //                 <section className="buttons">
            //                     <Link to={"/Products/" + p.id} key={p.id}>
            //                         <button className="showProduct">View Product</button>
            //                     </Link>
                                
            //                     <button className="addToCart" onClick={() => addToCart(p)}>Add to cart</button>
            //                 </section>
            <ProductCard key={p.id} oneProduct={p} addToCart={addToCart} />
              //      </section>
              //  </article>
              //</section>
            ))}
        </main>
    )
}