import { Billing } from "./Billing";
import { PaymentMethod } from "./PaymentMethod";
import { ShippingMethod } from "./Shipping"; 

export type OrderInfo = {
    id: string;
    shipping: ShippingMethod;
    payment: PaymentMethod;
    billing: Billing;
}