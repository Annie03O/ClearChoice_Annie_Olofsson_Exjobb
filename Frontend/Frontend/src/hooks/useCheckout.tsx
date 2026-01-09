import { useContext } from "react";
import { CheckoutContext } from "../components/Checkout/CheckoutProvider";

export const useCheckout = () => {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used within CheckoutProvider");
  return ctx;
};
