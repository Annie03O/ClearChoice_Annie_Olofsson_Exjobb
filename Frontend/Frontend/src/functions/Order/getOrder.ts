import { api } from "../../lib/apiBase";
import type { OrderResponse } from "../../models/Types/Order/OrderResponse";

const GUEST_TOKEN_KEY = (orderId: string) => `guestToken:${orderId}`;

export async function getOrder(orderId: string): Promise<OrderResponse> {
  const guestToken = localStorage.getItem(GUEST_TOKEN_KEY(orderId));

  // Om du är inloggad behövs inget extra
  // Om du är gäst: skicka x-guest-token
  const res = await api.get<OrderResponse>(`/orders/${orderId}`, {
    headers: guestToken ? { "x-guest-token": guestToken } : undefined,
  });

  return res.data;
}
