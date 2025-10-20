"use client";
import Navbar from '@/app/components/Nav';
import Sidebar from '@/app/components/Sidebar';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, Search, Mail, Phone, Shield, Edit, Trash2, 
  UserPlus, Menu, RefreshCw, AlertCircle, UserCog, Crown
} from 'lucide-react';

export default function StaffManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');

  useEffect(() => {
    fetchStaff();
  }, []);

  async function fetchStaff() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/user/staff');
      const data = await res.json();
      setStaff(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching staff:', err);
      setStaff([]);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('ต้องการลบพนักงานนี้ใช่หรือไม่?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/user/staff/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchStaff();
        alert('ลบพนักงานสำเร็จ');
      } else {
        alert('เกิดข้อผิดพลาดในการลบ');
      }
    } catch (err) {
      console.error('Error deleting staff:', err);
      alert('เกิดข้อผิดพลาดในการลบ');
    } finally {
      setLoading(false);
    }
  };

  const filteredStaff = staff.filter(s => {
    const matchesSearch = !searchTerm || 
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone?.includes(searchTerm);
    
    const matchesRole = !filterRole || s.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role) => {
    if (role === 'ADMIN') {
      return {
        icon: <Crown className="w-3 h-3" />,
        text: 'ผู้ดูแลระบบ',
        color: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
      };
    }
    return {
      icon: <UserCog className="w-3 h-3" />,
      text: 'พนักงาน',
      color: 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white'
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
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
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
                  <UserCog className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    จัดการพนักงาน
                  </h1>
                  <p className="text-gray-600 text-sm">จัดการข้อมูลพนักงานและสิทธิ์การใช้งาน</p>
                </div>
              </div>
              <Link 
                href="/admin/user/staff/add" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <UserPlus className="w-5 h-5" />
                เพิ่มพนักงาน
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">พนักงานทั้งหมด</p>
                  <p className="text-3xl font-bold text-purple-600">{staff.length}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">ผู้ดูแลระบบ</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {staff.filter(s => s.role === 'ADMIN').length}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl">
                  <Crown className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">พนักงาน</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {staff.filter(s => s.role === 'STAFF').length}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                  <UserCog className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Table Card */}
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-3xl border border-white/50 overflow-hidden">
            {/* Filter Section */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4 md:p-6">
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
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" size={20} />
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="w-full md:w-auto pl-10 pr-10 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="" className="text-gray-800">ทุกสิทธิ์</option>
                    <option value="ADMIN" className="text-gray-800">ผู้ดูแลระบบ</option>
                    <option value="STAFF" className="text-gray-800">พนักงาน</option>
                  </select>
                </div>
                <button
                  onClick={fetchStaff}
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
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        <span>สิทธิ์</span>
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
                        <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                        <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-40"></div></td>
                        <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                        <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                        <td className="py-4 px-6"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                      </tr>
                    ))
                  ) : filteredStaff.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="p-4 bg-gray-100 rounded-full mb-3">
                            <AlertCircle className="w-12 h-12 text-gray-400" />
                          </div>
                          <p className="text-gray-500 font-medium">
                            {searchTerm || filterRole ? 'ไม่พบข้อมูลที่ค้นหา' : 'ยังไม่มีข้อมูลพนักงาน'}
                          </p>
                          {(searchTerm || filterRole) && (
                            <button
                              onClick={() => { setSearchTerm(''); setFilterRole(''); }}
                              className="mt-3 text-purple-600 hover:text-purple-700 font-medium text-sm"
                            >
                              ล้างการค้นหา
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredStaff.map((s, index) => {
                      const roleBadge = getRoleBadge(s.role);
                      return (
                        <tr 
                          key={s.id || s.email || index} 
                          className="hover:bg-purple-50/50 transition-colors group"
                        >
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600 rounded-lg font-bold text-sm group-hover:from-purple-200 group-hover:to-pink-200 transition-all">
                              {index + 1}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 ${s.role === 'ADMIN' ? 'bg-gradient-to-br from-yellow-400 to-orange-400' : 'bg-gradient-to-br from-blue-400 to-indigo-400'} rounded-full flex items-center justify-center text-white font-bold shadow-md`}>
                                {s.name?.charAt(0).toUpperCase() || 'S'}
                              </div>
                              <span className="font-semibold text-gray-800">{s.name || '-'}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2 text-gray-700">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{s.email || '-'}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2 text-gray-700">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{s.phone || '-'}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 ${roleBadge.color} rounded-full text-xs font-bold shadow-md`}>
                              {roleBadge.icon}
                              {roleBadge.text}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-center gap-2">
                              <Link 
                                href={`/admin/user/staff/edit/${s.id}`} 
                                className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all"
                              >
                                <Edit className="w-4 h-4" />
                                <span className="hidden sm:inline">แก้ไข</span>
                              </Link>
                              <button 
                                onClick={() => handleDelete(s.id)} 
                                className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span className="hidden sm:inline">ลบ</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            {!loading && filteredStaff.length > 0 && (
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-gray-600">
                    แสดง <span className="font-semibold text-gray-800">{filteredStaff.length}</span> จาก <span className="font-semibold text-gray-800">{staff.length}</span> รายการ
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-semibold">
                      <Crown className="w-3 h-3" />
                      Admin: {staff.filter(s => s.role === 'ADMIN').length}
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold">
                      <UserCog className="w-3 h-3" />
                      Staff: {staff.filter(s => s.role === 'STAFF').length}
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