"use client";
import React, { useState, useEffect } from "react";
import Navbar from '@/app/components/Nav';
import Sidebar from '@/app/components/Sidebar';

export default function CustomerList() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/admin/user/customer');
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 p-6">
          <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6 mt-4">
            <h1 className="text-2xl font-semibold mb-4 text-gray-800">รายการลูกค้าที่ลงทะเบียน</h1>
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="py-2 px-4 text-left">#</th>
                  <th className="py-2 px-4 text-left">ชื่อ</th>
                  <th className="py-2 px-4 text-left">อีเมล</th>
                  <th className="py-2 px-4 text-left">เบอร์โทร</th>
                  <th className="py-2 px-4 text-left">ที่อยู่</th>
                  <th className="py-2 px-4 text-left">วันที่สมัคร</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="text-center py-6">กำลังโหลด...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-6">ไม่มีข้อมูลลูกค้า</td></tr>
                ) : (
                    users.map((user, index) => (
                      <tr key={user.id || user.email} className="border-b text-gray-700">
                        <td className="py-2 px-4">{index + 1}</td>
                        <td className="py-2 px-4">{user.name}</td>
                        <td className="py-2 px-4">{user.email}</td>
                        <td className="py-2 px-4">{user.phone}</td>
                        <td className="py-2 px-4">{user.address}</td>
                        <td className="py-2 px-4">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""}</td>
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
