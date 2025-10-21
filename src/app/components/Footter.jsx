export default function Footter() {
  return (
    <footer className="shrink-0 bg-gradient-to-r from-blue-900 to-blue-800 text-white py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 px-6">
        
        {/* ข้อมูลร้าน */}
        <div>
          <h2 className="text-xl font-bold mb-4">บริษัท เบสท เมดิคอล จำกัด</h2>
          <p>
            ศูนย์รวมอุปกรณ์การแพทย์และสุขภาพครบวงจร
            พร้อมบริการจัดหาสินค้าตามความต้องการของลูกค้า
          </p>
        </div>

        {/* ลิงก์ด่วน */}
        <div>
          <h3 className="font-semibold mb-3">เพิ่มเติม</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline">เกี่ยวกับเรา</a></li>
            <li><a href="#" className="hover:underline">วิธีการสั่งซื้อ</a></li>
            <li><a href="#" className="hover:underline">วิธีชำระเงิน</a></li>
            <li><a href="#" className="hover:underline">นโยบายการคืนสินค้า</a></li>
          </ul>
        </div>

        {/* สาขาพัทลุง */}
        <div>
          <h3 className="font-semibold mb-3">สาขาพัทลุง</h3>
          <p>🏪 345 หมู่ที่ 2 ต.เขาเจียก อ.เมือง จ.พัทลุง 93000</p>
          <p>📞 074-606-389</p>
          <p>
            <a 
              href="https://maps.app.goo.gl/zgro1tHX8LgHdqcXA" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-300 hover:underline"
            >
              ดูแผนที่
            </a>
          </p>
        </div>

        {/* สำนักงานใหญ่ */}
        <div>
          <h3 className="font-semibold mb-3">สำนักงานใหญ่</h3>
          <p>🏢 เลขที่ 83 หมู่บ้านพฤกษา 95 เอ หมู่ที่ 9 ต.บางม่วง อ.บางใหญ่ จ.นนทบุรี 11140</p>
          <p>📞 02-403-3145</p>
          <p>
            <a 
              href="https://maps.app.goo.gl/ujvLQj1d5YeWPKRw5" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-300 hover:underline"
            >
              ดูแผนที่
            </a>
          </p>
          <p>✉️ best_medical@hotmail.com</p>
        </div>
        

        {/* Social Media */}
        <div className="md:col-span-2 lg:col-span-1">
          <h3 className="font-semibold mb-3">ติดตามเรา</h3>
          <div className="flex space-x-4">
            <a 
              href="https://www.facebook.com/p/%E0%B8%9A%E0%B8%A3%E0%B8%B4%E0%B8%A9%E0%B8%B1%E0%B8%97-%E0%B9%80%E0%B8%9A%E0%B8%AA%E0%B8%97-%E0%B9%80%E0%B8%A1%E0%B8%94%E0%B8%B4%E0%B8%84%E0%B8%AD%E0%B8%A5-%E0%B8%88%E0%B8%B3%E0%B8%81%E0%B8%B1%E0%B8%94-100070566921817/"
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-400"
            >
              Facebook
            </a>
            <a href="tel:0843123061" className="hover:text-green-400">084-312-3061</a>
            <a href="tel:0809194186" className="hover:text-green-400">080-919-4186</a>
            <a href="tel:0834252332" className="hover:text-green-400">083-425-2332</a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-6">
        <p className="text-center text-sm mb-3">
          <span className="font-semibold">เวลาทำการ:</span> จันทร์ - เสาร์: 08:00 - 17:00 | อาทิตย์: ปิด
        </p>
      </div>

      <div className="border-t border-gray-500 mt-4 pt-4 text-center text-sm">
        © 2025 Best-Medical-BM – All Rights Reserved
      </div>
    </footer>
  );
}
