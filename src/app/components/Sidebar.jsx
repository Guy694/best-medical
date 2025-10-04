"use client";
// components/Sidebar.js
import Link from "next/link";
import { sidebarMenu } from "./sidebarmenu";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const sidebarLinks = [
  { label: 'แดชบอร์ด', href: '/admin/dashboard', icon: <Menu className="w-5 h-5 mr-2" /> },
  { label: 'จัดการสินค้า', href: '/admin/product', icon: <Menu className="w-5 h-5 mr-2" /> },
  { label: 'จัดการผู้ใช้', href: '/admin/users', icon: <Menu className="w-5 h-5 mr-2" /> },
  { label: 'ออเดอร์', href: '/admin/orders', icon: <Menu className="w-5 h-5 mr-2" /> },
  { label: 'คูปอง', href: '/admin/coupons', icon: <Menu className="w-5 h-5 mr-2" /> },
];

export default function Sidebar({ role = "user", sidebarOpen, setSidebarOpen }) {
  const router = useRouter();
  const [active, setActive] = useState(router?.pathname || "");
  return (
  <aside className={`fixed z-10 top-0 left-0 min-h-screen h-full w-64 bg-white shadow-2xl transition-transform duration-300 md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:w-64 md:block flex flex-col`}>
      {/* Logo & Close */}
      <div className="flex items-center justify-between p-4 border-b border-blue-800 md:hidden">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full shadow" />
          <span className="font-bold text-lg text-gray-800">Admin</span>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="text-white hover:text-red-400 text-2xl">×</button>
      </div>
      {/* Logo desktop */}
      <div className="hidden md:flex items-center gap-2 p-6 pb-2">
        <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full shadow" />
  <span className="font-bold text-lg text-gray-800">Admin</span>
      </div>
      <nav className="p-6 pt-6 flex-1">
        <ul className="space-y-4">
          {sidebarLinks.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-150
                  ${active === link.href ? 'bg-blue-100 text-blue-900 shadow' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-900'}`}
                onClick={() => setActive(link.href)}
              >
                {link.icon}
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {/* Footer */}
      <div className="p-4 text-xs text-gray-400 text-center opacity-70">
       
      </div>
    </aside>
  );
}
