import { cookies } from "next/headers";

export async function POST(req) {
  const { productId, name, price, quantity } = await req.json();
  const cookieStore = cookies();
  const cart = JSON.parse(cookieStore.get("cart")?.value || "[]");

  const existing = cart.find((item) => item.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ productId, name, price, quantity });
  }

  cookieStore.set("cart", JSON.stringify(cart));

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
