import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import type { OrderResponse } from "../../models/Types/Order/OrderResponse";
import { getOrder } from "../../functions/Order/getOrder";
import { Receipt } from "../Nav/Auth/Receipt";


export const ReceiptPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError("Missing order id");
      setLoading(false);
      return;
    }

    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getOrder(orderId); // <-- viktigt: getOrder skickar x-guest-token om det finns
        if (!alive) return;

        setOrder(data);
        console.log("Data:", data);
        
      } catch (e: unknown) {
        if (!alive) return;

        const msg =
          e instanceof Error ? e.message : "Unknown error while loading order";

        // Vanliga cases:
        // 401 = ej inloggad (ok för gäst om token saknas/är fel)
        // 403 = saknar/har fel guestToken
        // 404 = order finns inte
        setError(msg);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [orderId]);

  const fullName = useMemo(() => {
    if (!order?.address) return "";
    return `${order.address.firstName ?? ""} ${order.address.lastName ?? ""}`.trim();
  }, [order]);

  if (loading) return <section className="p-4">Loading receipt…</section>;

  if (error) {
    return (
      <section className="p-4">
        <h1 className="text-2xl">Receipt</h1>
        <p className="mt-2">Could not load order: {error}</p>

        <section className="mt-4 flex gap-3">
          <Link className="underline" to="/Checkout">
            Back to checkout
          </Link>
          <Link className="underline" to="/">
            Continue shopping
          </Link>
        </section>

        <p className="mt-4 text-sm opacity-80">
          Tips: Om du inte är inloggad måste guestToken skickas som headern{" "}
          <code>x-guest-token</code>. Det ska ske i <code>getOrder()</code>.
        </p>
      </section>
    );
  }

  if (!order) return null;

  return (
    <section className="flex justify-center items-center">
       <Receipt fullName={fullName} order={order} orderNumber={orderId!}/>
    </section>
  );
};
