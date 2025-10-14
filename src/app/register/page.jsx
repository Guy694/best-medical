"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Lock, User, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import Navbar from "../components/Nav";

export default function Register() {
 const [form, setForm] = useState({
   name: "",
   email: "",
   password: "",
   confirmPassword: "",
 });
 const [loading, setLoading] = useState(false);
 const [message, setMessage] = useState("");
 const [showPassword, setShowPassword] = useState(false);
 const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 const router = useRouter();
const handleChange = (e) => {
  const { name, value } = e.target;
  setForm((prev) => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (form.password !== form.confirmPassword) {
    setMessage("รหัสผ่านไม่ตรงกัน");
    return;
  }

  setLoading(true);
  setMessage("");

  try {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        name: form.name,
        email: form.email, 
        password: form.password 
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage("สมัครสมาชิกสำเร็จ! กรุณาตรวจสอบอีเมลเพื่อยืนยันตัวตน");
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      setMessage(data.error || "เกิดข้อผิดพลาด");
    }
  } catch (error) {
    setMessage("เกิดข้อผิดพลาดในการเชื่อมต่อ");
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
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">สมัครสมาชิก</h1>
              <p className="text-gray-600">สร้างบัญชีใหม่เพื่อเริ่มใช้งาน</p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-8">
                {message && (
                  <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
                    message.includes("สำเร็จ") 
                      ? "bg-green-50 border border-green-200" 
                      : "bg-red-50 border border-red-200"
                  }`}>
                    {message.includes("สำเร็จ") ? (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={message.includes("สำเร็จ") ? "text-green-700" : "text-red-700"}>
                      {message}
                    </span>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ชื่อ-นามสกุล <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        placeholder="กรอกชื่อ-นามสกุล"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-700"
                        required
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      อีเมล <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        placeholder="example@email.com"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-700"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      รหัสผ่าน <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="กรอกรหัสผ่าน"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-700"
                        required
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

                  {/* Confirm Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ยืนยันรหัสผ่าน <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="กรอกรหัสผ่านอีกครั้ง"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-700"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
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
                        <span>กำลังสมัคร...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5" />
                        <span>สมัครสมาชิก</span>
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
                    <span className="px-4 bg-white text-gray-500">มีบัญชีอยู่แล้ว?</span>
                  </div>
                </div>

                {/* Login Link */}
                <div className="text-center">
                  <button
                    onClick={() => router.push("/login")}
                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition"
                  >
                    เข้าสู่ระบบที่นี่
                  </button>
                </div>
              </div>

              {/* Footer Note */}
              <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
                <p className="text-xs text-gray-600 text-center">
                  การสมัครสมาชิกแสดงว่าคุณยอมรับ{" "}
                  <a href="#" className="text-blue-600 hover:underline">ข้อกำหนดการใช้งาน</a>
                  {" "}และ{" "}
                  <a href="#" className="text-blue-600 hover:underline">นโยบายความเป็นส่วนตัว</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
