"use client";
// components/Sidebar.js
import Link from "next/link";
import { sidebarMenu } from "./sidebarmenu";
import { 
  LayoutDashboard, 
  FolderTree, 
  Package, 
  FileText, 
  Users, 
  UserCheck, 
  ShoppingCart,
  X 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { sessionManager } from "@/app/lib/sessionTimeout";

// กำหนดเมนูตาม role
const getMenuByRole = (role) => {
  const adminMenu = [
    { label: 'แดชบอร์ด', href: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5 mr-2" />, color: 'blue' },
    { label: 'จัดการหมวดหมู่', href: '/admin/categories', icon: <FolderTree className="w-5 h-5 mr-2" />, color: 'purple' },
    { label: 'จัดการสินค้า', href: '/admin/product', icon: <Package className="w-5 h-5 mr-2" />, color: 'green' },
    { label: 'จัดการบทความ', href: '/admin/articles', icon: <FileText className="w-5 h-5 mr-2" />, color: 'orange' },
    { label: 'จัดการสิทธิ์พนักงาน', href: '/admin/user/staff', icon: <UserCheck className="w-5 h-5 mr-2" />, color: 'red' },
    { label: 'จัดการรายการลูกค้า', href: '/admin/user/customer', icon: <Users className="w-5 h-5 mr-2" />, color: 'indigo' },
    { label: 'จัดการออเดอร์', href: '/admin/orders', icon: <ShoppingCart className="w-5 h-5 mr-2" />, color: 'teal' },
  ];

  const staffMenu = [
    { label: 'แดชบอร์ด', href: '/admin/dashboard', icon: <LayoutDashboard className="w-5 h-5 mr-2" />, color: 'blue' },
    { label: 'จัดการหมวดหมู่', href: '/admin/categories', icon: <FolderTree className="w-5 h-5 mr-2" />, color: 'purple' },
    { label: 'จัดการสินค้า', href: '/admin/product', icon: <Package className="w-5 h-5 mr-2" />, color: 'green' },
    { label: 'จัดการบทความ', href: '/admin/articles', icon: <FileText className="w-5 h-5 mr-2" />, color: 'orange' },
    { label: 'จัดการรายการลูกค้า', href: '/admin/user/customer', icon: <Users className="w-5 h-5 mr-2" />, color: 'indigo' },
    { label: 'จัดการออเดอร์', href: '/admin/orders', icon: <ShoppingCart className="w-5 h-5 mr-2" />, color: 'teal' },
  ];

  // ใช้ตัวพิมพ์ใหญ่เพื่อให้ตรงกับ role จาก session
  return role === 'ADMIN' ? adminMenu : staffMenu;
};

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const router = useRouter();
  const [active, setActive] = useState(router?.pathname || "");
  const [userRole, setUserRole] = useState('STAFF');

  // ดึง role จาก session
  useEffect(() => {
    const userData = sessionManager.getSession();
    if (userData && userData.role) {
      setUserRole(userData.role);
    }
  }, []);

  const menuLinks = getMenuByRole(userRole);

  return (
    <aside className={`fixed z-40 top-0 left-0 min-h-screen h-full w-64 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 shadow-2xl transition-transform duration-300 md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:w-64 md:block flex flex-col`}>
      {/* Logo & Close - Mobile */}
      <div className="flex items-center justify-between p-4 border-b border-blue-700 md:hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
            <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <span className="font-bold text-lg text-white">Admin Panel</span>
            <p className="text-xs text-blue-200">{userRole === 'ADMIN' ? 'ผู้ดูแลระบบ' : 'เจ้าหน้าที่'}</p>
          </div>
        </div>
        <button 
          onClick={() => setSidebarOpen(false)} 
          className="text-white hover:text-red-400 hover:bg-white/10 rounded-lg p-1 transition-all"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Logo - Desktop */}
      <div className="hidden md:flex items-center gap-3 p-6 pb-4 border-b border-blue-700">
        <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
        </div>
        <div>
          <span className="font-bold text-xl text-white">Admin Panel</span>
          <p className="text-xs text-blue-200">{userRole === 'ADMIN' ? 'ผู้ดูแลระบบ' : 'เจ้าหน้าที่'}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {menuLinks.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 group
                  ${active === link.href 
                    ? 'bg-white text-blue-900 shadow-lg transform scale-105' 
                    : 'text-white hover:bg-white/10 hover:translate-x-1'
                  }`}
                onClick={() => setActive(link.href)}
              >
                <span className={active === link.href ? `text-${link.color}-600` : 'text-white group-hover:text-blue-200'}>
                  {link.icon}
                </span>
                <span className="text-sm">{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-blue-700">
        <div className="text-xs text-blue-200 text-center">
          <p className="font-semibold">Best Medical</p>
          <p className="opacity-70">© 2025 All Rights Reserved</p>
        </div>
      </div>
    </aside>
  );
}
