export async function createOrder(body: unknown) {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message ?? "Failed to create order");
  }

  return res.json() as Promise<{ orderId: string; status: string; total: number; currency: string }>;
}
