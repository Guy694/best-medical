// components/CookieBanner.jsx
"use client"; // จำเป็นสำหรับ Next.js App Router

import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // ตรวจสอบว่าเคยยอมรับคุกกี้แล้วหรือยัง
    if (typeof window !== "undefined") {
      const accepted = localStorage.getItem("cookiesAccepted");
      if (!accepted) setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-4 max-w-5xl w-full text-gray-800 z-50 animate-slide-up">
      <p className="text-sm md:text-base flex-1">
        เว็บไซต์นี้ใช้คุกกี้เพื่อปรับปรุงประสบการณ์ของคุณ ประมวลผลข้อมูลการใช้งาน และวิเคราะห์สถิติการเข้าชม เราอาจใช้คุกกี้เพื่อปรับเนื้อหาให้เหมาะสมกับคุณ รวมถึงโฆษณาที่ตรงกับความสนใจ การใช้เว็บไซต์ต่อไปถือว่าคุณยอมรับการใช้คุกกี้ของเรา คุณสามารถเปลี่ยนการตั้งค่าหรือยกเลิกการยอมรับได้ทุกเวลาโดยคลิกที่ปุ่ม “ตั้งค่า”
      </p>
      <div className="flex gap-2 mt-2 md:mt-0">
        <button
          onClick={handleAccept}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          ยอมรับ
        </button>
        <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-4 py-2 rounded-lg transition">
          ตั้งค่า
        </button>
      </div>
    </div>
  );
}
