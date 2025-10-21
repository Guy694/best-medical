"use client";
import Navbar from '../components/Nav';
import Link from 'next/link';
import { CreditCard, Database, TestTube, Copy, Info, CheckCircle } from 'lucide-react';

export default function PaymentTestPage() {
  const testOrders = [
    { 
      code: 'ORD-2024-101', 
      status: 'PENDING', 
      customer: 'นาย ทดสอบ ระบบ',
      email: 'test@example.com',
      amount: 1250.00
    },
    { 
      code: 'ORD-2024-102', 
      status: 'PENDING', 
      customer: 'นางสาว สมหญิง ใจดี',
      email: 'somying@example.com',
      amount: 2800.00
    },
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
              ทดสอบระบบแจ้งชำระเงิน
            </h1>
            <p className="text-gray-600">
              หน้านี้สำหรับทดสอบระบบแจ้งชำระเงิน ใช้ข้อมูลด้านล่างเพื่อทดสอบ
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Test Data */}
            <div className="bg-white rounded-xl shadow-lg">
              <div className="bg-gradient-to-r from-blue-600 to-blue-900 p-6 rounded-t-xl">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Database className="w-6 h-6 mr-2" />
                  ข้อมูลทดสอบ
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {testOrders.map((order) => (
                    <div key={order.code} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>เลขที่ใบสั่งซื้อ:</strong>
                          <div 
                            className="font-mono text-blue-600 cursor-pointer hover:bg-blue-50 p-1 rounded"
                            onClick={() => copyToClipboard(order.code)}
                          >
                            {order.code} <Copy className="w-3 h-3 inline ml-1" />
                          </div>
                        </div>
                        <div>
                          <strong>สถานะ:</strong>
                          <div className="text-yellow-600">{order.status}</div>
                        </div>
                        <div>
                          <strong>ชื่อลูกค้า:</strong>
                          <div 
                            className="cursor-pointer hover:bg-blue-50 p-1 rounded"
                            onClick={() => copyToClipboard(order.customer)}
                          >
                            {order.customer} <Copy className="w-3 h-3 inline ml-1" />
                          </div>
                        </div>
                        <div>
                          <strong>อีเมล:</strong>
                          <div 
                            className="cursor-pointer hover:bg-blue-50 p-1 rounded"
                            onClick={() => copyToClipboard(order.email)}
                          >
                            {order.email} <Copy className="w-3 h-3 inline ml-1" />
                          </div>
                        </div>
                        <div className="col-span-2">
                          <strong>ยอดที่ต้องชำระ:</strong>
                          <div 
                            className="text-green-600 font-semibold cursor-pointer hover:bg-green-50 p-1 rounded"
                            onClick={() => copyToClipboard(order.amount.toString())}
                          >
                            ฿{order.amount.toLocaleString()} <Copy className="w-3 h-3 inline ml-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                    <Info className="w-4 h-4 mr-1" />
                    วิธีทดสอบ:
                  </h4>
                  <ol className="text-sm text-blue-800 space-y-1">
                    <li>1. คลิกที่ข้อมูลเพื่อคัดลอก</li>
                    <li>2. ไปที่หน้าแจ้งชำระเงิน</li>
                    <li>3. วางข้อมูลในฟอร์ม</li>
                    <li>4. กรอกวันที่และเวลาปัจจุบัน</li>
                    <li>5. กดยืนยันการแจ้งชำระ</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Features & Instructions */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg">
                <div className="bg-gradient-to-r from-green-600 to-green-900 p-6 rounded-t-xl">
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <CreditCard className="w-6 h-6 mr-2" />
                    เริ่มทดสอบ
                  </h2>
                </div>
                <div className="p-6">
                  <Link
                    href="/payment-notice"
                    className="block w-full bg-green-600 text-white text-center py-3 px-6 rounded-lg hover:bg-green-700 transition duration-200 font-semibold"
                  >
                    ไปหน้าแจ้งชำระเงิน
                  </Link>
                  <p className="text-sm text-gray-600 mt-3 text-center">
                    หรือใช้เมนูจากแถบนำทาง
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg">
                <div className="bg-gradient-to-r from-purple-600 to-purple-900 p-6 rounded-t-xl">
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <CheckCircle className="w-6 h-6 mr-2" />
                    ระบบตรวจสอบ
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="text-sm">
                    <h4 className="font-semibold text-gray-800 mb-2">การตรวจสอบข้อมูล:</h4>
                    <ul className="text-gray-600 space-y-1">
                      <li>• เลขที่ใบสั่งซื้อต้องมีอยู่ในระบบ</li>
                      <li>• ชื่อลูกค้าต้องตรงกับในใบสั่งซื้อ</li>
                      <li>• อีเมลต้องตรงกับในใบสั่งซื้อ</li>
                      <li>• จำนวนเงินต้องตรงกับยอดรวม</li>
                      <li>• สถานะต้องเป็น PENDING</li>
                    </ul>
                  </div>
                  
                  <div className="text-sm">
                    <h4 className="font-semibold text-gray-800 mb-2">หลังจากแจ้งชำระ:</h4>
                    <ul className="text-gray-600 space-y-1">
                      <li>• สถานะเปลี่ยนเป็น PAID</li>
                      <li>• บันทึกวันที่และเวลาโอน</li>
                      <li>• บันทึกข้อมูลการแจ้งชำระ</li>
                      <li>• ตรวจสอบได้ที่หน้าสถานะ</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg">
                <div className="bg-gradient-to-r from-orange-600 to-orange-900 p-6 rounded-t-xl">
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <Database className="w-6 h-6 mr-2" />
                    ข้อมูลเพิ่มเติม
                  </h2>
                </div>
                <div className="p-6">
                  <div className="text-sm space-y-3">
                    <div>
                      <strong>API Endpoint:</strong>
                      <div className="bg-gray-100 p-2 rounded font-mono text-xs mt-1">
                        POST /api/payment-notice
                      </div>
                    </div>
                    
                    <div>
                      <strong>Database Tables:</strong>
                      <ul className="text-gray-600 mt-1">
                        <li>• <code>order</code> - อัพเดตสถานะและข้อมูลการชำระ</li>
                        <li>• <code>payment_notifications</code> - Log การแจ้งชำระ</li>
                      </ul>
                    </div>

                    <div>
                      <strong>ข้อมูลบัญชีธนาคาร:</strong>
                      <div className="bg-gray-50 p-2 rounded mt-1 text-xs">
                        <div>ธนาคารกรุงไทย</div>
                        {/* <div>เลขที่: 660-4-49380-6</div> */}
                        <div>เลขที่: </div>
                        <div>ชื่อ: บริษัท เบสท เมดิคอล จำกัด</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-xs text-yellow-800">
                      <strong>หมายเหตุ:</strong> ก่อนทดสอบให้รันคำสั่ง SQL ใน 
                      <code className="bg-yellow-100 px-1 rounded mx-1">payment_notice_schema.sql</code> 
                      เพื่อเพิ่ม columns ที่จำเป็น
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}