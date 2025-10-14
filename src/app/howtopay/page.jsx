// src/app/order/page.jsx
import Navbar from './../components/Nav';
export default function OrderPage() {
  return (
    <div>
        <Navbar/>
        <div className='min-h-screen bg-gray-50'>
      {/* Header */}
        <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-900 text-center mb-8">
        วิธีการสั่งซื้อ & แจ้งชำระเงิน
      </h1>

      <div className="max-w-7xl mx-auto space-y-12">
        {/* ขั้นตอนการสั่งซื้อ */}
        <section className='shadow-md rounded-xl p-6'>
          <h2 className="text-2xl font-semibold text-blue-800 mb-4 ">ขั้นตอนการสั่งซื้อ</h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li>เลือกสินค้าที่ต้องการและเพิ่มลงตะกร้า</li>
            <li>ตรวจสอบรายการสินค้าและจำนวน</li>
            <li>กรอก E-mail เพื่อส่งเลขคำสั่งซื้อ/แจ้งชำระเงิน</li>
            <li>ยืนยันการสั่งซื้อ ระบบจะส่งใบสั่งซื้อไปทางอีเมล</li>
          </ol>
        </section>

        {/* ขั้นตอนแจ้งชำระเงิน */}
        <section className='shadow-md rounded-xl p-6'>
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">ขั้นตอนแจ้งชำระเงิน</h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li>โอนเงินตามยอดที่ระบบแจ้ง</li>
            <li>บันทึกหลักฐานการโอน เช่น สลิป หรือภาพหน้าจอ</li>
            <li>กรอกฟอร์มแจ้งชำระเงินในเว็บไซต์</li>
            <li>ยืนยันการแจ้งชำระเงิน</li>
          </ol>
        </section>

        {/* ฟอร์มแจ้งชำระเงิน */}
        <section className='shadow-md rounded-xl p-6'>
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">ขั้นตอนการตรวจสอบสถานะการสั่งซื้อ</h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li>กรอกเลขที่ใบสั่งซื้อ</li>
            <li>ระบบจะแสดงข้อมูลสถานะการสั่งซื้อ</li>
          </ol>
        </section>
      </div>   </div>
    </div></div>
  );
}
