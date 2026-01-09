export const formatMoney = (amount: number, currency: string) => {
  // Din backend räknar i "vanliga" pengar (ex 64.99), inte cents.
  // Om du senare byter till cents, ändra här.
  const value = Number.isFinite(amount) ? amount : 0;

  try {
    return new Intl.NumberFormat("sv-SE", {
      style: "currency",
      currency: currency || "EUR",
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency || "EUR"}`;
  }
};
