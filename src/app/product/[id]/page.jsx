"use client";
import { useState, use } from "react";
import { useRouter } from "next/navigation";

// mock data
const products = [
  { id: "1", name: "เครื่องวัดความดัน", price: 1200, description: "วัดความดันได้แม่นยำ" },
  { id: "2", name: "เครื่องวัดน้ำตาล", price: 850, description: "ใช้ง่าย พกพาสะดวก" },
  { id: "3", name: "ปรอทวัดไข้ดิจิตอล", price: 250, description: "แสดงผลเร็ว" },
];

export default function ProductDetail({ params }) {
  // ✅ ใช้ React.use() แทนการเข้าถึง params ตรง ๆ
  const { id } = use(params);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  const product = products.find((p) => p.id === id);

  if (!product) {
    return <p className="p-6">ไม่พบสินค้า</p>;
  }

  const addToCart = async () => {
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
      }),
    });

    router.push("/cart");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
      <p className="text-gray-600 mb-2">{product.description}</p>
      <p className="text-xl font-semibold text-blue-700 mb-4">฿{product.price}</p>

      <div className="flex items-center gap-3 mb-4">
        <label>จำนวน:</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border rounded p-2 w-20"
        />
      </div>

      <button
        onClick={addToCart}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
      >
        เพิ่มลงตะกร้า
      </button>
    </div>
  );
}
