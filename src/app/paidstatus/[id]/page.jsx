"use client";
import Navbar from "@/app/components/Nav";
import { useState } from "react";

const steps = [
  { label: "สั่งซื้อวันนี้", time: "2025-09-04 10:30", status: "done" },
  { label: "กำลังดำเนิน", time: "2025-09-05 14:15", status: "done" },
  { label: "กำลังจัดส่ง", time: "2025-09-06 09:00", status: "failed" }, // ล้มเหลว
  { label: "จัดส่งใหม่", time: "2025-09-06 11:30", status: "pending" },
  { label: "จัดส่งสำเร็จ", time: "2025-09-07 16:45", status: "pending" },
];

export default function CenteredVerticalTimeline() {
  return (
    <div className="bg-grey min-h-screen">
        <Navbar />
        <br />
        <h1 className="text-2xl font-bold mb-6 text-center">สถานะการจัดซื้อ</h1>
    <div className="flex justify-center p-4 bg-white rounded-3xl shadow-md max-w-4xl mx-auto mt-10">
        
      <div className="relative w-1/2">
        {/* เส้นแนวตั้งกลาง */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full border-l-2 border-gray-300"></div>

        {/* Steps */}
        {steps.map((step, index) => {
          let bgColor = "bg-gray-300";
          let icon = index + 1;

          if (step.status === "done") bgColor = "bg-green-500";
          if (step.status === "failed") {
            bgColor = "bg-red-500";
            icon = "⚠️";
          }
          if (step.status === "pending") bgColor = "bg-yellow-500";

          return (
            <div key={index} className="mb-12 relative flex justify-center p-5">
              {/* จุดสถานะ */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${bgColor} z-10`}
              >
                {icon}
              </div>

              {/* เนื้อหา */}
              
              <div className="absolute left-1/2 transform -translate-x-1/2 mt-16 w-64 text-center">
                <p className="font-semibold text-gray-800">{step.label}</p>
                <p className="text-sm text-gray-500">{step.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div></div>
  );
}
