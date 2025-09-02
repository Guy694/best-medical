// src/app/order/page.jsx
"use client";
import Navbar from './../components/Nav';
import { useState } from "react";
export default function paidstatus() {


  return (
    <div>
      <Navbar />
      <div className='min-h-screen bg-gray-50'>
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-blue-900 text-center mb-8">
            บทความและข่าวสาร
          </h1>

          <div className="max-w-7xl mx-auto space-y-12">
            <section className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">บทความและข่าวสาร</h2>

              <p className="text-gray-600">ยินดีต้อนรับสู่ส่วนบทความและข่าวสารของเรา ที่นี่คุณจะพบกับข้อมูลที่เป็นประโยชน์และข่าวสารล่าสุดเกี่ยวกับสุขภาพและการดูแลตัวเอง</p>
              <ul className="list-disc list-inside">
                <li>บทความ 1: วิธีการดูแลสุขภาพในช่วงฤดูฝน</li>
                <li>บทความ 2: 5 เคล็ดลับในการเลือกซื้ออุปกรณ์การแพทย์</li>
                <li>ข่าวสาร: โปรโมชั่นพิเศษสำหรับลูกค้าใหม่</li>
              </ul>
              <p className="text-gray-600">หากคุณต้องการข้อมูลเพิ่มเติมเกี่ยวกับบทความหรือข่าวสาร สามารถติดต่อทีมงานของเราได้ตลอดเวลา</p>
              <p className="text-gray-600">ช่องทางการติดต่อ:</p>
              <ul className="list-disc list-inside">
                <li>โทรศัพท์: 012-345-6789</li>
                <li>อีเมล: support@best-medical.com</li>
              </ul>

              <p className="text-gray-600">เรายินดีให้บริการคุณเสมอ</p>
            </section>
          </div>   </div>
      </div></div>
  );
}
