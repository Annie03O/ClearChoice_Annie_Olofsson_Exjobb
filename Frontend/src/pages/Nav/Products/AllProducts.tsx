import type { Product } from "../../../models/Types/Search/Product";
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
        <main className="flex justify-center items-center">
            <section className="w-fit grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4 gap-4 pl-2 pr-2">
            {allProductsList.filter(Boolean).map((p) => (
             <ProductCard key={p.id} oneProduct={p}  searchResult={false}/>
            ))}
            </section>
        </main>
    )
}