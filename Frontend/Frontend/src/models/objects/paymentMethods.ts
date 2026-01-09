import type { PaymentMethod } from "../Types/Cart/PaymentMethod";



export const paymentMethods: PaymentMethod[] = [
    {
        id: 1,
        text: "Pay securely using your PayPal account without sharing your card details.",
        logo: `${import.meta.env.BASE_URL}logos/paypal.png`,
        category: "paypal",
    },
    {
        id: 2,
        text: "Pay instantly and securely using Swish on your mobile device.",
        logo: `${import.meta.env.BASE_URL}logos/Swish_(payment)-Logo.wine.png`,

        category: "swish",
    },
    {
        id: 3,
        text: "Pay safely with your debit or credit card using encrypted payment processing.",
        logo: `${import.meta.env.BASE_URL}logos/creditcard.svg`,     
        category: "card",
    },
    {
        id: 4,
        text: "Choose to pay now, later, or in installments with Klarna.",
        logo: `${import.meta.env.BASE_URL}logos/Klarna-Logo-2017.png`,
        category: "klarna",
    }
]