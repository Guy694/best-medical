"use client";

import { Eye, EyeOff, Headphones, History, ShieldCheck, Truck } from "lucide-react";

const BENEFITS = [
  { icon: History, title: "ติดตามคำสั่งซื้อ", desc: "ดูประวัติและสถานะการสั่งซื้อได้ทุกที่ทุกเวลา" },
  { icon: Truck, title: "สั่งซื้อสะดวกขึ้น", desc: "ข้อมูลที่อยู่จัดส่งของคุณพร้อมใช้งานทุกครั้ง" },
  { icon: Headphones, title: "บริการหลังการขาย", desc: "ทีมงานพร้อมดูแลและให้คำปรึกษาอย่างใกล้ชิด" },
];

/** Left-hand brand panel for the login / register / forgot-password split layouts (desktop only). */
export default function AuthBrandPanel({ title, subtitle }) {
  return (
    <aside className="relative hidden overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 p-10 text-white lg:flex lg:flex-col lg:justify-between">
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-accent-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-brand-400/30 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[size:24px_24px]" />
      <div className="relative">
        <div className="inline-flex rounded-2xl bg-white p-3 shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Best Medical" className="h-10 w-auto" />
        </div>
        <h2 className="mt-8 text-3xl leading-tight font-bold">{title}</h2>
        {subtitle && <p className="mt-3 text-brand-100">{subtitle}</p>}
      </div>
      <ul className="relative mt-10 space-y-5">
        {BENEFITS.map(({ icon: Icon, title: t, desc }) => (
          <li key={t} className="flex items-start gap-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-accent-200 ring-1 ring-white/20">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold">{t}</p>
              <p className="text-sm text-brand-200">{desc}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="relative mt-10 flex items-center gap-2 text-xs text-brand-200">
        <ShieldCheck className="h-4 w-4" /> ข้อมูลของคุณถูกเข้ารหัสและเก็บรักษาอย่างปลอดภัย
      </p>
    </aside>
  );
}

/** Password input with show/hide toggle. */
export function PasswordInput({ id, show, onToggle, className = "", ...props }) {
  return (
    <div className="relative">
      <input id={id} type={show ? "text" : "password"} className={`input pr-11 ${className}`} {...props} />
      <button
        type="button"
        onClick={onToggle}
        className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        aria-label={show ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
        aria-pressed={show}
      >
        {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );
}

/** Very small password-strength estimator for UI hints only. */
export function passwordStrength(pw = "") {
  if (!pw) return { score: 0, label: "", tone: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length < 8) return { score: 1, label: "สั้นเกินไป (อย่างน้อย 8 ตัวอักษร)", tone: "bg-red-500", text: "text-red-600" };
  if (score <= 2) return { score: 2, label: "ปานกลาง", tone: "bg-amber-500", text: "text-amber-600" };
  if (score === 3) return { score: 3, label: "ดี", tone: "bg-accent-500", text: "text-accent-700" };
  return { score: 4, label: "แข็งแรงมาก", tone: "bg-emerald-500", text: "text-emerald-600" };
}

export function StrengthMeter({ password }) {
  const s = passwordStrength(password);
  if (!password) return <p className="help">ใช้อย่างน้อย 8 ตัวอักษร ผสมตัวพิมพ์ใหญ่ ตัวเลข และสัญลักษณ์เพื่อความปลอดภัย</p>;
  return (
    <div className="mt-2" aria-live="polite">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className={`h-1.5 flex-1 rounded-full ${i <= s.score ? s.tone : "bg-slate-200"}`} />
        ))}
      </div>
      <p className={`mt-1 text-xs ${s.text}`}>ความปลอดภัยของรหัสผ่าน: {s.label}</p>
    </div>
  );
}
