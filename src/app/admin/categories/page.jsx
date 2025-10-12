"use client";
import Navbar from '@/app/components/Nav';
import Sidebar from '@/app/components/Sidebar';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CategoryManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/admin/categories');
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('ต้องการลบหมวดหมู่นี้ใช่หรือไม่?')) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCategories(categories.filter(c => c.id !== id));
      }
    } catch (err) {}
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden" onClick={() => setSidebarOpen(false)}></div>
        )}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6 mt-4">
            <button className="md:hidden mb-4 px-3 py-2 bg-gray-200 rounded-lg" onClick={() => setSidebarOpen(true)}>
              <span className="block w-6 h-0.5 bg-gray-700 mb-1"></span>
              <span className="block w-6 h-0.5 bg-gray-700 mb-1"></span>
              <span className="block w-6 h-0.5 bg-gray-700"></span>
            </button>
            <div className="flex justify-between items-center mb-4">
              <h1 className='text-2xl font-semibold text-gray-800'>จัดการรายการหมวดหมู่</h1>
              <Link href="/admin/categories/add" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">เพิ่มหมวดหมู่</Link>
            </div>
            <table className='min-w-full'>
              <thead>
                <tr className='bg-gray-200 text-gray-700'>
                  <th className='py-2 px-4 text-left'>#</th>
                  <th className='py-2 px-4 text-left'>รูปหมวดหมู่</th>
                  <th className='py-2 px-4 text-left'>ชื่อหมวดหมู่</th>
                  <th className='py-2 px-4 text-left'>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="text-center py-6 text-gray-700">กำลังโหลด...</td></tr>
                ) : categories.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-6 text-gray-700">ไม่มีหมวดหมู่</td></tr>
                ) : (
                  categories.map((category, index) => (
                    <tr key={category.id || index} className="border-b text-gray-700">
                      <td className="py-2 px-4">{index + 1}</td>
                      <td className="py-2 px-4">
                        <img
                          src={category.cate_img && category.cate_img.startsWith('/') ? category.cate_img : '/placeholder.png'}
                          alt={category.cate_name}
                          className="w-16 h-16 object-cover rounded"
                          onError={e => { e.target.src = "/placeholder.png"; }}
                        />
                      </td>
                      <td className="py-2 px-4">{category.cate_name}</td>
                      <td className="py-2 px-4 flex gap-2">
                        <Link href={`/admin/categories/edit/${category.id}`} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">แก้ไข</Link>
                        <button onClick={() => handleDelete(category.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">ลบ</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}