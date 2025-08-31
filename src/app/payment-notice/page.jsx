// src/app/order/page.jsx
import Navbar from './../components/Nav';
export default function payment_notice() {
  return (
    <div>
        <Navbar/>
        <div className='min-h-screen bg-gray-50'>
      {/* Header */}
        <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-blue-900 text-center mb-8">
        แจ้งชำระเงิน
      </h1>

      <div className="max-w-7xl mx-auto space-y-12">
        <section className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">แจ้งชำระเงิน</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">ชื่อ-นามสกุล</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="กรอกชื่อ-นามสกุล"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">อีเมล</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="กรอกอีเมล"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">เลขที่ใบสั่งซื้อ</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="กรอกเลขที่ใบสั่งซื้อ"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">ยอดเงินที่โอน</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="กรอกจำนวนเงินที่โอน"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">หลักฐานการโอน</label>
              <input
                type="file"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-700 text-white px-6 py-2 rounded-md hover:bg-blue-800 transition"
            >
              ส่งแจ้งชำระเงิน
            </button>
          </form>
        </section>
      </div>   </div>
    </div></div>
  );
}
