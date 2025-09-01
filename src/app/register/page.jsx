"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import bcrypt from "bcryptjs";
import Navbar from "../components/Nav";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hashedPassword = bcrypt.hashSync(password, 10);

    // เรียก API เพื่อสร้าง user
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: hashedPassword }),
    });

    if (res.ok) {
      signIn("credentials", { email, password });
    }
  };

  return (
    <div className="bg-white">
        <Navbar />
          <div className="min-h-screen bg-gray-50">
             <div className="max-w-7xl mx-auto px-4 py-8"></div>
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md justify-center mx-auto mt-10">
        <h1 className="text-2xl font-bold mb-6 text-center">สมัครสมาชิก</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg"
            required
          />
          <input
            type="password"
            placeholder="รหัสผ่าน"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg"
            required
          />
          <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition">
            สมัครด้วย Email
          </button>
        </form>
        <div className="my-4 text-center">หรือ</div>
        <button
          onClick={() => signIn("google")}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 p-2 rounded-lg hover:bg-gray-100 transition"
        >
          สมัครด้วย Google
        </button>
      </div>
    </div></div>
  );
}
