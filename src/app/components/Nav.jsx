"use client";

import { useState } from "react";
import Img from "next/image";
import { Menu, X, Globe, User, Bell, Briefcase } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState("th");
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

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
      home: "หน้าแรก",
      product: "สินค้าทั้งหมด",
      howtopay: "วิธีการสั่งซื้อ/ชำระเงิน",
      alert: "แจ้งการชำระเงิน",
      etc: "เพิ่มเติม",
      contact: "ติดต่อเรา",
      login: "เข้าสู่ระบบ",
      register: "สมัครสมาชิก",
    },
  };

  const currentNav = navItems[language];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-10">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="flex justify-between items-center h-25">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Img
                src="/logo.png"
                alt="โลโก้"
                width={200}
                height={200}
              ></Img>
              <span className="text-xl font-bold text-gray-800">
                เบส อุปกรณ์การแพทย์
                <div>
                  <small>Best-Medical</small>
                </div>
              </span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {currentNav.home}
              </Link>
              <Link
                href="/product"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {currentNav.product}
              </Link>
              <Link
                href="/howtopay"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {currentNav.howtopay}
              </Link>
              <Link
                href="/alert"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {currentNav.alert}
              </Link>
               <Link
                href="/etc"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {currentNav.etc}
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
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
                className="flex items-center text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {/* <Globe className="h-4 w-4 mr-1" />
                {language === "th" ? "ไทย" : "EN"} */}
              </button>
              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-2 w-24 bg-white rounded-md shadow-lg py-1 z-10">
                  <button
                    onClick={() => toggleLanguage("th")}
                    className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${
                      language === "th"
                        ? "text-blue-600 font-semibold"
                        : "text-gray-700"
                    }`}
                  >
                    ไทย
                  </button>
                  <button
                    onClick={() => toggleLanguage("en")}
                    className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${
                      language === "en"
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
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
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
              className="text-gray-700 hover:text-blue-600 inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
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
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
              >
                {currentNav.home}
              </a>
              <a
                href="/jobs"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
              >
                {currentNav.jobs}
              </a>
              <a
                href="/news"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
              >
                {currentNav.news}
              </a>
              <a
                href="/about"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
              >
                {currentNav.about}
              </a>
              <a
                href="/contact"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
              >
                {currentNav.contact}
              </a>

              {/* Language Toggle Mobile */}
              {/* <div className="border-t pt-3 mt-3">
                <button
                  onClick={() =>
                    toggleLanguage(language === "th" ? "en" : "th")
                  }
                  className="flex items-center text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium w-full"
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
