export type SubmitOrderResponse = {
  orderId: string;
  status: string;
  total: number;
  currency: string;
  userId: string | null;
  guestToken?: string; // finns bara om gäst
};
