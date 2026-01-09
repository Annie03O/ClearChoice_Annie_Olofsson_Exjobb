import { apiPost } from "../../lib/apiBase";
import type { CreateOrderBody } from "../../models/Types/Cart/CreateOrderBody";
import type { CreateOrderResponse } from "../../models/Types/Order/CreateOrderResponse";


const GUEST_TOKEN_KEY = (orderId: string) => `guestToken:${orderId}`;

export async function submitOrder(body: CreateOrderBody) {
  const res = await apiPost<CreateOrderResponse, CreateOrderBody>("/orders", body);

  if (!res.userId && res.guestToken) {
    localStorage.setItem(GUEST_TOKEN_KEY(res.orderId), res.guestToken);
  }

  return res;
}
