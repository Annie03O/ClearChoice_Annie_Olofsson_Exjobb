import type { Billing } from "./Billing";
import type { PaymentMethod } from "./PaymentMethod";
import type { ShippingMethod } from "./Shipping"; 

export type OrderInfo = {
    id: string;
    shipping: ShippingMethod;
    payment: PaymentMethod;
    billing: Billing;
}