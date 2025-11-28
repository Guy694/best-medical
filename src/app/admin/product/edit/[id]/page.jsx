"use client";
import React, { useState, useEffect } from "react";
import Navbar from '@/app/components/Nav';
import Sidebar from '@/app/components/Sidebar';
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

export default function EditProduct() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    pro_name: "",
    price: "",
    description: "",
    stock: "",
    categoryId: "",
    imageUrl: "",
    delivery: "",
    warranty: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setLoading(true);
      try {
        // Fetch product data and categories in parallel
        const [productRes, categoriesRes] = await Promise.all([
          fetch(`/api/admin/product/${id}`),
          fetch('/api/admin/categories')
        ]);

        const productData = await productRes.json();
        const categoriesData = await categoriesRes.json();

        console.log("Product Data:", productData);
        console.log("Categories Data:", categoriesData);

        setForm({
          pro_name: productData.pro_name || productData.name || "",
          price: productData.price || "",
          description: productData.description || "",
          stock: productData.stock || "",
          categoryId: String(productData.categoryId || ""),
          imageUrl: productData.imageUrl || "",
          delivery: productData.delivery || "",
          warranty: productData.warranty || ""
        });

        // Set image preview to existing image
        if (productData.imageUrl) {
          setImagePreview(productData.imageUrl);
        }

        // Handle different API response formats
        let categoriesArray = [];
        if (Array.isArray(categoriesData)) {
          categoriesArray = categoriesData;
        } else if (categoriesData.categories && Array.isArray(categoriesData.categories)) {
          categoriesArray = categoriesData.categories;
        } else if (categoriesData.data && Array.isArray(categoriesData.data)) {
          categoriesArray = categoriesData.data;
        }

        setCategories(categoriesArray);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("ไม่พบข้อมูลสินค้า");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let uploadedImageUrl = form.imageUrl; // ใช้รูปเดิม

      // ถ้ามีการอัพโหลดรูปใหม่
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('folder', 'pdimage'); // ระบุโฟลเดอร์ pdimage

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          uploadedImageUrl = uploadData.imageUrl;
        } else {
          throw new Error('การอัพโหลดรูปภาพล้มเหลว');
        }
      }

      // อัพเดตข้อมูลสินค้า
      const res = await fetch(`/api/admin/product/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          imageUrl: uploadedImageUrl
        })
      });
      if (res.ok) {
        router.push("/admin/product");
      } else {
        const data = await res.json();
        setError(data.error || "เกิดข้อผิดพลาด");
      }
    } catch (err) {
      setError(err.message || "เกิดข้อผิดพลาดในการเชื่อมต่อ");
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
            <h1 className="text-2xl font-semibold mb-4 text-gray-800">แก้ไขข้อมูลสินค้า</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded">{error}</div>}
              <div>
                <label className="block mb-1 text-gray-700">ชื่อสินค้า</label>
                <input type="text" name="pro_name" value={form.pro_name} onChange={handleChange} required className="w-full border rounded px-3 py-2 text-gray-700" />
              </div>
              <div>
                <label className="block mb-1 text-gray-700">ราคา</label>
                <input type="number" name="price" value={form.price} onChange={handleChange} required className="w-full border rounded px-3 py-2  text-gray-700" />
              </div>
              <div>
                <label className="block mb-1 text-gray-700">รายละเอียด</label>
                <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2 text-gray-700" />
              </div>
              <div>
                <label className="block mb-1 text-gray-700">สต็อก</label>
                <input type="number" name="stock" value={form.stock} onChange={handleChange} required className="w-full border rounded px-3 py-2 text-gray-700" />
              </div>
              <div>
                <label className="block mb-1 text-gray-700">ค่าจัดส่ง (บาท)</label>
                <input type="number" name="delivery" value={form.delivery} onChange={handleChange} step="0.01" className="w-full border rounded px-3 py-2 text-gray-700" placeholder="0.00" />
              </div>
              <div>
                <label className="block mb-1 text-gray-700">ประกัน (เดือน)</label>
                <input type="number" name="warranty" value={form.warranty} onChange={handleChange} className="w-full border rounded px-3 py-2 text-gray-700" placeholder="0" />
              </div>
              <div>
                <label className="block mb-1 text-gray-700">หมวดหมู่</label>
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 text-gray-700"
                >
                  <option value="">เลือกหมวดหมู่</option>
                  {categories.length > 0 ? (
                    categories.map((category, index) => (
                      <option
                        key={category.id || index}
                        value={category.id}
                      >
                        {category.cate_name || category.name || `หมวดหมู่ ${category.id}`}
                      </option>
                    ))
                  ) : (
                    <option disabled>กำลังโหลดหมวดหมู่...</option>
                  )}
                </select>
                {categories.length === 0 && !loading && (
                  <p className="text-sm text-red-500 mt-1">ไม่พบหมวดหมู่</p>
                )}
                {categories.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">พบ {categories.length} หมวดหมู่</p>
                )}
              </div>
              <div>
                <label className="block mb-1 text-gray-700">รูปภาพสินค้า</label>

                {/* แสดงรูปภาพปัจจุบัน */}
                {imagePreview && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-2">รูปภาพปัจจุบัน:</p>
                    <div className="relative w-48 h-48 border rounded-lg overflow-hidden">
                      <Image
                        src={imagePreview}
                        alt="Product preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Input สำหรับอัพโหลดรูปใหม่ */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border rounded px-3 py-2 text-gray-700"
                />
                <p className="text-xs text-gray-500 mt-1">
                  ไม่ต้องเลือกไฟล์หากต้องการใช้รูปเดิม
                </p>
              </div>
              <div>
                <label className="block mb-1 text-gray-700">รูปภาพ (URL) - ทางเลือก</label>
                <input type="text" name="imageUrl" value={form.imageUrl} onChange={handleChange} className="w-full border rounded px-3 py-2 text-gray-700" placeholder="หรือใส่ URL รูปภาพ" />
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
