"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex items-start justify-center p-4">
        <div className="max-w-lg w-full space-y-8">
        
          {/* Login Form */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
               <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-white rounded-full flex items-center justify-center mb-4">
              <svg
                className="h-8 w-8 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-700">เข้าสู่ระบบ</h2>
            <p className="mt-2 text-gray-600">
              กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ
            </p>
          </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500 backdrop-blur-sm border border-red-500/50 text-red-100 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-blue-950 mb-2"
                >
                  กรอกอีเมล
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3  bg-white/10 backdrop-blur-sm border rounded-3xl border-blue-700  text-blue-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="กรอกอีเมล"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-blue-900 mb-2"
                >
                  รหัสผ่าน
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-blue-700 rounded-3xl text-blue-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="กรอกรหัสผ่าน"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    กำลังเข้าสู่ระบบ...
                  </>
                ) : (
                  "เข้าสู่ระบบ"
                )}
              </button>
            </form>
              {/* <div className="my-4 text-center text-gray-700">หรือ</div>
                      <button
                        onClick={() => signIn("google")}
                        className="w-full text-gray-700 flex items-center justify-center gap-2 border border-gray-300 p-2 rounded-lg hover:bg-gray-100 transition"
                      >
                        เข้าสู่ระบบด้วย Google <Image src="/google.png" alt="Google Logo" width={20} height={20} />
                      </button> */}
            <div className="mt-6 text-center">
            
              <Link href="/forgot-password">
                <p className="text-sm text-blue-900 text-right">ลืมรหัสผ่าน</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
