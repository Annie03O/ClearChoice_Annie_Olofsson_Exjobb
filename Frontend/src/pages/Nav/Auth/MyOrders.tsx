import { useEffect, useState } from "react"
import { getMyOrders } from "../../../functions/Order/getMyOrders"
import type { OrderResponse } from "../../../models/Types/Order/OrderResponse"

export const MyOrders = () => {
    const [orders, setOrders] = useState<OrderResponse[]>()
    const [loading, setLoading] = useState(false);
    
    
    console.log("LOADED Profile.tsx >>>", import.meta.url);
+-
    useEffect(() => {
      console.log("EFFECT START");
      (async () => {
        console.log("IIFE START");
        const data = await getMyOrders();
        console.log("DATA:", data);
      })().catch(err => console.error("EFFECT ERROR:", err));
    }, []);

    

    if (loading) return <p>Loading...</p>
    
    return (
        <section>
            <h1>Order History</h1>
            {orders?.length === 0 ? (
               <p>No order to show</p>
            )
            :(
                orders?.map(o => (
                    <article>
                        <section><b>Order ID:</b>{String(o._id)}</section>
                        <section><b>Status</b> {o.status}</section>
                        <section><b>Total</b> {o.total} {o.currency}</section>
                        <section><b>Date</b> {new Date(o.createdAt).toLocaleString()}</section>
                    </article>
                ))
            
        )}
        </section>
    )
}