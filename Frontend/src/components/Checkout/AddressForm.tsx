import { InfoInput } from "../ul/InfoInput";
import { useEffect, useState } from "react";
import { Button } from "../ul/Button";
import { useCheckout } from "../../hooks/useCheckout";
import type { Address } from "../../models/Types/Order/Address"; 

export type Props = {
  open: boolean;
  onClose: () => void;
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

export const AddressForm = ({ open, onClose }: Props) => {
  const [form, setForm] = useState<Address>(emptyAddress);
  const [error, setError] = useState<string | null>(null);
  const { address, setAddress } = useCheckout();

  // Sync local form from checkout address (if it exists)
  useEffect(() => {
    if (address) setForm(address);
  }, [address]);

  // ESC + body scroll
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onKey);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation (optional)
    if (!form.email || !form.address || !form.firstName || !form.lastName) {
      setError("Fyll i alla obligatoriska fält.");
      return;
    }

    // Save to checkout context
    setAddress(form);

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[600px] px-2 sm:px-4 mx-auto border">
      <section className="flex flex-col gap-2">
        <span>
          Adress lookup powered by Google, view Privacy policy. To optout change cookie preferences
        </span>
        <span>*Indicates required field</span>
        {error && <span className="text-red-600">{error}</span>}
      </section>
      <section>
        <section className="flex flex-col sm:flex-row p-2 gap-2 sm:gap-4">
          <section className="flex flex-col flex-1 min-w-0">
            <label htmlFor="firstName">First Name *</label>
            <InfoInput
              type="text"
              id="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              required
            />
          </section>

          <section className="flex flex-col flex-1 min-w-0">
            <label htmlFor="lastName">Last Name *</label>
            <InfoInput
              type="text"
              id="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              required
            />
          </section>
        </section>

        <section className="flex flex-col sm:flex-row p-2 gap-2 sm:gap-4">
          <section className="flex flex-col flex-1 min-w-0">
            <label htmlFor="email">Email *</label>
            <InfoInput
              type="email"
              id="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </section>

          <section className="flex flex-col flex-1 min-w-0">
            <label htmlFor="address">Address *</label>
            <InfoInput
              type="text"
              id="address"
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              required
            />
          </section>
        </section>

        <section className="flex flex-col sm:flex-row p-2 gap-2 sm:gap-4">
          <section className="flex flex-col flex-1 min-w-0">
            <label htmlFor="secondAddress">Second Address</label>
            <InfoInput
              type="text"
              id="secondAddress"
              placeholder="Second Address"
              value={form.secondAddress ?? ""}
              onChange={(e) => setForm({ ...form, secondAddress: e.target.value })}
            />
          </section>

          <section className="flex flex-col flex-1 min-w-0">
            <label htmlFor="zip">Zip Code *</label>
            <InfoInput
              type="text"
              id="zip"
              placeholder="Zip Code"
              value={form.zip}
              onChange={(e) => setForm({ ...form, zip: e.target.value })}
              required
            />
          </section>
        </section>
        </section>
        <section className="flex flex-col sm:flex-row p-2 gap-2 sm:gap-4">
          <section className="flex flex-col flex-1 min-w-0">
            <label htmlFor="country">Country *</label>
            <InfoInput
              type="text"
              id="country"
              placeholder="Country"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              required
            />
          </section>

          <section className="flex flex-col flex-1 min-w-0">
            <label htmlFor="city">City *</label>
            <InfoInput
              type="text"
              id="city"
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              required
            />
          </section>
      </section>

        <section className="flex justify-center sm:justify-end px-2 pt-2">
          <Button type="submit" size="medium">
            Continue 
          </Button>
        </section>
    </form>
  );
};
