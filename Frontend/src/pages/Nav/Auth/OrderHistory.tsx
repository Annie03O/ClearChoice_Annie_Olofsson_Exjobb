import { ProfileWrapper } from "../../../components/ul/ProfileWrapper";
import { useEffect, useState } from "react";
import type { OrderResponse } from "../../../models/Types/Order/OrderResponse";
import { apiGet } from "../../../lib/apiBase";
import { shippingMethods } from "../../../models/objects/shippingMethods";
import { useNavigate } from "react-router";

export const OrderHistory = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate()

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await apiGet<OrderResponse[]>("/orders/me");
        console.log("orders/me data:", data);

        if (!alive) return;
        setOrders(Array.isArray(data) ? data : []);
      } catch (e: any) {
        if (alive) setError(e?.message ?? "Couldn't get orders");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const capitalize = (s?: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");

  if (loading) return <section className="p-4">Loading orders…</section>;
  if (error) return <section className="p-4">{error}</section>;
  if (orders.length === 0) return <section className="p-4">No orders registered.</section>;

  return (
    <ProfileWrapper title="Order History" details canEdit={false}>
      <section className="flex flex-col gap-4 w-[90%]">
        {orders.map((o) => {
          // om du vill använda dessa sen:
          shippingMethods.find(
            (m) => m.id === String(o.shippingMethodId)
          );

          return (
            <section key={o._id} className="border rounded-lg w-full">
              <section className="flex flex-col rounded-lg">
                <header className="grid grid-cols-3 md:grid-cols-12 rounded-t-lg bg-gray-200 p-2 h-[clamp(15px, 2vw,45px)]">
                  <section className="col-span-1 md:col-span-4  ">
                    <span className="flex max-xs:flex-col text-[clamp(15px,1.3vw,45px)] gap-2">
                      <span className="whitespace-nowrap">Order Placed:</span>
                      <span className="whitespace-nowrap">{new Date(o.createdAt).toLocaleDateString()}</span>
                    </span>
                  </section>
                  <section className="col-span-3 col-start-3 md:col-start-11 ">
                    <section className="flex flex-col justify-end w-full ">
                    <span className="relative text-[clamp(15px,1.2vw,45px)] w-full flex justify-end ">
                      <span className="flex gap-2 justify-end absolute">
                        <span>Total</span>
                        <span className="whitespace-nowrap">{o.total.toPrecision(4)} £</span>
                      </span>
                    </span>
                    </section>
                  </section>

                  
                </header>

                {(o.items ?? []).map((i, idx) => (
                  <section key={`${o._id}-${idx}`} className="p-2 grid md:grid-cols-1 grid-cols-2">
                    <span className="grid  grid-cols-6 text-[clamp(15px,1.3vw,35px)]">
                      <span className="font-semibold row-span-2 md:row-span-1 col-start-1 md:col-span-2  ">
                        Product
                      </span>
                      <span className="font-semibold col-start-1 md:col-start-3">Color</span>
                      <span className="font-semibold col-start-1 md:col-start-4">Size</span>
                      <span className="font-semibold col-start-1 md:col-start-5">Price</span>
                      <span className="font-semibold col-start-1 md:col-start-6">Amount</span>
                    </span>

                    <span className="grid grid-cols-6 grid-rows-1   text-[clamp(15px,1.3vw,30px)]  w-full justify-end">
                     <span className="col-span-4 row-span-2 md:row-span-1 md:col-span-2  md:whitespace-nowrap col-start-2 ">
                         {i.productNameSnapshot}
                        </span>
                      <span className="col-span-2 md:col-span-1 md:col-start-3 col-start-2">
                          {capitalize(i.color)}
                        </span>

                      <span className="col-span-2 md:col-span-1 col-start-2 md:col-start-4 ">
                          {i.size}
                      </span>
                      <span className="col-span-2 md:col-span-1 md:col-start-5 col-start-2">
                          {i.unitPriceSnapshot} £
                      </span>
                      <span className="col-span-2 md:col-start-6 col-start-2 ">
                          {i.qty}
                      </span>
                    </span>
                  </section>
                ))}
              </section>
              <footer >
                <section className="col-span-4 col-start-9">
                    <span className="flex flex-col text-[clamp(15px,1.3vw,30px)] text-right ">
                      <span className="flex items-center justify-center gap-2 ">
                        <button onClick={() => navigate(`/dashboard/Order_History/OrderDetails?orderNumber=${encodeURIComponent(o.orderNumber)}`)} className="p-1 whitespace-nowrap">View order details</button>
                       
                    </span>
                    </span>
                  </section>
              </footer>
            </section>
          );
        })}
      </section>
    </ProfileWrapper>
  );
};

