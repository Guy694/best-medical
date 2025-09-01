// src/app/order/page.jsx
"use client";
import Navbar from './../components/Nav';
import { useState } from "react";
export default function payment_notice() {

  const [selectedBank, setSelectedBank] = useState("krungthai");
  const banks = [
    {
      id: "krungthai",
      name: "ธนาคารกรุงไทย  สาขาเซ็นทรัลพลาซา เวสต์เกต",
      accountNumber: "660-4-49380-6",
      accountName: "บริษัท เบสท เมดิคอล จำกัด",
      logo: "/bank.png", // วางโลโก้ไว้ใน public folder
    },
    // สามารถเพิ่มธนาคารอื่นๆ ได้
  ];
  return (
    <div>
      <Navbar />
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
                  <label className="block text-gray-700 font-medium mb-1">เลขที่ใบสั่งซื้อ <span className=' text-red-500 text-xl'>*</span></label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="เลขที่ใบสั่งซื้อ"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">ชื่อ-นามสกุล <span className=' text-red-500 text-xl'>*</span></label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="กรอกชื่อ-นามสกุล"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">อีเมล <span className=' text-red-500 text-xl'>*</span></label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="กรอกอีเมล"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">เบอร์โทรศัพท์ <span className=' text-red-500 text-xl'>*</span></label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="กรอกเบอร์โทรศัพท์"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">จำนวนเงิน <span className=' text-red-500 text-xl'>*</span></label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="กรอกจำนวนเงินที่โอน"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-2">บัญชีธนาคาร <span className=' text-red-500 text-xl'>*</span></label>
                  {banks.map((bank) => (
                    <label
                      key={bank.id}
                      className={`flex items-center border rounded p-3 mb-2 cursor-pointer ${selectedBank === bank.id ? "border-blue-600" : "border-gray-300"
                        }`}
                    >
                      <input
                        type="radio"
                        name="bank"
                        value={bank.id}
                        checked={selectedBank === bank.id}
                        onChange={() => setSelectedBank(bank.id)}
                        className="mr-3"
                      />
                      <img src={bank.logo} alt={bank.name} className="w-10 h-10 mr-3" />
                      <div>
                        <p className="font-medium">{bank.name}</p>
                        <p>เลขที่บัญชี {bank.accountNumber}</p>
                        <p>ชื่อบัญชี {bank.accountName}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">หลักฐานการโอน <span className=' text-red-500 text-xl'>*</span></label>
                  <input
                    type="file"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                  <div className="flex-1">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      วันที่โอน <span className=' text-red-500 text-xl'>*</span>
                    </label>
                    <input
                      type="date"
                      id="firstName"
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>

                  <div className="flex-1">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      เวลาที่โอน <span className=' text-red-500 text-xl'>*</span>
                    </label>
                    <input
                      type="time"
                      id="lastName"
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
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
