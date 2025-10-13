// src/app/admin/payment-notice/page.jsx
"use client";
import React, { useState, useEffect } from "react";
import Navbar from '@/app/components/Nav';
import Sidebar from '@/app/components/Sidebar';
import { Eye, Download, Check, X } from 'lucide-react';

export default function AdminPaymentNotice() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/admin/payment-notice');
      const data = await response.json();
      setPayments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (orderId, status) => {
    try {
      const response = await fetch('/api/admin/payment-notice', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, status }),
      });

      if (response.ok) {
        fetchPayments(); // Refresh the list
        setModalOpen(false);
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const viewPaymentDetail = (payment) => {
    setSelectedPayment(payment);
    setModalOpen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('th-TH');
  };

  const formatTime = (timeString) => {
    return timeString ? timeString.substring(0, 5) : '';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h1 className="text-2xl font-bold text-gray-800">การแจ้งชำระเงิน</h1>
              <p className="text-gray-600 mt-2">จัดการหลักฐานการชำระเงินจากลูกค้า</p>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">กำลังโหลด...</p>
                </div>
              ) : payments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">ไม่มีการแจ้งชำระเงิน</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left p-3 font-semibold">รหัสใบสั่งซื้อ</th>
                        <th className="text-left p-3 font-semibold">ชื่อลูกค้า</th>
                        <th className="text-left p-3 font-semibold">จำนวนเงิน</th>
                        <th className="text-left p-3 font-semibold">วันที่โอน</th>
                        <th className="text-left p-3 font-semibold">สถานะ</th>
                        <th className="text-left p-3 font-semibold">หลักฐาน</th>
                        <th className="text-left p-3 font-semibold">การดำเนินการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">{payment.orderCode}</td>
                          <td className="p-3">{payment.customer_name}</td>
                          <td className="p-3">฿{Number(payment.amount).toLocaleString()}</td>
                          <td className="p-3">
                            {formatDate(payment.transfer_date)} {formatTime(payment.transfer_time)}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              payment.status === 'PAID' 
                                ? 'bg-green-100 text-green-800'
                                : payment.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {payment.status === 'PAID' ? 'ยืนยันแล้ว' : 
                               payment.status === 'PENDING' ? 'รอตรวจสอบ' : 'ยกเลิก'}
                            </span>
                          </td>
                          <td className="p-3">
                            {payment.transfer_slip_file ? (
                              <button
                                onClick={() => viewPaymentDetail(payment)}
                                className="text-blue-600 hover:text-blue-800 flex items-center"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                ดูหลักฐาน
                              </button>
                            ) : (
                              <span className="text-gray-400">ไม่มีไฟล์</span>
                            )}
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => viewPaymentDetail(payment)}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                            >
                              ดูรายละเอียด
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for payment details */}
      {modalOpen && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full m-4 max-h-screen overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">รายละเอียดการแจ้งชำระเงิน</h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">รหัสใบสั่งซื้อ</label>
                  <p className="mt-1 text-gray-900">{selectedPayment.orderCode}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">ชื่อลูกค้า</label>
                  <p className="mt-1 text-gray-900">{selectedPayment.customer_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">อีเมล</label>
                  <p className="mt-1 text-gray-900">{selectedPayment.customer_email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">จำนวนเงิน</label>
                  <p className="mt-1 text-gray-900 font-bold">฿{Number(selectedPayment.amount).toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">วันที่โอน</label>
                  <p className="mt-1 text-gray-900">{formatDate(selectedPayment.transfer_date)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">เวลาที่โอน</label>
                  <p className="mt-1 text-gray-900">{formatTime(selectedPayment.transfer_time)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">ธนาคาร</label>
                  <p className="mt-1 text-gray-900">{selectedPayment.bank_account || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">เลขที่อ้างอิง</label>
                  <p className="mt-1 text-gray-900">{selectedPayment.transfer_slip || '-'}</p>
                </div>
              </div>

              {/* Payment slip file */}
              {selectedPayment.transfer_slip_file && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">หลักฐานการโอน</label>
                  <div className="border rounded-lg p-4">
                    <img
                      src={selectedPayment.transfer_slip_file}
                      alt="หลักฐานการโอน"
                      className="max-w-full h-auto max-h-96 mx-auto"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div style={{display: 'none'}} className="text-center text-gray-500">
                      ไม่สามารถแสดงไฟล์ได้
                    </div>
                    <div className="mt-2 text-center">
                      <a
                        href={selectedPayment.transfer_slip_file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        ดาวน์โหลด
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              {selectedPayment.status === 'PENDING' && (
                <div className="flex gap-3 mb-4">
                  <button
                    onClick={() => updatePaymentStatus(selectedPayment.order_id, 'PAID')}
                    className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    ยืนยันการชำระเงิน
                  </button>
                  <button
                    onClick={() => updatePaymentStatus(selectedPayment.order_id, 'CANCELLED')}
                    className="flex items-center bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    <X className="w-4 h-4 mr-2" />
                    ปฏิเสธ
                  </button>
                </div>
              )}
            </div>

            <div className="p-6 border-t flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}