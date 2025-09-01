"use client";

import { useState } from "react";
import Img from "next/image";
import { Menu, X, Globe, User, ShoppingCart, Bell, Briefcase, ShieldCheck } from "lucide-react";
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

  const navItems = {
    th: {
      home: "/",
      product: "/product",
      howtopay: "/howtopay",
      payment_notice: "/payment-notice",
      etc: "เพิ่มเติม",
      contact: "ติดต่อเรา",
      login: "เข้าสู่ระบบ",
      register: "สมัครสมาชิก",
    },
  };

  const currentNav = navItems[language];

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-800 shadow-lg sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 xl:px-12">
        <br />
        <div className="relative flex justify-end items-center pr-3">
          <ShoppingCart className="h-7 w-7 text-white" />
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span>

        </div>
        <div className="flex justify-between items-center h-22">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Img
                src="/logo.png"
                alt="โลโก้"
                width={200}
                height={200}
              ></Img>
              {/* <span className="text-xl font-bold text-gray-800">
                เบสท อุปกรณ์การแพทย์
                <div>
                  <small>Best-Medical Company</small>
                </div>
              </span> */}
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
                หน้าแรก
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
                <div className="absolute left-0 mt-2 w-60 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
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
                <div className="absolute left-0 mt-2 w-60 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
                  <Link
                    href="/aricle"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    บทความและข่าวสาร
                  </Link>
                  <Link
                    href="/question"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    คำถามที่พบบ่อย (FAQ)
                  </Link>
                </div>
              </div>

              <Link
                href="/contact"
                className="text-white hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {currentNav.contact}
              </Link>
            </div>
          </div>

          {/* Right Side - Language, Login */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={toggleLangDropdown}
                className="flex items-center text-white hover:text-green-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {/* <Globe className="h-4 w-4 mr-1" />
                {language === "th" ? "ไทย" : "EN"} */}
              </button>
              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-24 bg-white rounded-md shadow-lg py-1 z-10">
                  <button
                    onClick={() => toggleLanguage("th")}
                    className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${language === "th"
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700"
                      }`}
                  >
                    ไทย
                  </button>
                  <button
                    onClick={() => toggleLanguage("en")}
                    className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${language === "en"
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700"
                      }`}
                  >
                    English
                  </button>
                </div>
              )}
            </div>

            {/* Login Button */}
            <Link
              href="/login"
              className="flex items-center bg-white text-grey-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-green-400 transition-colors"
            >
              <User className="h-4 w-4 mr-2" />
              {currentNav.login}
            </Link>
            {/* Register Button */}
            {/* <a
              href="/register"
              className="border border-blue-600 text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              {currentNav.register}
            </a> */}
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
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
              <a
                href="/"
                className="text-white hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
              >
                {currentNav.home}
              </a>
              <a
                href="/jobs"
                className="text-white hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
              >
                {currentNav.jobs}
              </a>
              <a
                href="/news"
                className="text-white hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
              >
                {currentNav.news}
              </a>
              <a
                href="/about"
                className="text-white hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
              >
                {currentNav.about}
              </a>
              <a
                href="/contact"
                className="text-white hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
              >
                {currentNav.contact}
              </a>

              {/* Language Toggle Mobile */}
              {/* <div className="border-t pt-3 mt-3">
                <button
                  onClick={() =>
                    toggleLanguage(language === "th" ? "en" : "th")
                  }
                  className="flex items-center text-white hover:text-green-400 px-3 py-2 rounded-md text-base font-medium w-full"
                >
                  <Globe className="h-5 w-5 mr-2" />
                  {language === "th" ? "English" : "ภาษาไทย"}
                </button>
              </div> */}

              {/* Auth Buttons Mobile */}
              <div className="border-t pt-3 mt-3 space-y-2">
                <a
                  href="/login"
                  className="flex items-center bg-blue-600 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition-colors"
                >
                  <User className="h-5 w-5 mr-2" />
                  {currentNav.login}
                </a>
                <a
                  href="/register"
                  className="flex items-center border border-blue-600 text-blue-600 px-3 py-2 rounded-md text-base font-medium hover:bg-blue-50 transition-colors"
                >
                  {currentNav.register}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
