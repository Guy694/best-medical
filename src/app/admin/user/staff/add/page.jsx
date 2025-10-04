"use client";
import React, { useState } from "react";
import Navbar from '@/app/components/Nav';
import Sidebar from '@/app/components/Sidebar';
import { useRouter } from "next/navigation";

export default function AddStaff() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "STAFF"
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
      const res = await fetch("/api/admin/user/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        router.push("/admin/user/staff");
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
            <h1 className="text-2xl font-semibold mb-4 text-gray-800">เพิ่มเจ้าหน้าที่</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded">{error}</div>}
              <div>
                <label className="block mb-1 text-gray-700">ชื่อ-สกุล</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full border rounded px-3 py-2 text-gray-700" />
              </div>
              <div>
                <label className="block mb-1 text-gray-700">อีเมล</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full border rounded px-3 py-2 text-gray-700" />
              </div>
              <div>
                <label className="block mb-1 text-gray-700">รหัสผ่าน</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} required className="w-full border rounded px-3 py-2 text-gray-700" />
              </div>
              <div>
                <label className="block mb-1 text-gray-700">เบอร์โทร</label>
                <input type="text" name="phone" value={form.phone} onChange={handleChange} required className="w-full border rounded px-3 py-2 text-gray-700" />
              </div>
              <div>
                <label className="block mb-1 text-gray-700">ที่อยู่</label>
                <textarea name="address" value={form.address} onChange={handleChange} className="w-full border rounded px-3 py-2 text-gray-700" />
              </div>
              <div>
                <label className="block mb-1 text-gray-700">สิทธิ์</label>
                <select name="role" value={form.role} onChange={handleChange} className="w-full border rounded px-3 py-2 text-gray-700 ">
                  <option value="STAFF">STAFF</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                {loading ? "กำลังบันทึก..." : "บันทึกเจ้าหน้าที่"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
