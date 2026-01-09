export type CreateOrderBody = {
  email: string;
  items: {
    productId: string;
    qty: number;
    color?: string;
    size?: string;
  }[];
  shippingFee: number; // cents
  paymentMethod: "CARD" | "KLARNA" | "PAYPAL" | "SWISH";
  address: {
    firstName: string;
    lastName: string;
    address: string;
    secondAddress?: string;
    zip: string;
    city: string;
    country: string; // t.ex. "SE"
  };
  shippingMethodId?: string;
};
