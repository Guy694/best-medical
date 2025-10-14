"use client";
import Navbar from '@/app/components/Nav';
import React from 'react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Package, ShoppingCart, Menu, X, Grid, List, Search, Filter, Tag } from "lucide-react";
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
  const [currentCategory, setCurrentCategory] = useState(null);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
 

  useEffect(() => {

      async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
        // Find current category
        const current = data.find(cat => cat.id === parseInt(id));
        setCurrentCategory(current);
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

  // Filter products based on search term
  const filteredProducts = categoriesproduct.filter(product =>
    product.pro_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

    
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "หน้าหลัก", href: "/" },
            { label: "สินค้าทั้งหมด", href: "/product" },
            { label: currentCategory?.cate_name || "หมวดหมู่" }
          ]}
        />

        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Package className="w-10 h-10" />
                <h1 className="text-4xl font-bold">{currentCategory?.cate_name || "สินค้าในหมวดหมู่"}</h1>
              </div>
              <p className="text-blue-100">สินค้าคุณภาพในหมวดหมู่นี้</p>
            </div>
            <button
              className="md:hidden bg-white/20 backdrop-blur-sm rounded-xl p-3 hover:bg-white/30 transition"
              onClick={() => setShowMenu(!showMenu)}
              aria-label="เปิดเมนูหมวดหมู่"
            >
              {showMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ค้นหาสินค้าในหมวดหมู่นี้..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-700"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 rounded-xl transition ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 rounded-xl transition ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside
            className={`lg:col-span-3 ${
              showMenu
                ? "fixed inset-0 bg-black/50 z-50 md:relative md:bg-transparent"
                : "hidden lg:block"
            }`}
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowMenu(false);
            }}
          >
            <div
              className={`${
                showMenu
                  ? "fixed left-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto"
                  : ""
              } lg:sticky lg:top-6`}
            >
              {/* Categories Card */}
              <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                      <Filter className="w-5 h-5" />
                      <h2 className="text-xl font-semibold">หมวดหมู่สินค้า</h2>
                    </div>
                    {showMenu && (
                      <button
                        onClick={() => setShowMenu(false)}
                        className="lg:hidden text-white hover:bg-white/20 rounded-lg p-1"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-5">
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="/product"
                        className="flex items-center gap-2 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition"
                      >
                        <Tag className="w-4 h-4" />
                        สินค้าทั้งหมด
                      </Link>
                    </li>
                    {categories.map((category) => (
                      <li key={category.id}>
                        <Link
                          href={`/category/${category.id}`}
                          className={`flex items-center gap-2 px-4 py-3 rounded-xl transition ${
                            category.id === parseInt(id)
                              ? "bg-blue-50 text-blue-700 font-medium"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <Tag className="w-4 h-4" />
                          {category.cate_name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Cart Card */}
              <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-green-700 p-5">
                  <div className="flex items-center gap-2 text-white">
                    <ShoppingCart className="w-5 h-5" />
                    <h2 className="text-xl font-semibold">ตะกร้าสินค้า</h2>
                  </div>
                </div>
                <div className="p-5">
                  {cart.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">ตะกร้าสินค้าว่างเปล่า</p>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {cart.map((item, index) => (
                        <li key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-700">{item.name}</span>
                          <span className="text-green-600 font-semibold">{item.price} บาท</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9">
            <div className="bg-white rounded-2xl shadow-md p-6">
              {loading ? (
                <div className="text-center py-20">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500 text-lg">กำลังโหลดสินค้า...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    {searchTerm ? "ไม่พบสินค้าที่ค้นหา" : "ไม่มีสินค้าในหมวดหมู่นี้"}
                  </p>
                </div>
              ) : (
                <>
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        : "space-y-4"
                    }
                  >
                    {filteredProducts.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        className={
                          viewMode === "grid"
                            ? "group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            : "group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex gap-4 p-4"
                        }
                      >
                        <div className={viewMode === "grid" ? "" : "w-32 h-32 flex-shrink-0"}>
                          <img
                            src={product.imageUrl || "/image.png"}
                            alt={product.pro_name}
                            className={
                              viewMode === "grid"
                                ? "w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                                : "w-full h-full object-cover rounded-xl"
                            }
                          />
                        </div>
                        <div className={viewMode === "grid" ? "p-4" : "flex-1 flex flex-col justify-center"}>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition line-clamp-2">
                            {product.pro_name}
                          </h3>
                          <div className="flex items-center justify-between mt-auto">
                            <span className="text-2xl font-bold text-blue-600">
                              ฿{Number(product.price).toLocaleString()}
                            </span>
                            <div className="bg-blue-600 text-white px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                              ดูรายละเอียด
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Product Count */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between text-gray-600">
                      <span className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        แสดงผลลัพธ์: {filteredProducts.length} รายการ
                      </span>
                      {searchTerm && (
                        <span className="text-sm">
                          ค้นหา: <span className="font-semibold text-blue-600">"{searchTerm}"</span>
                        </span>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
