import type { CartAmount } from "../../models/Types/Cart/CartAmount";

type SmallCartProps = {
    cart: CartAmount[];
    increaseAmount: (id: number) => void;
    decreaseAmount: (id: number) => void;
}

export const SmallCart = ({cart, increaseAmount, decreaseAmount}: SmallCartProps) => {
    return <>
        {cart.map((ci) => (
            <section key={ci.product.id}>
                <button onClick={() => decreaseAmount}>-</button>
                <b>{ci.product.label}</b>
                <button onClick={() => increaseAmount}>+</button>
            </section>
        ))}
    </>
}