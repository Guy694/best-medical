"use client";
import Navbar from '@/app/components/Nav';
import Sidebar from '@/app/components/Sidebar';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FolderOpen, Search, Plus, Edit, Trash2, Image as ImageIcon,
  Menu, RefreshCw, AlertCircle, Tag
} from 'lucide-react';

export default function CategoryManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('ต้องการลบหมวดหมู่นี้ใช่หรือไม่?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchCategories();
        alert('ลบหมวดหมู่สำเร็จ');
      } else {
        alert('เกิดข้อผิดพลาดในการลบ');
      }
    } catch (err) {
      console.error('Error deleting category:', err);
      alert('เกิดข้อผิดพลาดในการลบ');
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(c => {
    const matchesSearch = !searchTerm || 
      c.cate_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
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
                <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl shadow-lg">
                  <FolderOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    จัดการหมวดหมู่สินค้า
                  </h1>
                  <p className="text-gray-600 text-sm">จัดการหมวดหมู่และรูปภาพ</p>
                </div>
              </div>
              <Link 
                href="/admin/categories/add" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <Plus className="w-5 h-5" />
                เพิ่มหมวดหมู่
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">หมวดหมู่ทั้งหมด</p>
                  <p className="text-3xl font-bold text-teal-600">{categories.length}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl">
                  <FolderOpen className="w-8 h-8 text-teal-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">แสดงผล</p>
                  <p className="text-3xl font-bold text-cyan-600">{filteredCategories.length}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-xl">
                  <Tag className="w-8 h-8 text-cyan-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Table Card */}
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border border-white/50 overflow-hidden">
            {/* Filter Section */}
            <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" size={20} />
                  <input
                    type="text"
                    placeholder="ค้นหาชื่อหมวดหมู่..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  />
                </div>
                <button
                  onClick={fetchCategories}
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
                        <span>รูปหมวดหมู่</span>
                      </div>
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        <span>ชื่อหมวดหมู่</span>
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
                        <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                      </tr>
                    ))
                  ) : filteredCategories.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="p-4 bg-gray-100 rounded-full mb-3">
                            <AlertCircle className="w-12 h-12 text-gray-400" />
                          </div>
                          <p className="text-gray-500 font-medium">
                            {searchTerm ? 'ไม่พบข้อมูลที่ค้นหา' : 'ยังไม่มีหมวดหมู่'}
                          </p>
                          {searchTerm && (
                            <button
                              onClick={() => setSearchTerm('')}
                              className="mt-3 text-teal-600 hover:text-teal-700 font-medium text-sm"
                            >
                              ล้างการค้นหา
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredCategories.map((category, index) => (
                      <tr 
                        key={category.id || index} 
                        className="hover:bg-teal-50/50 transition-colors group"
                      >
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-teal-100 to-cyan-100 text-teal-600 rounded-lg font-bold text-sm group-hover:from-teal-200 group-hover:to-cyan-200 transition-all">
                            {index + 1}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                            <img
                              src={category.cate_img && category.cate_img.startsWith('/') ? category.cate_img : '/placeholder.png'}
                              alt={category.cate_name}
                              className="w-full h-full object-cover"
                              onError={e => { e.target.src = "/placeholder.png"; }}
                            />
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-800">{category.cate_name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <Link 
                              href={`/admin/categories/edit/${category.id}`} 
                              className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all"
                            >
                              <Edit className="w-4 h-4" />
                              <span className="hidden sm:inline">แก้ไข</span>
                            </Link>
                            <button 
                              onClick={() => handleDelete(category.id)} 
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
            {!loading && filteredCategories.length > 0 && (
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-gray-600">
                    แสดง <span className="font-semibold text-gray-800">{filteredCategories.length}</span> จาก <span className="font-semibold text-gray-800">{categories.length}</span> รายการ
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}