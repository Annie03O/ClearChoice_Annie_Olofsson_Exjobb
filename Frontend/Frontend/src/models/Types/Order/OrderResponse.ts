import type { Address } from "./Address";


export type OrderResponse = {
  _id: string;
  orderNumber: string,
  userId: string;
  orderId: string;
  email: string;
  status: "PENDING" | "PAID" | "FAILED" | "CANCELLED" | "SHIPPED";
  paymentStatus: "UNPAID" | "AUTHORIZED" | "PAID" | "REFUNDED";
  paymentMethod: "CARD" | "KLARNA" | "PAYPAL" | "SWISH" ;
  shippingMethodId: string;
  currency: string; // "EUR"
  subtotal: number; // cents
  shippingFee: number; // cents
  total: number; // cents
  items: {
    productId: string;
    productNameSnapshot: string;
    unitPriceSnapshot: number; // cents
    imageUrlSnapshot: string;
    qty: number;
    color?: string;
    size?: string;
  }[];
  address: Address;
  createdAt: string;
  guestToken?: string;
};