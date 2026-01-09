export type CreateOrderResponse = {
  orderId: string;
  orderNumber: string;
  status: string;
  total: number;
  currency: string;
  userId: string | null;
  guestToken?: string;
};
