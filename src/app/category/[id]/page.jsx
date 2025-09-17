"use client";
import Navbar from '@/app/components/Nav';
import React from 'react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Breadcrumb from '@/app/components/Breadcrumb';
import Link from 'next/link';

export default function CategoryPage() {  
  const params = useParams();
  const id = params.id;
  const [categoriesproduct, setCategoriesproduct] = useState([]);
  const [error, setError] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
 

  useEffect(() => {

      async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }finally {
        setLoading(false);
      }
    }

    async function fetchCategoriesproduct() {
  try {
    const res = await fetch(`/api/categories/${id}`);
    const data = await res.json();
    console.log("id:", id);
    console.log("data:", data);
    if (Array.isArray(data)) {
      setCategoriesproduct(data);
    } else {
      setCategoriesproduct([]);
      setError(data.error || "ไม่พบหมวดหมู่");
    }
  } catch (error) {
    setCategoriesproduct ([]);
    setError(error.message);
    console.error("Error fetching categories:", error);
  }
}
   
    fetchCategories();
    fetchCategoriesproduct();
    
  }, [id]);

    
  return (
    <div >
      <Navbar />
        <div className="min-h-screen bg-gray-100">
       
       {/* <Breadcrumb
  items={[
    { label: "หน้าหลัก", href: "/" },
    {
      label: category?.cate_name || "อื่นๆ",
      href: `/${category?.cate_name ? encodeURIComponent(category.cate_name) : "scale"}`
    }
  ]}
/> */}
 <div className="flex items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-700 mr-4">สินค้า</h1>
          {/* Hamburger button for mobile */}
          <button
            className="md:hidden bg-white rounded-3xl shadow p-3 border border-gray-300"
            onClick={() => setShowMenu((v) => !v)}
            aria-label="เปิดเมนูหมวดหมู่"
          >
            <span className="block w-6 h-0.5 bg-gray-700 mb-1"></span>
            <span className="block w-6 h-0.5 bg-gray-700 mb-1"></span>
            <span className="block w-6 h-0.5 bg-gray-700"></span>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Sidebar: hidden on mobile, slide-in when showMenu */}
        <aside
          className={`col-span-2 md:block ${showMenu ? 'block fixed top-0 left-0 w-64 h-full bg-white z-40 shadow-lg p-6 overflow-y-auto' : 'hidden'} md:static md:w-auto md:h-auto md:bg-transparent md:shadow-none md:p-0`}
        >
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">หมวดหมู่สินค้า</h2>
            <ul>
              {categories.map((category) => (
                <li key={category.id} className="mb-2">
                  <Link href={`/category/${category.id}`} className="text-blue-600 hover:underline">
        {category.cate_name}
      </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">ตะกร้าสินค้า</h2>
            {cart.length === 0 ? (
              <p className="text-gray-500">ตะกร้าสินค้าว่างเปล่า</p>
            ) : (
              <ul>
                {cart.map((item, index) => (
                  <li key={index} className="mb-2 flex justify-between">
                    <span>{item.name}</span>
                    <span>{item.price} บาท</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Close button for mobile sidebar */}
          <button
            className="md:hidden mt-6 w-full bg-gray-200 shadow text-gray-700 py-2 rounded"
            onClick={() => setShowMenu(false)}
          >ปิดเมนู</button>
        </aside>
                  
                  <main className="col-span-10 bg-white rounded-xl shadow p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                      {loading ? (
                        <div className="col-span-full text-gray-500 text-center py-12">กำลังโหลด...</div>
                      ) : (
                        categoriesproduct.length === 0 ? (
                          <div className="col-span-full text-gray-500 text-center py-12">ไม่พบสินค้า</div>
                        ) : ( 
                          categoriesproduct.map((product) => (
                            <div key={product.id} className="bg-gray-50 rounded-xl shadow p-4 flex flex-col hover:shadow-lg transition">
                              <Link href={`/product/${product.id}`}>
                                <img
                                  src={product.imageUrl || "/image.png"}
                                  alt={product.name}
                                  className="w-full aspect-[4/3] h-auto object-cover rounded-xl mb-4"
                                />
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">{product.pro_name}</h3>
                                {/* <p className="text-gray-600 mb-2">{product.description}</p> */}
                                <div className="text-red-600 font-bold text-xl">{product.price} บาท</div>
                              </Link>
                            </div>
                          ))
                        )
                      )}
                    </div>
                    <div className="flex justify-end items-right mt-6 text-gray-700">จำนวนรายการ {categoriesproduct.length} รายการ</div>
                  </main>
                </div>
    </div>
      
    </div>
   
  )
}
