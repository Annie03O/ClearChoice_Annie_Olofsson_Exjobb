type PaymentMethod = "CARD" | "KLARNA" | "PAYPAL" | "SWISH" ;
type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export function initialPaymentStatus(method: PaymentMethod): PaymentStatus {
  switch (method) {
    case "CARD":
    case "SWISH":
    case "PAYPAL":
    case "KLARNA":
        return "PAID"
    default:
      return "PENDING";
  }
}
