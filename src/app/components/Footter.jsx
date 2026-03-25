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
