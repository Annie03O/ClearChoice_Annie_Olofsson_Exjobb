export type PaymentMethod = {
    id: number;
    text: string;
    logo: string;
    category: "paypal"  | "swish" | "card" | "klarna"
}