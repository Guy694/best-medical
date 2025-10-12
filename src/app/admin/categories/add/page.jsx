"use client";
import React, { useState } from "react";
import Navbar from '@/app/components/Nav';
import Sidebar from '@/app/components/Sidebar';
import { useRouter } from "next/navigation";

export default function AddProduct() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState({
    cate_name: "",
    cate_img: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    if (e.target.name === "cate_img") {
      setImageFile(e.target.files[0]);
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (imageFile) {
        formData.append("cate_img", imageFile);
      }
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        router.push("/admin/categories");
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
            <h1 className="text-2xl font-semibold mb-4 text-gray-800">เพิ่มหมวดหมู่ใหม่</h1>
            <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
              {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded">{error}</div>}
              <div>
                <label className="block mb-1 text-gray-700">ชื่อหมวดหมู่</label>
                <input type="text" name="cate_name" value={form.cate_name} onChange={handleChange} required className="w-full border rounded px-3 py-2 text-gray-700" />
              </div>
              <div>
                <label className="block mb-1 text-gray-700">รูปภาพ (ไฟล์)</label>
                <input type="file" name="cate_img" accept="image/*" onChange={handleChange} className="w-full border rounded px-3 py-2 text-gray-700" />
              </div>
           
              <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                {loading ? "กำลังบันทึก..." : "บันทึกหมวดหมู่"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}