// src/app/order/page.jsx
"use client";
import Navbar from './../components/Nav';
import { useState } from "react";
export default function paidstatus() {


  return (
    <div>
      <Navbar />
      <div className='min-h-screen bg-white'>
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 py-8">
       

          <div className="max-w-7xl mx-auto space-y-12">
            <section className="bg-whiterounded-lg shadow-md">
              <div className="header bg-gradient-to-bl from-blue-600 to-blue-900 p-4 rounded-t-3xl ">
                  <h2 className="text-2xl font-semibold text-white p-6 text-center">คำถามที่พบบ่อย</h2>
              </div>
              <div className="p-7">
              <ul className="space-y-4">
                <li>
                  <h3 className="font-medium text-gray-800">คำถาม 1: วิธีการสั่งซื้อสินค้าเป็นอย่างไร?</h3>
                  <p className="text-gray-600">คำตอบ: คุณสามารถเลือกสินค้าที่ต้องการและทำการสั่งซื้อผ่านทางเว็บไซต์ของเราได้เลย</p>
                </li>
                <li>
                  <h3 className="font-medium text-gray-800">คำถาม 2: มีวิธีการชำระเงินแบบไหนบ้าง?</h3>
                  <p className="text-gray-600">คำตอบ: เรามีวิธีการชำระเงินหลายรูปแบบ เช่น โอนเงินผ่านธนาคาร, บัตรเครดิต, และอื่นๆ</p>
                </li>
                <li>
                  <h3 className="font-medium text-gray-800">คำถาม 3: สินค้าของเรามีการรับประกันหรือไม่?</h3>
                  <p className="text-gray-600">คำตอบ: ใช่ เรามีการรับประกันสินค้าทุกชิ้นตามเงื่อนไขที่กำหนด</p>
                </li>
                <li>
                  <h3 className="font-medium text-gray-800">คำถาม 4: สามารถเปลี่ยนแปลงหรือยกเลิกคำสั่งซื้อได้หรือไม่?</h3>
                  <p className="text-gray-600">คำตอบ: สามารถเปลี่ยนแปลงหรือยกเลิกคำสั่งซื้อได้ภายใน 24 ชั่วโมงหลังจากที่ทำการสั่งซื้อ</p>
                </li>
                <li>
                  <h3 className="font-medium text-gray-800">คำถาม 5: หากสินค้ามีปัญหาสามารถคืนสินค้าได้หรือไม่?</h3>
                  <p className="text-gray-600">คำตอบ: สามารถคืนสินค้าได้ภายใน 7 วันหลังจากที่ได้รับสินค้า โดยสินค้าต้องอยู่ในสภาพสมบูรณ์</p>
                </li>
              </ul>
              <p className="text-gray-600">หากคุณมีคำถามเพิ่มเติม สามารถติดต่อทีมงานของเราได้ตลอดเวลา</p>

              <p className="text-gray-600">ช่องทางการติดต่อ:</p>
              <ul className="list-disc list-inside">
                <li>โทรศัพท์: 012-345-6789</li>
                <li>อีเมล: support@best-medical.com</li>
              </ul>
              </div>
            </section>
          </div>   </div>
      </div></div>
  );
}
