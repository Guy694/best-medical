"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, KeyRound, Lock, Mail, MailCheck } from "lucide-react";
import { Alert, PageLoader, Spinner } from "@/app/components/ui";
import { api } from "@/app/lib/format";
import AuthBrandPanel, { PasswordInput, StrengthMeter } from "@/app/components/auth/AuthBrandPanel";

function Done({ icon: Icon, title, message, children }) {
  return (
    <div className="flex flex-col items-center py-8 text-center">
      <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
        <Icon className="h-8 w-8" />
      </span>
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mt-2 max-w-sm text-slate-600">{message}</p>
      <div className="mt-8">{children}</div>
    </div>
  );
}

function RequestForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await api("/api/auth/forgot", { method: "POST", body: { email: email.trim() } });
      setMessage(res?.message || "หากอีเมลนี้มีอยู่ในระบบ เราได้ส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปให้แล้ว");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (message) {
    return (
      <Done icon={MailCheck} title="ตรวจสอบอีเมลของคุณ" message={message}>
        <p className="mb-6 text-sm text-slate-500">ลิงก์มีอายุ 1 ชั่วโมง หากไม่พบอีเมล กรุณาตรวจสอบในโฟลเดอร์จดหมายขยะ</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/login" className="btn btn-primary">
            กลับไปหน้าเข้าสู่ระบบ
          </Link>
          <button type="button" className="btn btn-secondary" onClick={() => setMessage("")}>
            ส่งอีกครั้ง
          </button>
        </div>
      </Done>
    );
  }

  return (
    <>
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
        <KeyRound className="h-6 w-6" />
      </span>
      <h1 className="text-2xl font-bold text-slate-900">ลืมรหัสผ่าน</h1>
      <p className="mt-1 text-sm text-slate-500">กรอกอีเมลที่ใช้สมัครสมาชิก เราจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปให้</p>

      {error && (
        <Alert tone="error" className="mt-6">
          {error}
        </Alert>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-5">
        <div>
          <label htmlFor="email" className="label">
            อีเมล <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input pl-10"
              placeholder="you@example.com"
            />
          </div>
        </div>
        <button type="submit" disabled={submitting} className="btn btn-primary btn-lg w-full">
          {submitting ? <Spinner /> : <Mail className="h-5 w-5" />}
          {submitting ? "กำลังส่ง..." : "ส่งลิงก์ตั้งรหัสผ่านใหม่"}
        </button>
      </form>
    </>
  );
}

function ResetForm({ token }) {
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    const er = {};
    if (form.password.length < 8) er.password = "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร";
    if (form.confirm !== form.password) er.confirm = "รหัสผ่านทั้งสองช่องไม่ตรงกัน";
    setErrors(er);
    if (Object.keys(er).length) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await api("/api/auth/reset", { method: "POST", body: { token, password: form.password } });
      setMessage(res?.message || "ตั้งรหัสผ่านใหม่เรียบร้อยแล้ว กรุณาเข้าสู่ระบบ");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (message) {
    return (
      <Done icon={CheckCircle2} title="ตั้งรหัสผ่านใหม่สำเร็จ" message={message}>
        <Link href="/login?reset=1" className="btn btn-primary">
          เข้าสู่ระบบ
        </Link>
      </Done>
    );
  }

  return (
    <>
      <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
        <Lock className="h-6 w-6" />
      </span>
      <h1 className="text-2xl font-bold text-slate-900">ตั้งรหัสผ่านใหม่</h1>
      <p className="mt-1 text-sm text-slate-500">กำหนดรหัสผ่านใหม่สำหรับบัญชีของคุณ</p>

      {error && (
        <Alert tone="error" className="mt-6" title="ตั้งรหัสผ่านไม่สำเร็จ">
          {error}
          {"\n"}
          <Link href="/forgot-password" className="font-medium underline">
            ขอลิงก์ใหม่
          </Link>
        </Alert>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-5" noValidate>
        <div>
          <label htmlFor="password" className="label">
            รหัสผ่านใหม่ <span className="text-red-500">*</span>
          </label>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="new-password"
            required
            minLength={8}
            autoFocus
            value={form.password}
            onChange={onChange}
            show={showPw}
            onToggle={() => setShowPw((s) => !s)}
            className={errors.password ? "input-error" : ""}
            placeholder="อย่างน้อย 8 ตัวอักษร"
            aria-invalid={!!errors.password}
          />
          {errors.password ? <p className="mt-1 text-xs text-red-600">{errors.password}</p> : <StrengthMeter password={form.password} />}
        </div>
        <div>
          <label htmlFor="confirm" className="label">
            ยืนยันรหัสผ่านใหม่ <span className="text-red-500">*</span>
          </label>
          <PasswordInput
            id="confirm"
            name="confirm"
            autoComplete="new-password"
            required
            value={form.confirm}
            onChange={onChange}
            show={showPw}
            onToggle={() => setShowPw((s) => !s)}
            className={errors.confirm ? "input-error" : ""}
            placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
            aria-invalid={!!errors.confirm}
          />
          {errors.confirm && <p className="mt-1 text-xs text-red-600">{errors.confirm}</p>}
        </div>
        <button type="submit" disabled={submitting} className="btn btn-primary btn-lg w-full">
          {submitting ? <Spinner /> : <KeyRound className="h-5 w-5" />}
          {submitting ? "กำลังบันทึก..." : "บันทึกรหัสผ่านใหม่"}
        </button>
      </form>
    </>
  );
}

function ForgotContent() {
  const token = useSearchParams().get("token");
  return (
    <div className="container-page py-8 sm:py-12">
      <div className="card mx-auto grid max-w-5xl animate-fade-in overflow-hidden lg:grid-cols-2">
        <AuthBrandPanel
          title={token ? "ตั้งรหัสผ่านใหม่" : "ลืมรหัสผ่าน?"}
          subtitle="ไม่ต้องกังวล เพียงไม่กี่ขั้นตอนคุณก็สามารถกลับมาใช้งานบัญชีได้ตามปกติ"
        />
        <div className="p-6 sm:p-10">
          {token ? <ResetForm token={token} /> : <RequestForm />}
          <p className="mt-8 text-center text-sm">
            <Link href="/login" className="link inline-flex items-center gap-1 font-medium">
              <ArrowLeft className="h-4 w-4" /> กลับไปหน้าเข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ForgotContent />
    </Suspense>
  );
}
