export default function Footter() {
  return (
    <footer className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
        
        {/* ข้อมูลร้าน */}
        <div>
          <h2 className="text-xl font-bold mb-4">บริษัท เบสท์ เมดิคัล จำกัด</h2>
          <p>
            ศูนย์รวมอุปกรณ์การแพทย์และสุขภาพครบวงจร
            พร้อมบริการจัดหาสินค้าตามความต้องการของลูกค้า
          </p>
        </div>

        {/* ลิงก์ด่วน */}
        <div>
          <h3 className="font-semibold mb-3">ลิงก์ด่วน</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">เกี่ยวกับเรา</a></li>
            <li><a href="#" className="hover:underline">วิธีการสั่งซื้อ</a></li>
            <li><a href="#" className="hover:underline">วิธีชำระเงิน</a></li>
            <li><a href="#" className="hover:underline">นโยบายการคืนสินค้า</a></li>
          </ul>
        </div>

        {/* ติดต่อเรา */}
        <div>
          <h3 className="font-semibold mb-3">ติดต่อเรา</h3>
          <p>📍 345, ตำบล เขาเจียก อำเภอเมืองพัทลุง พัทลุง 93000</p>
          <p>📞 099 478 2641</p>
          <p>✉️ best_medical@hotmail.com</p>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="font-semibold mb-3">ติดตามเรา</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-green-400">Line</a>
            <a href="#" className="hover:text-blue-400">Facebook</a>
            {/* <a href="#" className="hover:text-pink-400">Instagram</a>
            <a href="#" className="hover:text-red-400">YouTube</a> */}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-500 mt-8 pt-4 text-center text-sm">
        © 2025 Best-Medical Company – All Rights Reserved
      </div>
    </footer>
  );
}
