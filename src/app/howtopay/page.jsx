// src/app/order/page.jsx
import Navbar from './../components/Nav';
import { CheckCircle, CreditCard, ShoppingCart, Mail, FileText, ArrowRight } from "lucide-react";

export default function OrderPage() {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl p-10 mb-10 text-white text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <ShoppingCart className="w-12 h-12" />
            <h1 className="text-4xl md:text-5xl font-bold">วิธีการสั่งซื้อ & แจ้งชำระเงิน</h1>
            <p className="text-blue-100 text-lg mt-2">ขั้นตอนง่ายๆ สะดวก รวดเร็ว ปลอดภัย</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* ขั้นตอนการสั่งซื้อ */}
          <section className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <ShoppingCart className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-semibold text-blue-800">ขั้นตอนการสั่งซื้อ</h2>
            </div>
            <ol className="space-y-4 mt-4">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span className='text-gray-700'>เลือกสินค้าที่ต้องการและเพิ่มลงตะกร้า</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span className='text-gray-700'>ตรวจสอบรายการสินค้าและจำนวน</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-6 h-6 text-blue-500" />
                <span className='text-gray-700'>กรอก E-mail เพื่อรับเลขคำสั่งซื้อ/แจ้งชำระเงิน</span>
              </li>
              <li className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-purple-500" />
                <span className='text-gray-700'>ยืนยันการสั่งซื้อ ระบบจะส่งใบสั่งซื้อไปทางอีเมล</span>
              </li>
            </ol>
          </section>

          {/* ขั้นตอนแจ้งชำระเงิน */}
          <section className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-8 h-8 text-pink-600" />
              <h2 className="text-2xl font-semibold text-blue-800">ขั้นตอนแจ้งชำระเงิน</h2>
            </div>
            <ol className="space-y-4 mt-4">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span className='text-gray-700'>โอนเงินตามยอดที่ระบบแจ้ง</span>
              </li>
              <li className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-purple-500" />
                <span className='text-gray-700'>บันทึกหลักฐานการโอน เช่น สลิป หรือภาพหน้าจอ</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-6 h-6 text-blue-500" />
                <span className='text-gray-700'>กรอกฟอร์มแจ้งชำระเงินในเว็บไซต์</span>
              </li>
              <li className="flex items-center gap-3">
                <ArrowRight className="w-6 h-6 text-blue-600" />
                <span className='text-gray-700'>ยืนยันการแจ้งชำระเงิน</span>
              </li>
            </ol>
          </section>

          {/* ขั้นตอนตรวจสอบสถานะ */}
          <section className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-8 h-8 text-yellow-600" />
              <h2 className="text-2xl font-semibold text-blue-800">ขั้นตอนการตรวจสอบสถานะการสั่งซื้อ</h2>
            </div>
            <ol className="space-y-4 mt-4">
              <li className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span className='text-gray-700'>กรอกเลขที่ใบสั่งซื้อ</span>
              </li>
              <li className="flex items-center gap-3">
                <ArrowRight className="w-6 h-6 text-blue-600" />
                <span className='text-gray-700'>ระบบจะแสดงข้อมูลสถานะการสั่งซื้อ</span>
              </li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
