import { cookies } from "next/headers";

export default function CartPage() {
  const cookieStore = cookies();
  const cart = JSON.parse(cookieStore.get("cart")?.value || "[]");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">ตะกร้าสินค้า</h1>
      {cart.length === 0 ? (
        <p>ยังไม่มีสินค้าในตะกร้า</p>
      ) : (
        <div>
          <ul className="space-y-2 mb-4">
            {cart.map((item, i) => (
              <li key={i} className="p-3 border rounded flex justify-between">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>฿{item.price * item.quantity}</span>
              </li>
            ))}
          </ul>
          <p className="text-xl font-semibold">รวมทั้งหมด: ฿{total}</p>
        </div>
      )}
    </div>
  );
}
