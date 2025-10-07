"use client";
import Navbar from '@/app/components/Nav';
import Sidebar from '@/app/components/Sidebar';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

export default function Productmanagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/product');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
   
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('ต้องการลบสินค้านี้ใช่หรือไม่?')) return;
    try {
      const res = await fetch(`/api/admin/product/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
      }
    } catch (err) {}
  };


  const handleToggleVisible = async (id, currentVisible) => {
  try {
    const res = await fetch(`/api/admin/product/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visible: currentVisible ? 0 : 1 }),
    });
    if (res.ok) {
      setProducts(products =>
        products.map(p =>
          p.id === id ? { ...p, visible: currentVisible ? 0 : 1 } : p
        )
      );
    }
  } catch (err) {}
};

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden" onClick={() => setSidebarOpen(false)}></div>
        )}
        {/* Main content */}
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6 mt-4">
            {/* Hamburger for mobile */}
            <button className="md:hidden mb-4 px-3 py-2 bg-gray-200 rounded-lg" onClick={() => setSidebarOpen(true)}>
              <span className="block w-6 h-0.5 bg-gray-700 mb-1"></span>
              <span className="block w-6 h-0.5 bg-gray-700 mb-1"></span>
              <span className="block w-6 h-0.5 bg-gray-700"></span>
            </button>
            <div className="flex justify-between items-center mb-4">
              <h1 className='text-2xl font-semibold text-gray-800'>จัดการรายการสินค้า</h1>
              <Link href="/admin/product/add" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">เพิ่มสินค้า</Link>
            </div>
            <table className='min-w-full'>
              <thead>
                <tr className='bg-gray-200 text-gray-700'>
                  <th className='py-2 px-4 text-left'>#</th>
                     <th className='py-2 px-4 text-left'>รูปสินค้า</th>
                  <th className='py-2 px-4 text-left'>ชื่อสินค้า</th>
                  <th className='py-2 px-4 text-left'>ราคา</th>
                  <th className='py-2 px-4 text-left'>การมองเห็น</th>
                  <th className='py-2 px-4 text-left'>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={3} className="text-center py-6 text-gray-700">กำลังโหลด...</td></tr>
                ) : products.length === 0 ? (
                  <tr><td colSpan={3} className="text-center py-6 text-gray-700">ไม่มีสินค้า</td></tr>
                ) : (
                  products.map((product, index) => (
                    <tr key={product.id} className="border-b text-gray-700">
                      <td className="py-2 px-4">{index + 1}</td>
                      <td className="py-2 px-4">
                        <img src={product.imageUrl || '/placeholder.png'} alt={product.name} className="w-16 h-16 object-cover" />
                      </td>
                      <td className="py-2 px-4">{product.pro_name || product.name}</td>
                      <td className="py-2 px-4">{product.price} บาท</td>
                      <td className="py-2 px-4">
  <button
    onClick={() => handleToggleVisible(product.id, product.visible)}
    title={product.visible ? "ซ่อนสินค้า" : "แสดงสินค้า"}
    className="focus:outline-none"
  >
    {product.visible ? (
      <EyeSlashIcon className="w-6 h-6 text-gray-400 hover:text-green-600" />
    ) : (
      <EyeIcon className="w-6 h-6 text-green-600 hover:text-gray-400" />
    )}
  </button>
</td>
                      <td className="py-2 px-4 flex gap-2">
                        <Link href={`/admin/product/edit/${product.id}`} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">แก้ไข</Link>
                        <button onClick={() => handleDelete(product.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">ลบ</button>
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