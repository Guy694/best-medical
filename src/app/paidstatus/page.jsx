// src/app/paidstatus/page.jsx
"use client";
import Navbar from './../components/Nav';
import { useState } from "react";
import { Package, Truck, CheckCircle, XCircle, Clock, CreditCard, MapPin, Phone, Mail, Calendar } from 'lucide-react';

export default function PaidStatus() {
  const [orderCode, setOrderCode] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!orderCode.trim()) {
      setError('กรุณากรอกเลขที่ใบสั่งซื้อ');
      return;
    }

    setLoading(true);
    setError('');
    setOrderData(null);

    try {
      const response = await fetch(`/api/order-status?order_code=${encodeURIComponent(orderCode)}`);
      const data = await response.json();

      if (response.ok) {
        setOrderData(data.order);
      } else {
        setError(data.error || 'เกิดข้อผิดพลาดในการค้นหา');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  };

  const getStepIcon = (step, currentStep, status) => {
    if (status === 'CANCELLED') {
      return <XCircle className="w-6 h-6 text-red-500" />;
    }
    
    if (step <= currentStep) {
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    }
    return <Clock className="w-6 h-6 text-gray-400" />;
  };

  const StatusTimeline = ({ status }) => {
    const steps = [
      { step: 1, title: 'รอดำเนินการ', description: 'ได้รับคำสั่งซื้อแล้ว' },
      { step: 2, title: 'ชำระเงินแล้ว', description: 'ยืนยันการชำระเงิน' },
      { step: 3, title: 'กำลังจัดส่ง', description: 'สินค้าออกจากคลัง' },
      { step: 4, title: 'สำเร็จ', description: 'ได้รับสินค้าแล้ว' }
    ];

    const currentStep = orderData?.statusInfo?.step || 0;
    const isCancelled = status === 'CANCELLED';

    return (
      <div className="w-full py-6">
        <div className="flex items-center justify-between">
          {steps.map((stepItem, index) => (
            <div key={stepItem.step} className="flex flex-col items-center flex-1">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                isCancelled 
                  ? 'border-red-200 bg-red-50' 
                  : stepItem.step <= currentStep 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-300 bg-gray-50'
              }`}>
                {getStepIcon(stepItem.step, currentStep, status)}
              </div>
              <div className="mt-2 text-center">
                <div className={`text-sm font-medium ${
                  isCancelled 
                    ? 'text-red-600' 
                    : stepItem.step <= currentStep 
                      ? 'text-green-600' 
                      : 'text-gray-500'
                }`}>
                  {stepItem.title}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {stepItem.description}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`hidden md:block absolute top-6 left-1/2 w-full h-0.5 ${
                  isCancelled 
                    ? 'bg-red-200' 
                    : stepItem.step < currentStep 
                      ? 'bg-green-500' 
                      : 'bg-gray-300'
                }`} style={{ 
                  marginLeft: `${(100 / steps.length) / 2}%`,
                  width: `${100 / steps.length}%`,
                  zIndex: -1
                }} />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };


  return (
    <div>
      <Navbar />
      <div className='min-h-screen bg-gray-50'>
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-blue-900 text-center mb-8">
            ตรวจสอบสถานะการสั่งซื้อ
          </h1>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Search Form */}
            <section className="bg-white rounded-xl shadow-lg">
              <div className="header bg-gradient-to-r from-blue-600 to-blue-900 p-6 rounded-t-xl">
                <h2 className="text-2xl font-semibold text-white text-center">
                  <Package className="inline-block w-8 h-8 mr-2" />
                  ค้นหาใบสั่งซื้อ
                </h2>
              </div>
            
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    เลขที่ใบสั่งซื้อ <span className='text-red-500 text-xl'>*</span>
                  </label>
                  <input
                    type="text"
                    value={orderCode}
                    onChange={(e) => setOrderCode(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="กรอกเลขที่ใบสั่งซื้อ เช่น ORD-2024-001"
                  />
                </div>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      กำลังค้นหา...
                    </>
                  ) : (
                    <>
                      <Package className="w-5 h-5 mr-2" />
                      ตรวจสอบสถานะ
                    </>
                  )}
                </button>
              </form>
            </section>

            {/* Order Status Results */}
            {orderData && (
              <section className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Status Header */}
                <div className={`p-6 text-white ${orderData.statusInfo.color}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold">
                        {orderData.statusInfo.text}
                      </h3>
                      <p className="text-blue-100 mt-1">
                        {orderData.statusInfo.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold">
                        {orderData.order_code}
                      </div>
                      <div className="text-sm text-blue-100">
                        {new Date(orderData.created_at).toLocaleDateString('th-TH')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="p-6 border-b relative">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">ติดตามสถานะ</h4>
                  <StatusTimeline status={orderData.status} />
                </div>

                {/* Order Details */}
                <div className="p-6 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Customer Info */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <Mail className="w-5 h-5 mr-2 text-blue-600" />
                        ข้อมูลลูกค้า
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <span className="text-gray-600 w-20">ชื่อ:</span>
                          <span className="text-gray-800">{orderData.firstname} {orderData.lastname}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-gray-800">{orderData.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-gray-800">{orderData.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Info */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <CreditCard className="w-5 h-5 mr-2 text-blue-600" />
                        ข้อมูลคำสั่งซื้อ
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">ยอดรวม:</span>
                          <span className="text-gray-800 font-semibold">
                            ฿{Number(orderData.total_amount).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">วิธีชำระเงิน:</span>
                          <span className="text-gray-800">{orderData.payment_method}</span>
                        </div>
                        {orderData.tracking_number && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">เลขติดตาม:</span>
                            <span className="text-blue-600 font-mono">{orderData.tracking_number}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  {orderData.shipping_address && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                        ที่อยู่จัดส่ง
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700">{orderData.shipping_address}</p>
                      </div>
                    </div>
                  )}

                  {/* Order Items */}
                  {orderData.items && orderData.items.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <Package className="w-5 h-5 mr-2 text-blue-600" />
                        สินค้าที่สั่งซื้อ
                      </h4>
                      <div className="bg-gray-50 rounded-lg overflow-hidden">
                        <div className="divide-y divide-gray-200">
                          {orderData.items.map((item, index) => (
                            <div key={index} className="p-4 flex items-center space-x-4">
                              {item.product_image && (
                                <img 
                                  src={item.product_image} 
                                  alt={item.product_name}
                                  className="w-12 h-12 object-cover rounded-lg"
                                />
                              )}
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-800">{item.product_name}</h5>
                                <p className="text-sm text-gray-600">
                                  จำนวน: {item.quantity} x ฿{Number(item.price).toLocaleString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <span className="font-semibold text-gray-800">
                                  ฿{(item.quantity * item.price).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
