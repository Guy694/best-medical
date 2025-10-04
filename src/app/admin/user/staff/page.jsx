"use client";
import Navbar from '@/app/components/Nav';
import Sidebar from '@/app/components/Sidebar';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function StaffManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStaff() {
      try {
        const res = await fetch('/api/admin/user/staff');
        const data = await res.json();
        setStaff(data);
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    }
    fetchStaff();

  }, []);

  const handleDelete = async (id) => {
    if (!confirm('ต้องการลบพนักงานนี้ใช่หรือไม่?')) return;
    try {
      const res = await fetch(`/api/admin/user/staff/${id}`, { method: 'DELETE' });
      if (res.ok) {
        // Refetch staff list after deletion to ensure sync
        setLoading(true);
        const resStaff = await fetch('/api/admin/user/staff');
        const data = await resStaff.json();
        setStaff(data);
      }
    } catch (err) {}
    finally {
      setLoading(false);
    }
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
              <h1 className='text-2xl font-semibold text-gray-800'>จัดการรายการพนักงาน-แอดมิน</h1>
              <Link href="/admin/user/staff/add" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">เพิ่มพนักงาน</Link>
            </div>
            <table className='min-w-full'>
              <thead>
                <tr className='bg-gray-200 text-gray-700'>
                  <th className='py-2 px-4 text-left'>#</th>
                  <th className='py-2 px-4 text-left'>ชื่อ-สกุล</th>
                  <th className='py-2 px-4 text-left'>อีเมล</th>
                  <th className='py-2 px-4 text-left'>เบอร์โทร</th>
                  <th className='py-2 px-4 text-left'>สิทธิ์</th>
                  <th className='py-2 px-4 text-left'>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr key="loading"><td colSpan={6} className="text-center py-6 text-gray-700">กำลังโหลด...</td></tr>
                ) : staff.length === 0 ? (
                  <tr key="empty"><td colSpan={6} className="text-center py-6 text-gray-700">ไม่มีพนักงาน</td></tr>
                ) : (
                  staff.map((staff, index) => (
                    <tr key={staff.id || staff.email || index} className="border-b text-gray-700">
                      <td className="py-2 px-4">{index + 1}</td>
                      <td className="py-2 px-4">{staff.name}</td>
                      <td className="py-2 px-4">{staff.email}</td>
                      <td className="py-2 px-4">{staff.phone}</td>
                      <td className="py-2 px-4">{staff.role}</td>
                      <td className="py-2 px-4 flex gap-2">
                        <Link href={`/admin/user/staff/edit/${staff.id}`} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">แก้ไข</Link>
                        <button onClick={() => handleDelete(staff.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">ลบ</button>
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