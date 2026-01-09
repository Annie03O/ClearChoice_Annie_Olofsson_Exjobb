import { useSearchParams } from "react-router-dom";
import { ProfileWrapper } from "../../../components/ul/ProfileWrapper";
import { useEffect, useState } from "react";
import type { OrderResponse } from "../../../models/Types/Order/OrderResponse";
import { apiGet } from "../../../lib/apiBase";
import { Receipt } from "./Receipt";

export const OrderDetails = () => {
  const [sp] = useSearchParams();
  const orderNumber = sp.get("orderNumber");

  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await apiGet<OrderResponse[]>("/orders/me");

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

  // ✅ inget hook här – bara vanlig logik
  const order = orders.find((o) => o.orderNumber === orderNumber);

  const fullName = order?.address
    ? `${order.address.firstName ?? ""} ${order.address.lastName ?? ""}`.trim()
    : "";

  // ✅ early returns EFTER att alla hooks redan körts
  if (loading) return <section className="p-4">Loading…</section>;
  if (error) return <section className="p-4">{error}</section>;
  if (!orderNumber) return <section className="p-4">Missing orderNumber in URL.</section>;
  if (!order) return <section className="p-4">Couldn’t find that order.</section>;

  return (
    <ProfileWrapper title="Order Details" details canEdit={false}>
      <Receipt order={order} orderNumber={orderNumber} fullName={fullName}/>
    </ProfileWrapper>
  );
};
