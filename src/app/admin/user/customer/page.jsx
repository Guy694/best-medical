"use client";
import React, { useState, useEffect } from "react";
import Navbar from '@/app/components/Nav';
import Sidebar from '@/app/components/Sidebar';
import { 
  Users, Search, Calendar, Mail, Phone, MapPin, 
  UserCheck, Filter, Download, RefreshCw, Menu
} from 'lucide-react';

export default function CustomerList() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/user/customer');
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.includes(searchTerm);
    
    const matchesDate = !filterDate || 
      (user.createdAt && new Date(user.createdAt).toLocaleDateString('en-CA') === filterDate);
    
    return matchesSearch && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  รายการลูกค้า
                </h1>
                <p className="text-gray-600 text-sm">จัดการข้อมูลลูกค้าที่ลงทะเบียน</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">ลูกค้าทั้งหมด</p>
                  <p className="text-3xl font-bold text-blue-600">{users.length}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                  <UserCheck className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">ลงทะเบียนวันนี้</p>
                  <p className="text-3xl font-bold text-green-600">
                    {users.filter(u => u.createdAt && new Date(u.createdAt).toLocaleDateString('en-CA') === new Date().toLocaleDateString('en-CA')).length}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-xl">
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">แสดงผล</p>
                  <p className="text-3xl font-bold text-purple-600">{filteredUsers.length}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl">
                  <Filter className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Table Card */}
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border border-white/50 overflow-hidden">
            {/* Filter Section */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" size={20} />
                  <input
                    type="text"
                    placeholder="ค้นหาชื่อ, อีเมล, เบอร์โทร..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" size={20} />
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="w-full md:w-auto pl-10 pr-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  />
                </div>
                <button
                  onClick={fetchUsers}
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
                        <Users className="w-4 h-4" />
                        <span>ชื่อ-นามสกุล</span>
                      </div>
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>อีเมล</span>
                      </div>
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>เบอร์โทร</span>
                      </div>
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>ที่อยู่</span>
                      </div>
                    </th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>วันที่สมัคร</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    // Loading skeleton
                    Array(5).fill(0).map((_, index) => (
                      <tr key={index} className="animate-pulse">
                        <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-8"></div></td>
                        <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                        <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-40"></div></td>
                        <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                        <td className="py-4 px-6 hidden lg:table-cell"><div className="h-4 bg-gray-200 rounded w-48"></div></td>
                        <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-28"></div></td>
                      </tr>
                    ))
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="p-4 bg-gray-100 rounded-full mb-3">
                            <Users className="w-12 h-12 text-gray-400" />
                          </div>
                          <p className="text-gray-500 font-medium">
                            {searchTerm || filterDate ? 'ไม่พบข้อมูลที่ค้นหา' : 'ยังไม่มีข้อมูลลูกค้า'}
                          </p>
                          {(searchTerm || filterDate) && (
                            <button
                              onClick={() => { setSearchTerm(''); setFilterDate(''); }}
                              className="mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm"
                            >
                              ล้างการค้นหา
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user, index) => (
                      <tr 
                        key={user.id || user.email} 
                        className="hover:bg-blue-50/50 transition-colors group"
                      >
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 rounded-lg font-bold text-sm group-hover:from-blue-200 group-hover:to-indigo-200 transition-all">
                            {index + 1}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                              {user.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <span className="font-semibold text-gray-800">{user.name || '-'}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{user.email || '-'}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{user.phone || '-'}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 hidden lg:table-cell">
                          <div className="flex items-center gap-2 text-gray-700 max-w-xs">
                            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-sm truncate" title={user.address}>
                              {user.address || '-'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                              <Calendar className="w-3 h-3 mr-1" />
                              {user.createdAt ? new Date(user.createdAt).toLocaleDateString('th-TH', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              }) : '-'}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            {!loading && filteredUsers.length > 0 && (
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-gray-600">
                    แสดง <span className="font-semibold text-gray-800">{filteredUsers.length}</span> จาก <span className="font-semibold text-gray-800">{users.length}</span> รายการ
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
