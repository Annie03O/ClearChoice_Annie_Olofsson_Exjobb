import {  useSearchParams } from "react-router-dom"
import { products } from "../../models/objects/products";
import { useMemo } from "react";
import { ProductCard } from "../ProductCard";
import type { Product } from "../../models/Types/Search/Product";


 type ProductPresentationProps = {
     addToCart: (p: Product) => void;
 }

export const SearchResults = ({}: ProductPresentationProps) => {
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
        <section className="flex flex-col">
            <section className="border w-[80%]">            
                <h1 className="text-2xl">Results for "{q}"</h1>
                <section className="grid grid-cols-5 max-sm:grid-cols-1 gap-[10px] ml-[1rem] mt-[.5rem]">
                    {results.map((r) => (
                        <ProductCard key={r.id} oneProduct={r} searchResult={true} />
                    
                    ))}
                </section>
            </section>
        </section>
    )
}