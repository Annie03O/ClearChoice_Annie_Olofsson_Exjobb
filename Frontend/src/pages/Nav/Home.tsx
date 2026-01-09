import { ProductCard } from "../../components/ProductCard";
import { products } from "../../models/objects/products"
import OTHHOODIE from "../../../../Backend/src/images/Home/Oth.png"
import SKAMHOODIE from "../../../../Backend/src/images/Home/Skam.png"
export const Home = () => {
 
const onePerSeries = Array.from(
  new Map(products.map(p => [p.fandom, p])).values()
);

console.log(onePerSeries.length);



    return (
        <section className="flex flex-col items-center ">
            <h1 className="text-center text-[clamp(25px,3vw,60px)] mb-4 mt-4">Welcome to ClearChoice</h1>
            <section className="flex flex-col w-full items-center justify-center ">
                <section className="flex w-full" >
                    <section className="h-full w-full md:w-[50%] ">
                        <img src={OTHHOODIE} className="w-[120%] aspect-square object-cover" alt="" />
                    </section>
                    <section className="hidden md:block h-full w-[50%]
                     ">
                        <img src={SKAMHOODIE} className="w-full aspect-square object-cover" alt="" />
                    </section>
                </section>
            <section className="flex flex-col w-fit gap-4">
                <h2 className="text-center text-[clamp(20px,3vw,40px)] mb-2 mt-2">Most popular</h2>
                <section className="grid sm:grid-cols-2 lg:grid-cols-4 w-fit gap-4">
                    {onePerSeries.map(product => (
                        <ProductCard key={product.id} oneProduct={product} searchResult={false} home={true}/>
                    ))}
                </section>
            </section>
            </section>
        </section>
    )}   