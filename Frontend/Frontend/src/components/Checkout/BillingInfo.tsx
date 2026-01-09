import { useCheckout } from "../../hooks/useCheckout";

export const BillingInfo = () => {
  const { address } = useCheckout();
  return (
    <section className="w-full p-2 sm:p-4">
      <ul className="text-sm sm:text-base space-y-2">
        <li className="break-words">{address.firstName} {address.lastName}</li>
        <li className="break-words">{address.address}, {address.city}, {address.zip}</li>
        <li className="break-words">Email: {address.email}</li>
        {address.secondAddress ? <li className="break-words">{address.secondAddress}</li> : ""}
      </ul>
    </section>
  );
};
