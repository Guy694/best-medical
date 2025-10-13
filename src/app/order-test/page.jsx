"use client";
import Navbar from '../components/Nav';
import Link from 'next/link';
import { Package, Search, Database, Code, TestTube } from 'lucide-react';

export default function OrderTestPage() {
  const testOrders = [
    { code: 'ORD-2024-101', status: 'PENDING', description: 'รอดำเนินการ' },
    { code: 'ORD-2024-102', status: 'PAID', description: 'ชำระเงินแล้ว' },
    { code: 'ORD-2024-103', status: 'SHIPPING', description: 'กำลังจัดส่ง' },
    { code: 'ORD-2024-104', status: 'COMPLETED', description: 'สำเร็จ' },
    { code: 'ORD-2024-105', status: 'CANCELLED', description: 'ยกเลิก' }
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert(`คัดลอก ${text} แล้ว!`);
  };

  return (
    <div>
      <Navbar />
      <div className='min-h-screen bg-gray-50'>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-900 mb-4">
              <TestTube className="inline-block w-8 h-8 mr-2" />
              ทดสอบระบบตรวจสอบสถานะคำสั่งซื้อ
            </h1>
            <p className="text-gray-600">
              หน้านี้สำหรับทดสอบระบบตรวจสอบสถานะ ใช้เลขที่ใบสั่งซื้อด้านล่างเพื่อทดสอบ
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Test Orders */}
            <div className="bg-white rounded-xl shadow-lg">
              <div className="bg-gradient-to-r from-blue-600 to-blue-900 p-6 rounded-t-xl">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Package className="w-6 h-6 mr-2" />
                  เลขที่ใบสั่งซื้อสำหรับทดสอบ
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {testOrders.map((order) => (
                    <div 
                      key={order.code}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => copyToClipboard(order.code)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-mono font-semibold text-blue-600">
                            {order.code}
                          </div>
                          <div className="text-sm text-gray-600">
                            {order.description}
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'PAID' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'SHIPPING' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {order.status}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 mt-2">
                        คลิกเพื่อคัดลอก
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">วิธีใช้งาน:</h4>
                  <ol className="text-sm text-blue-800 space-y-1">
                    <li>1. คลิกที่เลขที่ใบสั่งซื้อเพื่อคัดลอก</li>
                    <li>2. ไปที่หน้าตรวจสอบสถานะ</li>
                    <li>3. วางเลขที่ใบสั่งซื้อและกดค้นหา</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg">
                <div className="bg-gradient-to-r from-green-600 to-green-900 p-6 rounded-t-xl">
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <Search className="w-6 h-6 mr-2" />
                    เริ่มทดสอบ
                  </h2>
                </div>
                <div className="p-6">
                  <Link
                    href="/paidstatus"
                    className="block w-full bg-green-600 text-white text-center py-3 px-6 rounded-lg hover:bg-green-700 transition duration-200 font-semibold"
                  >
                    ไปหน้าตรวจสอบสถานะ
                  </Link>
                  <p className="text-sm text-gray-600 mt-3 text-center">
                    หรือใช้เมนูจากแถบนำทาง
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg">
                <div className="bg-gradient-to-r from-purple-600 to-purple-900 p-6 rounded-t-xl">
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <Database className="w-6 h-6 mr-2" />
                    ข้อมูลเพิ่มเติม
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="text-sm">
                    <h4 className="font-semibold text-gray-800 mb-2">สถานะที่รองรับ:</h4>
                    <ul className="text-gray-600 space-y-1">
                      <li>• <span className="font-mono">PENDING</span> - รอดำเนินการ</li>
                      <li>• <span className="font-mono">PAID</span> - ชำระเงินแล้ว</li>
                      <li>• <span className="font-mono">SHIPPING</span> - กำลังจัดส่ง</li>
                      <li>• <span className="font-mono">COMPLETED</span> - สำเร็จ</li>
                      <li>• <span className="font-mono">CANCELLED</span> - ยกเลิก</li>
                    </ul>
                  </div>
                  
                  <div className="text-sm">
                    <h4 className="font-semibold text-gray-800 mb-2">ฟีเจอร์:</h4>
                    <ul className="text-gray-600 space-y-1">
                      <li>• แสดง Timeline สถานะ</li>
                      <li>• ข้อมูลลูกค้าและคำสั่งซื้อ</li>
                      <li>• รายการสินค้าที่สั่งซื้อ</li>
                      <li>• เลขติดตามพัสดุ (ถ้ามี)</li>
                      <li>• ที่อยู่จัดส่ง</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg">
                <div className="bg-gradient-to-r from-orange-600 to-orange-900 p-6 rounded-t-xl">
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <Code className="w-6 h-6 mr-2" />
                    API Endpoint
                  </h2>
                </div>
                <div className="p-6">
                  <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
                    GET /api/order-status?order_code=ORD-2024-101
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    สามารถใช้ API นี้เพื่อดึงข้อมูลสถานะคำสั่งซื้อได้โดยตรง
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}