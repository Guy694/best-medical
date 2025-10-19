"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Nav';
import { Package, Eye, Clock, CheckCircle, XCircle, Truck, CreditCard, Calendar } from 'lucide-react';
import { sessionManager } from '@/app/lib/sessionTimeout';

export default function OrderHistoryPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ตรวจสอบว่า user login อยู่หรือไม่
    const currentUser = sessionManager.getSession();
    
    if (!currentUser || sessionManager.isSessionExpired()) {
      router.push('/login');
      return;
    }

    if (currentUser.role !== 'CUSTOMER') {
      router.push('/');
      return;
    }

    setUser(currentUser);
    fetchOrders(currentUser.email);
  }, [router]);

  const fetchOrders = async (email) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/orders/history?email=${encodeURIComponent(email)}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setOrders(data.orders);
      } else {
        setError(data.error || 'ไม่สามารถโหลดข้อมูลได้');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'PENDING':
        return { label: 'รอดำเนินการ', color: 'bg-gray-100 text-gray-800', icon: Clock };
      case 'PAID':
        return { label: 'ชำระแล้ว', color: 'bg-green-100 text-green-800', icon: CreditCard };
      case 'SHIPPING':
        return { label: 'กำลังจัดส่ง', color: 'bg-blue-100 text-blue-800', icon: Truck };
      case 'COMPLETED':
        return { label: 'สำเร็จ', color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle };
      case 'CANCELLED':
        return { label: 'ยกเลิก', color: 'bg-red-100 text-red-800', icon: XCircle };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-800', icon: Clock };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      {/* Decorative background patterns */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <Package className="w-8 h-8 mr-3 text-blue-600" />
                ประวัติการสั่งซื้อ
              </h1>
              {user && (
                <p className="text-gray-600 mt-2">
                  บัญชี: {user.email}
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">ทั้งหมด</div>
              <div className="text-2xl font-bold text-blue-600">{orders.length} รายการ</div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                <span className="text-gray-600">กำลังโหลดข้อมูล...</span>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">ยังไม่มีประวัติการสั่งซื้อ</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <div 
                    key={order.order_id} 
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {order.order_code}
                          </h3>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusInfo.label}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {formatDate(order.createdAt)}
                          </div>
                          <div className="flex items-center">
                            <Package className="w-4 h-4 mr-2" />
                            จำนวน {order.item_count} รายการ
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm text-gray-600">ยอดรวม</div>
                          <div className="text-xl font-bold text-gray-800">
                            ฿{Number(order.totalPrice).toLocaleString()}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => router.push(`/order-status/${order.order_code}`)}
                          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="hidden sm:inline">ดูรายละเอียด</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
