import React, { createContext,  useMemo, useState } from "react";
import type { Address } from "../../models/Types/Order/Address";


type CheckoutContextValue = {
  address: Address;
  setAddress: (next: Address) => void;
  clearCheckout: () => void;
};

const emptyAddress: Address = {
  firstName: "",
  lastName: "",
  email: "",
  address: "",
  secondAddress: "",
  zip: "",
  country: "",
  city: "",
};

export const CheckoutContext = createContext<CheckoutContextValue | null>(null);

export const CheckoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddressState] = useState<Address>(() => {
    const raw = sessionStorage.getItem("checkout_address");
    return raw ? (JSON.parse(raw) as Address) : emptyAddress;
  });

  const setAddress = (next: Address) => {
    setAddressState(next);
    sessionStorage.setItem("checkout_address", JSON.stringify(next));
  };

  const clearCheckout = () => {
    setAddressState(emptyAddress);
    sessionStorage.removeItem("checkout_address");
  };

  const value = useMemo(() => ({ address, setAddress, clearCheckout }), [address]);

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
};
