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
            ตรวจสอบสถานะการสั่งซื้อ
          </h1>

          <div className="max-w-7xl mx-auto space-y-12">
            <section className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">สถานะการสั่งซื้อ</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">เลขที่ใบสั่งซื้อ <span className=' text-red-500 text-xl'>*</span></label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="เลขที่ใบสั่งซื้อ"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-700 text-white px-6 py-2 rounded-md hover:bg-blue-800 transition"
                >
                  ตรวจสอบสถานะ
                </button>
              </form>
            </section>
          </div>   </div>
      </div></div>
  );
}
