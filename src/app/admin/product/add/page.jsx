"use client";
import React, { useState } from "react";
import Navbar from '@/app/components/Nav';
import Sidebar from '@/app/components/Sidebar';
import { useRouter } from "next/navigation";

export default function AddProduct() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState({
    pro_name: "",
    price: "",
    description: "",
    stock: "",
    categoryId: "",
    imageUrl: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        router.push("/admin/product");
      } else {
        const data = await res.json();
        setError(data.error || "เกิดข้อผิดพลาด");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 p-6">
          <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6 mt-4">
            <h1 className="text-2xl font-semibold mb-4 text-gray-800">เพิ่มสินค้าใหม่</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded">{error}</div>}
              <div>
                <label className="block mb-1 text-gray-700">ชื่อสินค้า</label>
                <input type="text" name="pro_name" value={form.pro_name} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1 text-gray-700">ราคา</label>
                <input type="number" name="price" value={form.price} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1 text-gray-700">รายละเอียด</label>
                <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1 text-gray-700">สต็อก</label>
                <input type="number" name="stock" value={form.stock} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1 text-gray-700">หมวดหมู่</label>
                <input type="text" name="categoryId" value={form.categoryId} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="block mb-1 text-gray-700">รูปภาพ (URL)</label>
                <input type="text" name="imageUrl" value={form.imageUrl} onChange={handleChange} className="w-full border rounded px-3 py-2" />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                {loading ? "กำลังบันทึก..." : "บันทึกสินค้า"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
