import { apiGet } from "../../lib/apiBase";
import type { OrderResponse } from "../../models/Types/Order/OrderResponse"

export const getMyOrders = async () => {
  return await apiGet<OrderResponse[]>("/orders/me");
};
