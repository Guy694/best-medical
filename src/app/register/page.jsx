"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Lock, Mail, MailCheck, User, UserPlus } from "lucide-react";
import { useAuth } from "@/app/components/Providers";
import { Alert, Spinner } from "@/app/components/ui";
import { api } from "@/app/lib/format";
import AuthBrandPanel, { PasswordInput, StrengthMeter } from "@/app/components/auth/AuthBrandPanel";

const EMPTY = { name: "", email: "", password: "", confirm: "" };

export default function RegisterPage() {
  const { user } = useAuth();
  const [form, setForm] = useState(EMPTY);
  const [accept, setAccept] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(null);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (!form.name.trim()) er.name = "กรุณากรอกชื่อ-นามสกุล";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) er.email = "รูปแบบอีเมลไม่ถูกต้อง";
    if (form.password.length < 8) er.password = "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร";
    if (form.confirm !== form.password) er.confirm = "รหัสผ่านทั้งสองช่องไม่ตรงกัน";
    if (!accept) er.accept = "กรุณายอมรับเงื่อนไขการใช้งานและนโยบายความเป็นส่วนตัว";
    setErrors(er);
    return !Object.keys(er).length;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting || !validate()) return;
    setSubmitting(true);
    setApiError("");
    try {
      const res = await api("/api/register", {
        method: "POST",
        body: { name: form.name.trim(), email: form.email.trim(), password: form.password },
      });
      setDone({ ...res, email: form.email.trim() });
      setForm(EMPTY);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-page py-8 sm:py-12">
      <div className="card mx-auto grid max-w-5xl animate-fade-in overflow-hidden lg:grid-cols-2">
        <AuthBrandPanel title="สมัครสมาชิกฟรี" subtitle="สร้างบัญชีเพื่อสั่งซื้อสินค้าได้สะดวกขึ้น และติดตามสถานะคำสั่งซื้อทั้งหมดในที่เดียว" />

        <div className="p-6 sm:p-10">
          {done ? (
            <div className="flex h-full flex-col items-center justify-center py-8 text-center">
              <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                {done.needVerify ? <MailCheck className="h-8 w-8" /> : <CheckCircle2 className="h-8 w-8" />}
              </span>
              <h1 className="text-2xl font-bold text-slate-900">{done.needVerify ? "กรุณาตรวจสอบอีเมลของคุณ" : "สมัครสมาชิกสำเร็จ"}</h1>
              <p className="mt-2 max-w-sm text-slate-600">{done.message}</p>
              {done.needVerify && (
                <p className="mt-3 max-w-sm text-sm text-slate-500">
                  เราได้ส่งลิงก์ยืนยันไปที่ <span className="font-medium text-slate-700">{done.email}</span> หากไม่พบ
                  กรุณาตรวจสอบในโฟลเดอร์จดหมายขยะ
                </p>
              )}
              <Link href="/login" className="btn btn-primary mt-8">
                ไปหน้าเข้าสู่ระบบ
              </Link>
            </div>
          ) : (
            <>
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                <UserPlus className="h-6 w-6" />
              </span>
              <h1 className="text-2xl font-bold text-slate-900">สมัครสมาชิก</h1>
              <p className="mt-1 text-sm text-slate-500">สร้างบัญชีใหม่เพื่อเริ่มใช้งาน</p>

              {user && (
                <Alert tone="info" className="mt-6">
                  คุณเข้าสู่ระบบอยู่แล้วในชื่อ {user.name || user.email}
                </Alert>
              )}
              {apiError && (
                <Alert tone="error" className="mt-6" title="สมัครสมาชิกไม่สำเร็จ">
                  {apiError}
                </Alert>
              )}

              <form onSubmit={onSubmit} className="mt-6 space-y-5" noValidate>
                <div>
                  <label htmlFor="name" className="label">
                    ชื่อ-นามสกุล <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      id="name"
                      name="name"
                      autoComplete="name"
                      required
                      maxLength={100}
                      value={form.name}
                      onChange={onChange}
                      className={`input pl-10 ${errors.name ? "input-error" : ""}`}
                      placeholder="กรอกชื่อ-นามสกุล"
                      aria-invalid={!!errors.name}
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="label">
                    อีเมล <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      required
                      value={form.email}
                      onChange={onChange}
                      className={`input pl-10 ${errors.email ? "input-error" : ""}`}
                      placeholder="you@example.com"
                      aria-invalid={!!errors.email}
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="label">
                    รหัสผ่าน <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute top-1/2 left-3 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <PasswordInput
                      id="password"
                      name="password"
                      autoComplete="new-password"
                      required
                      minLength={8}
                      value={form.password}
                      onChange={onChange}
                      show={showPw}
                      onToggle={() => setShowPw((s) => !s)}
                      className={`pl-10 ${errors.password ? "input-error" : ""}`}
                      placeholder="อย่างน้อย 8 ตัวอักษร"
                      aria-invalid={!!errors.password}
                    />
                  </div>
                  {errors.password ? <p className="mt-1 text-xs text-red-600">{errors.password}</p> : <StrengthMeter password={form.password} />}
                </div>

                <div>
                  <label htmlFor="confirm" className="label">
                    ยืนยันรหัสผ่าน <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute top-1/2 left-3 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <PasswordInput
                      id="confirm"
                      name="confirm"
                      autoComplete="new-password"
                      required
                      value={form.confirm}
                      onChange={onChange}
                      show={showPw}
                      onToggle={() => setShowPw((s) => !s)}
                      className={`pl-10 ${errors.confirm ? "input-error" : ""}`}
                      placeholder="กรอกรหัสผ่านอีกครั้ง"
                      aria-invalid={!!errors.confirm}
                    />
                  </div>
                  {errors.confirm ? (
                    <p className="mt-1 text-xs text-red-600">{errors.confirm}</p>
                  ) : (
                    form.confirm &&
                    form.confirm === form.password && <p className="mt-1 text-xs text-emerald-600">รหัสผ่านตรงกัน</p>
                  )}
                </div>

                <div>
                  <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={accept}
                      onChange={(e) => {
                        setAccept(e.target.checked);
                        if (errors.accept) setErrors((er) => ({ ...er, accept: undefined }));
                      }}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-700 accent-brand-700"
                      required
                    />
                    <span>
                      ฉันยอมรับเงื่อนไขการใช้งานและนโยบายความเป็นส่วนตัวของ บริษัท เบสท เมดิคอล จำกัด
                      และยินยอมให้ใช้ข้อมูลเพื่อการให้บริการและจัดส่งสินค้า
                    </span>
                  </label>
                  {errors.accept && <p className="mt-1 text-xs text-red-600">{errors.accept}</p>}
                </div>

                <button type="submit" disabled={submitting} className="btn btn-primary btn-lg w-full">
                  {submitting ? <Spinner /> : <UserPlus className="h-5 w-5" />}
                  {submitting ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-slate-600">
                มีบัญชีอยู่แล้ว?{" "}
                <Link href="/login" className="link font-medium">
                  เข้าสู่ระบบ
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
