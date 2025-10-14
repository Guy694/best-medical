// src/app/order-status/[orderId]/page.jsx
"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/app/components/Nav';
import OrderTimeline from '@/app/components/OrderTimeline';
import { Package, MapPin, Phone, Mail, Calendar } from 'lucide-react';

export default function OrderStatusPage() {
  const params = useParams();
  const orderId = params.orderId;
  
  const [order, setOrder] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (orderId) {
      fetchOrderData();
    }
  }, [orderId]);

  const fetchOrderData = async () => {
    try {
      setLoading(true);
      
      // ดึงข้อมูลคำสั่งซื้อ
      const orderRes = await fetch(`/api/orders/${orderId}`);
      const orderData = await orderRes.json();
      
      if (orderData.success) {
        setOrder(orderData.order);
      } else {
        setError('ไม่พบคำสั่งซื้อ');
        return;
      }

      // ดึงประวัติสถานะ
      const historyRes = await fetch(`/api/orders/${orderId}/history`);
      const historyData = await historyRes.json();
      
      if (historyData.success) {
        setHistory(historyData.history);
      }

    } catch (err) {
      console.error('Error:', err);
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">{error || 'ไม่พบคำสั่งซื้อ'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  สถานะคำสั่งซื้อ
                </h1>
                <p className="text-gray-600">
                  รหัสคำสั่งซื้อ: <span className="font-semibold text-blue-600">{order.orderCode}</span>
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">ยอดรวม</div>
                <div className="text-2xl font-bold text-gray-800">
                  ฿{Number(order.totalPrice).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Order Info Grid */}
            <div className="grid md:grid-cols-2 gap-6 mt-6 pt-6 border-t">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-blue-600" />
                  ข้อมูลการติดต่อ
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <span className="text-gray-600 w-24">อีเมล:</span>
                    <span className="font-medium">{order.email}</span>
                  </div>
                  {order.phone && (
                    <div className="flex items-start">
                      <Phone className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                      <span className="font-medium">{order.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  ที่อยู่จัดส่ง
                </h3>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress || 'ไม่มีข้อมูล'}
                </p>
              </div>

              {/* Order Date */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  วันที่สั่งซื้อ
                </h3>
                <p className="text-sm text-gray-600">
                  {new Date(order.createdAt).toLocaleString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              ประวัติการดำเนินการ
            </h2>
            <OrderTimeline history={history} />
          </div>

          {/* Order Items */}
          {order.items && order.items.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                รายการสินค้า
              </h2>
              <div className="divide-y">
                {order.items.map((item, index) => (
                  <div key={index} className="py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div>
                        <h4 className="font-medium text-gray-800">{item.name}</h4>
                        <p className="text-sm text-gray-500">จำนวน: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">
                        ฿{(item.price * item.quantity).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        @ ฿{item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
