// src/app/order/page.jsx
"use client";
import Navbar from './../components/Nav';
import { useState } from "react";
import dayjs from "dayjs";

const orderpurchase = {
  ordercode: "68006554", time: "2025-09-04 10:30",
};



function formatThaiDate(dateStr) {
  const d = dayjs(dateStr);
  const buddhistYear = d.year() + 543;
  return d.format(`DD/MM/${buddhistYear} HH:mm`);
}
export default function orderNumber() {


  return (
    <div>
      <Navbar />
      <div className='min-h-screen bg-gray-50'>
        
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-blue-900 text-center mb-8">
            เลขคำสั่งซื้อคือ
          </h1>

          <div className="max-w-7xl mx-auto space-y-12 justify-center text-center ">
            {orderpurchase.map((order,index  ) => (
            <section key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-red-600 mb-4">{order.ordercode }</h2>
              <h4 className=" text-gray-800 mb-4">คำสั่งซื้อวันที่ {formatThaiDate(order.time)}</h4>
                <h4 className="text-gray-700"><span className='text-red-600 font-bold'>หมายเหตุ : </span>กรุณาบันทึกหน้าจอเพื่อเป็นหลักฐานในการสั่งซื้อและใช้เลขคำสั่งซื้อในการชำระสินค้า</h4>
                <h4 className="text-gray-700">ระบบได้ดำเนินการส่งเลขคำสั่งซื้อไปยัง E-mail ของท่านแล้วเพื่อสำรองข้อมูลในกรณีเกิดข้อผิดพลาด</h4>
            </section>
              ))}
          </div>   </div>
      </div></div>
  
  
  );
}
