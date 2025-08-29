"use client";
// components/Sidebar.js
import Link from "next/link";
import { sidebarMenu } from "./sidebarmenu";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Sidebar({ role = "user" }) {
  const menu = sidebarMenu[role] || [];
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date()); // อัปเดตเวลาใหม่ทุกวินาที
    }, 1000);

    return () => clearInterval(timer); // ล้าง interval เมื่อ component หายไป
  }, []);

  return (
    <>
      <button
        className="md:hidden p-4 text-gray-700"
        onClick={() => setOpen(!open)}
      >
        <Menu size={24} />
      </button>

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-6 transition-transform z-40
        ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:block`}
      >
        <div className="text-2xl font-bold mb-4">ระบบระบสมัครงาน</div>
        <div className="text-sm text-gray-400 mb-6">
          <p className="text-white">ผู้ใช้ : นายชาคริต ทองนวล</p>s
          <p className="text-white ">
            ตำแหน่ง : {role === "admin" ? "ผู้ดูแลระบบ" : "ผู้ใช้ทั่วไป"}
          </p>
          <p className="text-white">
            วันที่ : {new Date().toLocaleDateString()}
          </p>
          <p className="text-white">เวลา : {time.toLocaleTimeString()}</p>
        </div>

        <div className="bg-white bg-opacity-20 text-gray-800 font-bold py-2 px-4 rounded mb-4 w-full">
          เมนู
        </div>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {menu.map((item, i) => (
            <li key={i} style={{ marginBottom: "1rem" }}>
              <Link
                href={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                }}
              >
                <span style={{ marginRight: "0.5rem" }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
