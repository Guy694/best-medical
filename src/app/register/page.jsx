"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
    <div className="bg-white">
        <Navbar />
          <div className="min-h-screen bg-gray-50">
             <div className="max-w-7xl mx-auto px-4 py-8"></div>
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md justify-center mx-auto mt-10 text-gray-700">
        <h1 className="text-2xl font-bold mb-6 text-center">สมัครสมาชิก</h1>
        
        {message && (
          <div className={`mb-4 p-3 rounded-lg text-center ${
            message.includes("สำเร็จ") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="ชื่อ-นามสกุล"
            value={form.name}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-lg" required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-lg"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="รหัสผ่าน"
            value={form.password}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-lg"
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="ยืนยันรหัสผ่าน"
            value={form.confirmPassword}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded-lg"
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
          </button>
        </form>
        {/* <div className="my-4 text-center">หรือ</div>
        <button
          onClick={() => signIn("google")}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 p-2 rounded-lg hover:bg-gray-100 transition"
        >
          สมัครด้วย Google
        </button> */}
      </div>
    </div></div>
  );
}
