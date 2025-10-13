  "use client";
  import React, { useState, useEffect } from "react";
  import Navbar from '@/app/components/Nav';
  import Sidebar from '@/app/components/Sidebar';
  import { useRouter,useParams } from "next/navigation";
  
  export default function EditProduct() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [form, setForm] = useState({
    cate_name: "",
    cate_img: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const params = useParams();
    const id = params.id;
    const [file, setFile] = useState(null);
  
    useEffect(() => {
      async function fetchCategory() {
        if (!id) return;
        setLoading(true);
        try {
          const res = await fetch(`/api/admin/categories/${id}`);
          const data = await res.json();
          setForm({
            cate_name: data.cate_name || "",
            cate_img: data.cate_img || ""
          });
        } catch (err) {
          setError("ไม่พบข้อมูลหมวดหมู่");
        } finally {
          setLoading(false);
        }
      }
      fetchCategory();
    }, [id]);
  
 const handleChange = (e) => {
  if (e.target.name === "cate_img") {
    setFile(e.target.files[0]);
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
    formData.append("cate_name", form.cate_name);
    if (file) {
      formData.append("cate_img", file);
    } else {
      // ถ้าไม่แนบไฟล์ใหม่ ให้ใช้รูปเดิม
      formData.append("cate_img", form.cate_img);
    }
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "PUT",
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
              <h1 className="text-2xl font-semibold mb-4 text-gray-800">แก้ไขข้อมูลหมวดหมู่</h1>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded">{error}</div>}
                <div>
                  <label className="block mb-1 text-gray-700">ชื่อหมวดหมู่</label>
                  <input type="text" name="cate_name" value={form.cate_name} onChange={handleChange} required className="w-full border rounded px-3 py-2 text-gray-700" />
                </div>
                <div>
                  <label className="block mb-1 text-gray-700">รูปภาพ (URL)</label>
                  <input type="file" name="cate_img" onChange={handleChange} className="w-full border rounded px-3 py-2 text-gray-700" />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                  {loading ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
  