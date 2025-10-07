"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import bcrypt from "bcryptjs";
import Navbar from "../components/Nav";

export default function Register() {
 const [form, setForm] = useState({
   name: "",
   email: "",
   password: "",
   confirmPassword: "",
 });
const handleChange = (e) => {
  const { name, value } = e.target;
  setForm((prev) => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e) => {
  e.preventDefault();
  if (form.password !== form.confirmPassword) {
    alert("รหัสผ่านไม่ตรงกัน");
    return;
  }
  const hashedPassword = bcrypt.hashSync(form.password, 10);

  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: form.email, password: hashedPassword }),
  });

  if (res.ok) {
    signIn("credentials", { email: form.email, password: form.password });
  }
};

  return (
    <div className="bg-white">
        <Navbar />
          <div className="min-h-screen bg-gray-50">
             <div className="max-w-7xl mx-auto px-4 py-8"></div>
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md justify-center mx-auto mt-10 text-gray-700">
        <h1 className="text-2xl font-bold mb-6 text-center">สมัครสมาชิก</h1>
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
          <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition">
            สมัครสมาชิก
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
