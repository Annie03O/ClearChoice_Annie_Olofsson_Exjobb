type CheckoutHeaderProps = {
    totalQty: number; 
    orderPrice: number;
}

export const CheckoutHeader = ({totalQty, orderPrice}: CheckoutHeaderProps) => {
    
    return ( <header className="flex flex-col sm:flex-row items-start sm:items-center border-b gap-2 sm:gap-0">
        <h1 className="text-2xl sm:text-4xl sm:w-2/3">Checkout</h1>
        <span className="text-sm sm:text-base whitespace-nowrap">Order subtotal ({totalQty} { totalQty > 1 ? "items" : "item"}): {(orderPrice).toFixed(2)}£</span>
    </header>
    )
              
}