// src/app/order/page.jsx
"use client";
import Navbar from './../components/Nav';
import { useState } from "react";
export default function paidstatus() {


  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen relative overflow-hidden">
      {/* Decorative background patterns */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative z-10">
      <Navbar />
      <div className='min-h-screen'>
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
          </div>   
        </div>
      </div>
      </div>
    </div>
  );
}
