"use client";

import { useState, useEffect } from "react";
import Img from "next/image";
import { Menu, X, Globe, User, ShoppingCart, Bell, Briefcase, ShieldCheck ,Search} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { sessionManager, useSession } from "../lib/sessionTimeout";

const getRole = () => {
  const user = sessionManager.getSession();
  return user && !sessionManager.isSessionExpired() ? user.role : null;
};

const getUser = () => {
  const user = sessionManager.getSession();
  return user && !sessionManager.isSessionExpired() ? user : null;
};

const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState("th");
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isEtcOpen, setIsEtcOpen] = useState(false);
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [remainingTime, setRemainingTime] = useState(30);

  const toggleEtc = () => setIsEtcOpen(!isEtcOpen);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleLanguage = (lang) => {
    setLanguage(lang);
    setIsLangDropdownOpen(false);
  };

  const toggleLangDropdown = () => {
    setIsLangDropdownOpen(!isLangDropdownOpen);
  };
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const cart = Cookies.get("cart") ? JSON.parse(Cookies.get("cart")) : [];
    // รวมจำนวนทั้งหมด
    const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    setCartCount(total);
  }, []);

  useEffect(() => {
    setRole(getRole());
    setUser(getUser());

    // Initialize session management
    sessionManager.initializeSession();
    sessionManager.setupActivityListeners();

    // Update remaining time every minute
    const timeInterval = setInterval(() => {
      const remaining = sessionManager.getRemainingTime();
      setRemainingTime(remaining);
      
      // Warning when 5 minutes remaining
      if (remaining === 5) {
        alert('เซสชันของคุณจะหมดอายุใน 5 นาที');
      }
    }, 60000); // Check every minute

    return () => {
      clearInterval(timeInterval);
      sessionManager.stopSessionMonitoring();
    };
  }, []);

  const navItems = {
    th: {
      home: "/",
      product: "/product",
      howtopay: "/howtopay",
      payment_notice: "/payment-notice",
      article: "/article",
      contact: "/contact",
      login: "/login",
      register: "/register",
      paidstatus: "/paidstatus",
    },
  };

  const currentNav = navItems[language];

  // เมนูสำหรับแต่ละ role
  const customerMenu = (
    <>
      <Link href={currentNav.home}>หน้าหลัก</Link>
      <Link href={currentNav.product}>สินค้าทั้งหมด</Link>
      <Link href={currentNav.howtopay}>วิธีการสั่งซื้อ/ชำระเงิน</Link>
      <Link href={currentNav.payment_notice}>แจ้งชำระเงิน</Link>
      <Link href={currentNav.article}>บทความและข่าวสาร</Link>
      <Link href={currentNav.contact}>ติดต่อเรา</Link>
    </>
  );

  const staffMenu = (
    <>
      <Link href="/admin/dashboard">แดชบอร์ดพนักงาน</Link>
      <Link href="/admin/user/staff">จัดการพนักงาน</Link>
      <Link href={currentNav.product}>สินค้าทั้งหมด</Link>
      <Link href={currentNav.article}>บทความและข่าวสาร</Link>
      <Link href={currentNav.contact}>ติดต่อเรา</Link>
    </>
  );

  const adminMenu = (
    <>
      <Link href="/admin/dashboard">แดชบอร์ดแอดมิน</Link>
      <Link href="/admin/user/staff">จัดการพนักงาน</Link>
      <Link href="/admin/user/customer">จัดการลูกค้า</Link>
      <Link href={currentNav.product}>สินค้าทั้งหมด</Link>
      <Link href={currentNav.article}>บทความและข่าวสาร</Link>
      <Link href={currentNav.contact}>ติดต่อเรา</Link>
    </>
  );

  // เลือกเมนูตาม role
  let menu;
  if (role === "ADMIN") menu = adminMenu;
  else if (role === "STAFF") menu = staffMenu;
  else menu = customerMenu;

  // ฟังก์ชัน logout
  const handleLogout = () => {
    sessionManager.logout();
  };

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-800 shadow-2xl sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar - Cart & Search for Customer/Guest only */}
        {role !== "ADMIN" && role !== "STAFF" && (
          <div className="flex justify-end items-center py-3 border-b border-blue-500/30">
            <div className="flex items-center space-x-4">
              <Link 
                href="/cart" 
                className="relative group"
              >
                <div className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full transition-all duration-300">
                  <ShoppingCart className="h-5 w-5 text-white" />
                  <span className="text-white text-sm font-medium hidden sm:inline">ตะกร้า</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse shadow-lg">
                      {cartCount}
                    </span>
                  )}
                </div>
              </Link>
            </div>
          </div>
        )} 
        
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 hidden sm:block">
              <Img
                src="/logo.png"
                alt="โลโก้"
                width={100}
                height={100}
                className="drop-shadow-lg"
              />
            </div>
            <div className="flex-shrink-0 block sm:hidden">
              <div className="text-white">
                <h1 className="text-xl font-bold leading-tight">
                  เบสท เมดิคอล
                </h1>
                <p className="text-xs text-blue-200">Best-Medical</p>
              </div>
            </div>
          </div>

          {/* Desktop Menu - แสดงเฉพาะสำหรับ customer/guest */}
          {role !== "ADMIN" && role !== "STAFF" && (
            <div className="hidden lg:block">
              <div className="flex items-center space-x-1">
                <Link
                  href={currentNav.home}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname === currentNav.home 
                      ? "bg-white/20 text-white backdrop-blur-sm shadow-lg" 
                      : "text-blue-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  หน้าหลัก
                </Link>
                <Link
                  href={currentNav.product}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname === currentNav.product 
                      ? "bg-white/20 text-white backdrop-blur-sm shadow-lg" 
                      : "text-blue-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  สินค้าทั้งหมด
                </Link>

                <div className="relative group">
                  <button className="px-4 py-2 rounded-lg text-sm font-medium text-blue-100 hover:bg-white/10 hover:text-white transition-all duration-200 flex items-center">
                    วิธีการสั่งซื้อ/ชำระเงิน
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-gray-100">
                    <Link
                      href="/howtopay"
                      className={`block px-5 py-3 text-sm ${
                        pathname === currentNav.howtopay 
                          ? "text-blue-600 bg-blue-50 font-semibold" 
                          : "text-gray-700 hover:bg-gray-50"
                      } transition-colors`}
                    >
                      วิธีการสั่งซื้อ/ชำระเงิน
                    </Link>
                    <Link
                      href="/paidstatus"
                      className={`block px-5 py-3 text-sm ${
                        pathname === currentNav.paidstatus 
                          ? "text-blue-600 bg-blue-50 font-semibold" 
                          : "text-gray-700 hover:bg-gray-50"
                      } transition-colors`}
                    >
                      ตรวจสอบสถานะการสั่งซื้อ
                    </Link>
                  </div>
                </div>

                <Link
                  href={currentNav.payment_notice}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname === currentNav.payment_notice 
                      ? "bg-white/20 text-white backdrop-blur-sm shadow-lg" 
                      : "text-blue-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  แจ้งชำระเงิน
                </Link>

                <div className="relative group">
                  <button className="px-4 py-2 rounded-lg text-sm font-medium text-blue-100 hover:bg-white/10 hover:text-white transition-all duration-200 flex items-center">
                    เพิ่มเติม
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-gray-100">
                    <Link
                      href="/article"
                      className={`block px-5 py-3 text-sm ${
                        pathname === currentNav.article 
                          ? "text-blue-600 bg-blue-50 font-semibold" 
                          : "text-gray-700 hover:bg-gray-50"
                      } transition-colors`}
                    >
                      บทความและข่าวสาร
                    </Link>
                  </div>
                </div>

                <Link
                  href={currentNav.contact}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname === currentNav.contact 
                      ? "bg-white/20 text-white backdrop-blur-sm shadow-lg" 
                      : "text-blue-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  ติดต่อเรา
                </Link>
              </div>
            </div>
          )}

          {/* Right Side - Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {!user ? (
              <>
                <Link
                  href={currentNav.login}
                  className="flex items-center bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 border border-white/20"
                >
                  <User className="h-4 w-4 mr-2" />
                  เข้าสู่ระบบ
                </Link>
                <Link
                  href={currentNav.register}
                  className="flex items-center bg-white text-blue-600 px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-all duration-300 shadow-lg"
                >
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  ลงทะเบียน
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                  <User className="h-4 w-4 mr-2 text-white" />
                  <span className="text-white font-medium text-sm">{user.name}</span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-lg"
                >
                  ออกจากระบบ
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          {role !== "ADMIN" && role !== "STAFF" && (
            <div className="lg:hidden">
              <button
                onClick={toggleMenu}
                className="text-white hover:bg-white/10 inline-flex items-center justify-center p-2 rounded-lg transition-all duration-200"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          )}

          {/* Mobile auth section for Admin/Staff */}
          {(role === "ADMIN" || role === "STAFF") && (
            <div className="lg:hidden flex items-center space-x-2">
              {user && (
                <button 
                  onClick={handleLogout} 
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-medium transition-all duration-300"
                >
                  ออกจากระบบ
                </button>
              )}
            </div>
          )}
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && role !== "ADMIN" && role !== "STAFF" && (
          <div className="lg:hidden border-t border-blue-500/30">
            <div className="px-4 pt-4 pb-6 space-y-2">
              <Link
                href={currentNav.home}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === currentNav.home 
                    ? "bg-white/20 text-white" 
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                หน้าหลัก
              </Link>
              <Link
                href={currentNav.product}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === currentNav.product 
                    ? "bg-white/20 text-white" 
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                สินค้าทั้งหมด
              </Link>
             
              <div className="space-y-1">
                <div className="px-4 py-2 text-xs font-semibold text-blue-200 uppercase">วิธีการสั่งซื้อ/ชำระเงิน</div>
                <Link
                  href="/howtopay"
                  className={`block px-6 py-2 rounded-lg text-sm transition-all duration-200 ${
                    pathname === currentNav.howtopay 
                      ? "bg-white/20 text-white" 
                      : "text-blue-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  วิธีการสั่งซื้อ/ชำระเงิน
                </Link>
                <Link
                  href="/paidstatus"
                  className={`block px-6 py-2 rounded-lg text-sm transition-all duration-200 ${
                    pathname === currentNav.paidstatus 
                      ? "bg-white/20 text-white" 
                      : "text-blue-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  ตรวจสอบสถานะการสั่งซื้อ
                </Link>
              </div>

              <Link
                href={currentNav.payment_notice}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === currentNav.payment_notice 
                    ? "bg-white/20 text-white" 
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                แจ้งชำระเงิน
              </Link>

              <div className="space-y-1">
                <div className="px-4 py-2 text-xs font-semibold text-blue-200 uppercase">เพิ่มเติม</div>
                <Link
                  href="/article"
                  className={`block px-6 py-2 rounded-lg text-sm transition-all duration-200 ${
                    pathname === currentNav.article 
                      ? "bg-white/20 text-white" 
                      : "text-blue-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  บทความและข่าวสาร
                </Link>
              </div>

              <Link
                href={currentNav.contact}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === currentNav.contact 
                    ? "bg-white/20 text-white" 
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                ติดต่อเรา
              </Link>

              {/* Auth Buttons Mobile */}
              <div className="border-t border-blue-500/30 pt-4 mt-4 space-y-2">
                {!user ? (
                  <>
                    <Link
                      href={currentNav.login}
                      className="flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 border border-white/20"
                    >
                      <User className="h-4 w-4 mr-2" />
                      เข้าสู่ระบบ
                    </Link>
                    <Link
                      href={currentNav.register}
                      className="flex items-center justify-center bg-white text-blue-600 px-4 py-3 rounded-lg text-sm font-medium hover:bg-blue-50 transition-all duration-300"
                    >
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      ลงทะเบียน
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/20">
                      <User className="h-4 w-4 mr-2 text-white" />
                      <span className="text-white font-medium">{user.name}</span>
                    </div>
                    <button 
                      onClick={handleLogout} 
                      className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300"
                    >
                      ออกจากระบบ
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
