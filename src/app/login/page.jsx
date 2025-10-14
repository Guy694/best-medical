"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Lock, AlertCircle, Eye, EyeOff, ShieldCheck } from "lucide-react";
import Navbar from "../components/Nav";
import Image from "next/image";
import Link from "next/link";
import { sessionManager } from "../lib/sessionTimeout";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const user = sessionManager.getSession();
    if (user && !sessionManager.isSessionExpired()) {
      // User is already logged in and session is valid
      if (user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (user.role === "STAFF") {
        router.push("/staff/dashboard");
      } else {
        router.push("/user/homepage");
      }
    }
  }, [router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // ตรวจสอบสถานะการยืนยันอีเมล
        if (!data.verified) {
          setError("กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ");
          return;
        }
        
        // เก็บข้อมูล user ใน localStorage พร้อม session management
        sessionManager.setSession(data);
        
        // Redirect ตาม role
        if (data.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else if (data.role === "STAFF") {
          router.push("/staff/dashboard");
        } else {
          router.push("/user/homepage");
        }
      } else {
        setError(data.error || "เข้าสู่ระบบไม่สำเร็จ");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">เข้าสู่ระบบ</h1>
              <p className="text-gray-600">กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ</p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-8">
                {error && (
                  <div className="mb-6 p-4 rounded-xl flex items-start gap-3 bg-red-50 border border-red-200">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-red-700">{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      อีเมล <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-700"
                        placeholder="example@email.com"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      รหัสผ่าน <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-700"
                        placeholder="กรอกรหัสผ่าน"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Forgot Password Link */}
                  <div className="flex items-center justify-end">
                    <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition">
                      ลืมรหัสผ่าน?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-medium shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>กำลังเข้าสู่ระบบ...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5" />
                        <span>เข้าสู่ระบบ</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">ยังไม่มีบัญชี?</span>
                  </div>
                </div>

                {/* Register Link */}
                <div className="text-center">
                  <button
                    onClick={() => router.push("/register")}
                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition"
                  >
                    สมัครสมาชิกที่นี่
                  </button>
                </div>
              </div>

              {/* Footer Note */}
              <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
                <p className="text-xs text-gray-600 text-center">
                  🔒 ข้อมูลของคุณได้รับการปกป้องด้วยระบบความปลอดภัยที่ทันสมัย
                </p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                ต้องการความช่วยเหลือ?{" "}
                <Link href="/contact" className="text-blue-600 hover:underline">
                  ติดต่อเรา
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
