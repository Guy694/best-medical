"use client";

import { useState } from "react";
import Img from "next/image";
import { Menu, X, Globe, User, ShoppingCart, Bell, Briefcase, ShieldCheck ,Search} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState("th");
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isEtcOpen, setIsEtcOpen] = useState(false);

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

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-800 shadow-lg shadow-blue-600 sticky top-0 z-30  rounded-b-3xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 xl:px-12">
        <br />
        <div className="relative flex justify-end items-center pr-3 space-x-4">
          <form action="">
            <div className="relative">
  <input
    type="text"
    className="bg-white rounded-3xl py-2 px-1 pl-10 border border-gray-300 placeholder-gray-400"
    placeholder="ค้นหาสินค้า"
  />
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
</div>
          </form>
          <Link href="/cart" className="text-white relative">
            <ShoppingCart className="h-7 w-7 text-white" />
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          </Link>
          

        </div>
        <div className="flex justify-between items-center h-22">
          {/* Logo */}
       <div className="flex items-center">
  <div className="flex-shrink-0 items-center hidden sm:block">
    <Img
      src="/logo.png"
      alt="โลโก้"
      width={120}
      height={120}
    />
  </div>
  <div className="flex-shrink-0 items-center block sm:hidden">
    <span className="text-2xl font-bold text-white">
      บริษัท เบสท เมดิคอล จำกัด
      <div>
        <small className="text-sm text-green-200">Best-Medical Company</small>
      </div>
    </span>
  </div>
</div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-12 flex items-baseline space-x-4">
              <Link
                href={currentNav.home}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === currentNav.home ? "text-green-400" : "text-white hover:text-green-400"
                  }`}
              >
                หน้าหลัก
              </Link>
              <Link
                href={currentNav.product}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === currentNav.product ? "text-green-400" : "text-white hover:text-green-400"
                  }`}
              >
                สินค้าทั้งหมด
              </Link>

              <div className="relative group">
                <button
                  className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-green-400 "
                >
                  วิธีการสั่งซื้อ/ชำระเงิน
                </button>

                {/* Dropdown */}
                <div className="absolute left-0 mt-2 w-60 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-40">
                  <Link
                    href="/howtopay"
                    className={`block px-4 py-2 text-sm ${pathname === currentNav.howtopay ? "text-green-400 font-semibold" : "text-gray-700"
                      } hover:bg-gray-100`}
                  >
                    วิธีการสั่งซื้อ/ชำระเงิน
                  </Link>
                  <Link
                    href="/paidstatus"
                    className={`block px-4 py-2 text-sm ${pathname === currentNav.paidstatus ? "text-green-400 font-semibold" : "text-gray-700"
                      } hover:bg-gray-100`}
                  >
                    ตรวจสอบสถานะการสั่งซื้อ
                  </Link>
                </div>
              </div>

              <Link
                href={currentNav.payment_notice}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === currentNav.payment_notice ? "text-green-400" : "text-white hover:text-green-400"
                  }`}
              >
                แจ้งชำระเงิน
              </Link>



              <div className="relative group">
                <button
                  className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-green-400"
                >
                  เพิ่มเติม
                </button>

                {/* Dropdown */}
                <div className="absolute left-0 mt-2 w-60 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-40">
                  <Link
                    href="/article"
                    className={`block px-4 py-2 text-sm ${pathname === currentNav.article ? "text-green-400 font-semibold" : "text-gray-700"
                      } hover:bg-gray-100`}
                  >
                    บทความและข่าวสาร
                  </Link>
                  <Link
                    href="/qa"
                    className={`block px-4 py-2 text-sm ${pathname === currentNav.qa ? "text-green-400 font-semibold" : "text-gray-700"
                      } hover:bg-gray-100`}
                  >
                    คำถามที่พบบ่อย (FAQ)
                  </Link>
                </div>
              </div>


              <Link
                href={currentNav.contact}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${pathname === currentNav.contact ? "text-green-400" : "text-white hover:text-green-400"
                  }`}
              >
                ติดต่อเรา
              </Link>


            </div>
          </div>

          {/* Right Side - Language, Login */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Selector */}


            {/* Login Button */}
            <Link
              href={currentNav.login}
              className="flex items-center bg-white text-grey-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-green-400 transition-colors"
            >
              <User className="h-4 w-4 mr-2" />

              เข้าสู่ระบบ
            </Link>

            {/* Register Button */}
            <a
              href={currentNav.register}
              className="border  text-grey-700 px-4 py-2 bg-white rounded-md text-sm font-medium hover:bg-green-400 transition-colors"
            >

              ลงทะเบียน
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-blue-600 inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gradient-to-r from-blue-900 to-blue-800 rounded-b-3xl">
              <Link
                href={currentNav.home}
                className={`block px-4 py-2 text-sm ${pathname === currentNav.home ? "text-green-400" : "text-white hover:text-green-400"
                  }`}
              >
                หน้าหลัก
              </Link>
              <Link
                href={currentNav.product}
                className={`block px-4 py-2 text-sm ${pathname === currentNav.product ? "text-green-400" : "text-white hover:text-green-400"
                  }`}
              >
                สินค้าทั้งหมด
              </Link>
              <div className=" absolute left-0 mt-2 w-60 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-40">
                <Link
                  href="/howtopay"
                  className={`block px-4 py-2 text-sm ${pathname === currentNav.howtopay ? "text-green-400 font-semibold" : "text-gray-700"
                    } hover:bg-gray-100`}
                >
                  วิธีการสั่งซื้อ/ชำระเงิน
                </Link>
                <Link
                  href="/paidstatus"
                  className={`block px-4 py-2 text-sm ${pathname === currentNav.paidstatus ? "text-green-400 font-semibold" : "text-gray-700"
                    } hover:bg-gray-100`}
                >
                  ตรวจสอบสถานะการสั่งซื้อ
                </Link>
              </div>
              <div className="relative group">
                <button
                  className="px-3 py-2 rounded-md text-sm font-medium text-white hover:text-green-400"
                >
                  เพิ่มเติม
                </button>

                {/* Dropdown */}
                <div className="absolute left-0 mt-2 w-60 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-40">
                  <Link
                    href="/article"
                    className={`block px-4 py-2 text-sm ${pathname === currentNav.article ? "text-green-400 font-semibold" : "text-gray-700"
                      } hover:bg-gray-100`}
                  >
                    บทความและข่าวสาร
                  </Link>
                  <Link
                    href="/qa"
                    className={`block px-4 py-2 text-sm ${pathname === currentNav.qa ? "text-green-400 font-semibold" : "text-gray-700"
                      } hover:bg-gray-100`}
                  >
                    คำถามที่พบบ่อย (FAQ)
                  </Link>
                </div>
              </div>
              <Link
                href={currentNav.contact}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${pathname === currentNav.contact ? "text-green-400" : "text-white hover:text-green-400"
                  }`}
              >
                ติดต่อเรา
              </Link>
              {/* Auth Buttons Mobile */}
              <div className="border-t pt-10 mt-10 flex space-x-4">
                <Link
                  href={currentNav.login}
                  className="text-grey-700 px-4 py-2 bg-white rounded-md text-sm font-medium hover:bg-green-400 transition-colors flex items-center"
                >
                  <User className="h-4 w-4 mr-2" />
                  เข้าสู่ระบบ
                </Link>
                <Link
                  href={currentNav.register}
                  className="text-grey-700 px-4 py-2 bg-white rounded-md text-sm font-medium hover:bg-green-400 transition-colors flex items-center"
                >
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  ลงทะเบียน
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
