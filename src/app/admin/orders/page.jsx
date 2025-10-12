"use client";
import React from 'react'
import Navbar from '@/app/components/Nav';
import Sidebar from '@/app/components/Sidebar';
import { useState, useEffect } from 'react';

export default function OrdersManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/admin/orders');
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();

  }, []);

  // const orders = [
  //   {
  //     id: 'ORD123456',
  //       items: 'Product A, Product B',
  //       total: 1500,
  //       status: 'Shipped',
  //       orderDate: '2023-10-01',
  //   },
  //   {
  //     id: 'ORD123457',
  //       items: 'Product C',
  //       total: 500,
  //       status: 'Processing',
  //       orderDate: '2023-10-02',
  //   },
  //   // เพิ่มคำสั่งซื้อเพิ่มเติมตามต้องการ
  // ];
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
            </div>
            <table className='min-w-full'>
              <thead>
                <tr className='bg-gray-200 text-gray-700'>
                  <th className='py-2 px-4 border-b'>#</th>
                  <th className='py-2 px-4 border-b'>รหัสคำสั่งซื้อ</th>
                  <th className='py-2 px-4 border-b'>รายการสินค้า</th>
                  <th className='py-2 px-4 border-b'>ราคา</th>
                  <th className='py-2 px-4 border-b'>สถานะ</th>
                  <th className='py-2 px-4 border-b'>วันที่สั่งซื้อ</th>
                  <th className='py-2 px-4 border-b'>การดำเนินการ</th>

                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr key="loading"><td colSpan={6} className="text-center py-6 text-gray-700">กำลังโหลด...</td></tr>
                ) : orders.length === 0 ? (
                  <tr key="empty"><td colSpan={6} className="text-center py-6 text-gray-700">ไม่มีคำสั่งซื้อ</td></tr>
                ) : (
                  orders.map((order, index) => (
                    <tr key={order.order_id} className='text-gray-700 hover:bg-gray-100'>
                      <td className='py-2 px-4 border-b'>{index + 1}</td>
                      <td className='py-2 px-4 border-b'>{order.order_code}</td>
                      <td className='py-2 px-4 border-b'>
                        {(() => {
                          let items = order.items;
                          if (typeof items === "string") {
                            try {
                              items = JSON.parse(items);
                            } catch {
                              items = [];
                            }
                          }
                          return Array.isArray(items)
                            ? items.map((item, idx) => (
                              <div key={idx} className="mb-1">
                                <span className="font-medium">{item.name}</span>
                                <span className="text-gray-500"> x{item.quantity}</span>
                                <span className="text-gray-400"> ({parseFloat(item.price).toLocaleString()} ฿)</span>
                              </div>
                            ))
                            : null;
                        })()}
                      </td>
                      <td className='py-2 px-4 border-b'>{order.totalPrice}</td>
                      <td className='py-2 px-4 border-b'>{order.status}</td>
                      <td className='py-2 px-4 border-b'>{order.orderDate}</td>
                      <td className='py-2 px-4 border-b'>
                        <button className='text-blue-500 hover:underline'>Edit</button>
                        <button className='text-red-500 hover:underline'>Delete</button>
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
  )
}

