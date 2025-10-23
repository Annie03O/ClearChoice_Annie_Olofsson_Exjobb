import {  Link, useSearchParams } from "react-router-dom"
import { products } from "../../models/objects/products";
import { useMemo } from "react";
import { ProductCard } from "../ProductCard";
import type { Product } from "../../models/Types/Search/Product";
import "../../styles/Search/SearchResults.css" 


 type ProductPresentationProps = {
     oneProduct: Product;
     addToCart: (p: Product) => void;
 }

export const SearchResults = ({oneProduct, addToCart}: ProductPresentationProps) => {
    const [params] = useSearchParams();
    const q = (params.get("q") ?? "").trim();


    const results = useMemo(() => { 
        if (!q) return [];
        
        return products.filter(p => 
            p.label.toLowerCase().includes(q.toLowerCase()));
    }, [q])

    if (!q) {
        return <h2>Type something to search</h2>
    }

    if (results.length === 0) {
        return <h2>No results found for {q}</h2>
    }

    return (
        <section>
            <h1 className="text-2xl">Results for "{q}"</h1>
            <section className="searchResults">
                {results.map((r) => (
                    <ProductCard key={r.id} oneProduct={r} addToCart={addToCart} />
                
                ))}
            </section>
        </section>
    )
}