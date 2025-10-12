"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '@/app/components/Nav';
import Sidebar from '@/app/components/Sidebar';
import { Eye, Edit, Trash2, Package, Truck, CheckCircle, XCircle, Clock, CreditCard } from 'lucide-react';

export default function OrdersManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  const statusOptions = [
    { value: 'PENDING', label: 'รอดำเนินการ', color: 'bg-gray-100 text-gray-800', icon: Clock },
    { value: 'PAID', label: 'ชำระแล้ว', color: 'bg-green-100 text-green-800', icon: CreditCard },
    { value: 'SHIPPING', label: 'กำลังจัดส่ง', color: 'bg-blue-100 text-blue-800', icon: Truck },
    { value: 'COMPLETED', label: 'สำเร็จ', color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle },
    { value: 'CANCELLED', label: 'ยกเลิก', color: 'bg-red-100 text-red-800', icon: XCircle }
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          order_id: orderId,
          status: newStatus
        })
      });

      if (res.ok) {
        await fetchOrders(); // รีเฟรชข้อมูล
        alert('อัปเดตสถานะสำเร็จ');
      } else {
        alert('เกิดข้อผิดพลาดในการอัปเดต');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('เกิดข้อผิดพลาดในการอัปเดต');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusDisplay = (status) => {
    const statusInfo = statusOptions.find(s => s.value === status);
    if (!statusInfo) return { label: status, color: 'bg-gray-100 text-gray-800', icon: Clock };
    return statusInfo;
  };

  const viewOrderDetail = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const parseItems = (items) => {
    if (typeof items === 'string') {
      try {
        return JSON.parse(items);
      } catch {
        return [];
      }
    }
    return Array.isArray(items) ? items : [];
};

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
        <div className="flex-1 min-w-0 p-4 md:p-6">
          <div className="max-w-full mx-auto bg-white shadow-md rounded-lg p-4 md:p-6 mt-4">
            {/* Hamburger for mobile */}
            <button className="md:hidden mb-4 px-3 py-2 bg-gray-200 rounded-lg" onClick={() => setSidebarOpen(true)}>
              <span className="block w-6 h-0.5 bg-gray-700 mb-1"></span>
              <span className="block w-6 h-0.5 bg-gray-700 mb-1"></span>
              <span className="block w-6 h-0.5 bg-gray-700"></span>
            </button>
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
              <h1 className='text-xl md:text-2xl font-semibold text-gray-800'>จัดการรายการออเดอร์</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Package className="h-4 w-4" />
                <span>ทั้งหมด {orders.length} รายการ</span>
              </div>
            </div>

            <div className="overflow-x-auto -mx-4 md:mx-0">
              <div className="min-w-full inline-block align-middle">
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className="bg-gray-50">
                    <tr>
                      <th className='py-3 px-3 md:px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>#</th>
                      <th className='py-3 px-3 md:px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>รหัสคำสั่งซื้อ</th>
                      <th className='py-3 px-3 md:px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>ลูกค้า</th>
                      <th className='py-3 px-3 md:px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>ราคารวม</th>
                      <th className='py-3 px-3 md:px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>สถานะ</th>
                      <th className='py-3 px-3 md:px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>วันที่สั่งซื้อ</th>
                      <th className='py-3 px-3 md:px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>การดำเนินการ</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-gray-500">
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                            กำลังโหลดข้อมูล...
                          </div>
                        </td>
                      </tr>
                    ) : orders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-gray-500">
                          <Package className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                          ไม่มีคำสั่งซื้อ
                        </td>
                      </tr>
                    ) : (
                      orders.map((order, index) => {
                        const statusInfo = getStatusDisplay(order.status);
                        const StatusIcon = statusInfo.icon;
                        return (
                          <tr key={order.order_id} className='hover:bg-gray-50 transition-colors'>
                            <td className='py-3 px-3 md:px-4 text-sm text-gray-900'>{index + 1}</td>
                            <td className='py-3 px-3 md:px-4 text-sm font-medium text-blue-600'>{order.order_code}</td>
                            <td className='py-3 px-3 md:px-4 text-sm text-gray-900'>
                              <div>
                                <div className="font-medium">{order.order_name || 'ไม่ระบุ'}</div>
                                <div className="text-gray-500 text-xs">{order.order_email}</div>
                              </div>
                            </td>
                            <td className='py-3 px-3 md:px-4 text-sm font-medium text-gray-900'>
                              ฿{parseFloat(order.totalPrice).toLocaleString()}
                            </td>
                            <td className='py-3 px-3 md:px-4'>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusInfo.label}
                              </span>
                            </td>
                            <td className='py-3 px-3 md:px-4 text-sm text-gray-500'>{order.orderDate}</td>
                            <td className='py-3 px-3 md:px-4'>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => viewOrderDetail(order)}
                                  className='text-blue-600 hover:text-blue-900 p-1'
                                  title="ดูรายละเอียด"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <select
                                  value={order.status}
                                  onChange={(e) => updateOrderStatus(order.order_id, e.target.value)}
                                  disabled={updating}
                                  className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  {statusOptions.map(status => (
                                    <option key={status.value} value={status.value}>
                                      {status.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 md:p-6 flex justify-between items-center">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                รายละเอียดคำสั่งซื้อ {selectedOrder.order_code}
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-4 md:p-6 space-y-6">
              {/* Customer Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    ข้อมูลลูกค้า
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">ชื่อ:</span> {selectedOrder.order_name || 'ไม่ระบุ'}</div>
                    <div><span className="font-medium">อีเมล:</span> {selectedOrder.order_email}</div>
                    <div><span className="font-medium">เบอร์โทร:</span> {selectedOrder.order_phone || 'ไม่ระบุ'}</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Truck className="h-4 w-4 mr-2" />
                    ที่อยู่จัดส่ง
                  </h3>
                  <div className="text-sm">
                    <p>{selectedOrder.order_address || 'ไม่ระบุที่อยู่'}</p>
                    {selectedOrder.order_note && (
                      <div className="mt-2">
                        <span className="font-medium">หมายเหตุ:</span>
                        <p className="text-gray-600">{selectedOrder.order_note}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Package className="h-4 w-4 mr-2" />
                  รายการสินค้า
                </h3>
                <div className="space-y-3">
                  {parseItems(selectedOrder.items).map((item, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-3 flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-800">{item.name}</div>
                        <div className="text-sm text-gray-500">
                          ราคาต่อชิ้น: ฿{parseFloat(item.price).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">จำนวน: {item.quantity}</div>
                        <div className="text-sm text-gray-600">
                          รวม: ฿{(parseFloat(item.price) * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>ยอดรวมทั้งสิ้น:</span>
                    <span className="text-green-600">฿{parseFloat(selectedOrder.totalPrice).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Order Status */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">สถานะปัจจุบัน</h3>
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusDisplay(selectedOrder.status).color}`}>
                    {(() => {
                      const StatusIcon = getStatusDisplay(selectedOrder.status).icon;
                      return <StatusIcon className="h-4 w-4 mr-2" />;
                    })()}
                    {getStatusDisplay(selectedOrder.status).label}
                  </span>
                  <div className="text-sm text-gray-500">
                    วันที่สั่งซื้อ: {selectedOrder.orderDate}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



