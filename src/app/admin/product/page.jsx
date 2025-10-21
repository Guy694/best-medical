"use client";
import Navbar from '@/app/components/Nav';
import Sidebar from '@/app/components/Sidebar';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Package, Search, Plus, Edit, Trash2, Image as ImageIcon,
  Menu, RefreshCw, AlertCircle, Eye, EyeOff, DollarSign, ShoppingBag
} from 'lucide-react';

export default function Productmanagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVisible, setFilterVisible] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/product');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('ต้องการลบสินค้านี้ใช่หรือไม่?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/product/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchProducts();
        alert('ลบสินค้าสำเร็จ');
      } else {
        alert('เกิดข้อผิดพลาดในการลบ');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('เกิดข้อผิดพลาดในการลบ');
    } finally {
      setLoading(false);
    }
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
    } catch (err) {
      console.error('Error toggling visibility:', err);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = !searchTerm || 
      p.pro_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesVisible = filterVisible === '' || 
      (filterVisible === 'visible' && p.visible === 1) ||
      (filterVisible === 'hidden' && p.visible === 0);
    
    return matchesSearch && matchesVisible;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <Navbar />
      <div className="flex">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden" 
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main content */}
        <div className="flex-1 min-w-0 p-4 md:p-6">
          {/* Hamburger for mobile */}
          <button 
            className="md:hidden mb-4 p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow" 
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>

          {/* Header Section */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl shadow-lg">
                  <ShoppingBag className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    จัดการสินค้า
                  </h1>
                  <p className="text-gray-600 text-sm">จัดการรายการสินค้าและราคา</p>
                </div>
              </div>
              <Link 
                href="/admin/product/add" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <Plus className="w-5 h-5" />
                เพิ่มสินค้า
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">สินค้าทั้งหมด</p>
                  <p className="text-3xl font-bold text-orange-600">{products.length}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl">
                  <Package className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">แสดงบนเว็บ</p>
                  <p className="text-3xl font-bold text-green-600">
                    {products.filter(p => p.visible === 1).length}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-xl">
                  <Eye className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">ซ่อนไว้</p>
                  <p className="text-3xl font-bold text-gray-600">
                    {products.filter(p => p.visible === 0).length}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl">
                  <EyeOff className="w-8 h-8 text-gray-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">แสดงผล</p>
                  <p className="text-3xl font-bold text-amber-600">{filteredProducts.length}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl">
                  <DollarSign className="w-8 h-8 text-amber-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Table Card */}
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border border-white/50 overflow-hidden">
            {/* Filter Section */}
            <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" size={20} />
                  <input
                    type="text"
                    placeholder="ค้นหาชื่อสินค้า..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  />
                </div>
                <div className="relative">
                  <Eye className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" size={20} />
                  <select
                    value={filterVisible}
                    onChange={(e) => setFilterVisible(e.target.value)}
                    className="w-full md:w-auto pl-10 pr-10 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="text-gray-800">ทั้งหมด</option>
                    <option value="visible" className="text-gray-800">แสดงบนเว็บ</option>
                    <option value="hidden" className="text-gray-800">ซ่อนไว้</option>
                  </select>
                </div>
                <button
                  onClick={fetchProducts}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white font-semibold hover:bg-white/30 transition-all"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span className="hidden md:inline">รีเฟรช</span>
                </button>
              </div>
            </div>
            {/* Table Section */}
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <span>#</span>
                      </div>
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" />
                        <span>รูปสินค้า</span>
                      </div>
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        <span>ชื่อสินค้า</span>
                      </div>
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>ราคา</span>
                      </div>
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        <span>ค่าจัดส่ง</span>
                      </div>
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <span>ประกัน</span>
                      </div>
                    </th>
                    <th className="py-4 px-6 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center justify-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span>การมองเห็น</span>
                      </div>
                    </th>
                    <th className="py-4 px-6 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    // Loading skeleton
                    Array(5).fill(0).map((_, index) => (
                      <tr key={index} className="animate-pulse">
                        <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-8"></div></td>
                        <td className="py-4 px-6"><div className="h-16 w-16 bg-gray-200 rounded"></div></td>
                        <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-40"></div></td>
                        <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                        <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                        <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                        <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-12 mx-auto"></div></td>
                        <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                      </tr>
                    ))
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="p-4 bg-gray-100 rounded-full mb-3">
                            <AlertCircle className="w-12 h-12 text-gray-400" />
                          </div>
                          <p className="text-gray-500 font-medium">
                            {searchTerm || filterVisible ? 'ไม่พบข้อมูลที่ค้นหา' : 'ยังไม่มีสินค้า'}
                          </p>
                          {(searchTerm || filterVisible) && (
                            <button
                              onClick={() => { setSearchTerm(''); setFilterVisible(''); }}
                              className="mt-3 text-orange-600 hover:text-orange-700 font-medium text-sm"
                            >
                              ล้างการค้นหา
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product, index) => (
                      <tr 
                        key={product.id} 
                        className="hover:bg-orange-50/50 transition-colors group"
                      >
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-100 to-amber-100 text-orange-600 rounded-lg font-bold text-sm group-hover:from-orange-200 group-hover:to-amber-200 transition-all">
                            {index + 1}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                            <img 
                              src={product.imageUrl || '/placeholder.png'} 
                              alt={product.name} 
                              className="w-full h-full object-cover"
                              onError={e => { e.target.src = '/placeholder.png'; }}
                            />
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-semibold text-gray-800">
                            {product.pro_name || product.name}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                            <DollarSign className="w-3 h-3" />
                            {Number(product.price).toLocaleString()} บาท
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-bold">
                            {product.delivery ? `${Number(product.delivery).toLocaleString()} บาท` : '-'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
                            {product.warranty ? `${product.warranty} เดือน` : '-'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => handleToggleVisible(product.id, product.visible)}
                            title={product.visible ? "คลิกเพื่อซ่อนสินค้า" : "คลิกเพื่อแสดงสินค้า"}
                            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg font-semibold transition-all hover:scale-110"
                          >
                            {product.visible ? (
                              <>
                                <Eye className="w-5 h-5 text-green-600" />
                                <span className="text-xs text-green-600 hidden lg:inline">แสดง</span>
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-5 h-5 text-gray-400" />
                                <span className="text-xs text-gray-400 hidden lg:inline">ซ่อน</span>
                              </>
                            )}
                          </button>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <Link 
                              href={`/admin/product/edit/${product.id}`} 
                              className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all"
                            >
                              <Edit className="w-4 h-4" />
                              <span className="hidden sm:inline">แก้ไข</span>
                            </Link>
                            <button 
                              onClick={() => handleDelete(product.id)} 
                              className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="hidden sm:inline">ลบ</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            {!loading && filteredProducts.length > 0 && (
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-gray-600">
                    แสดง <span className="font-semibold text-gray-800">{filteredProducts.length}</span> จาก <span className="font-semibold text-gray-800">{products.length}</span> รายการ
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold">
                      <Eye className="w-3 h-3" />
                      แสดง: {products.filter(p => p.visible === 1).length}
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold">
                      <EyeOff className="w-3 h-3" />
                      ซ่อน: {products.filter(p => p.visible === 0).length}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}