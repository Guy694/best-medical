"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Lock, LogIn, Mail } from "lucide-react";
import { useAuth } from "@/app/components/Providers";
import { Alert, PageLoader, Spinner } from "@/app/components/ui";
import AuthBrandPanel, { PasswordInput } from "@/app/components/auth/AuthBrandPanel";

const VERIFY_BANNERS = {
  success: { tone: "success", title: "ยืนยันอีเมลสำเร็จ", text: "บัญชีของคุณพร้อมใช้งานแล้ว กรุณาเข้าสู่ระบบ" },
  invalid: { tone: "error", title: "ลิงก์ยืนยันไม่ถูกต้อง", text: "ลิงก์ยืนยันอีเมลไม่ถูกต้อง หมดอายุ หรือถูกใช้งานไปแล้ว" },
  error: { tone: "error", title: "ยืนยันอีเมลไม่สำเร็จ", text: "เกิดข้อผิดพลาดระหว่างยืนยันอีเมล กรุณาลองใหม่อีกครั้ง" },
};

const safeNext = (next) => (next && next.startsWith("/") && !next.startsWith("//") ? next : null);
const homeFor = (u) => (u?.role === "ADMIN" || u?.role === "STAFF" ? "/admin/dashboard" : "/user/history");

function LoginContent() {
  const params = useSearchParams();
  const { user, loading, login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [needVerify, setNeedVerify] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const next = safeNext(params.get("next"));
  const verified = VERIFY_BANNERS[params.get("verified")];

  // already logged in → go away
  useEffect(() => {
    if (!loading && user && !redirecting) {
      setRedirecting(true);
      window.location.replace(next || homeFor(user));
    }
  }, [loading, user, next, redirecting]);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");
    setNeedVerify(false);
    try {
      const u = await login(form.email.trim(), form.password);
      setRedirecting(true);
      window.location.replace(next || homeFor(u));
    } catch (err) {
      if (err.data?.needVerify) setNeedVerify(true);
      else setError(err.message);
      setSubmitting(false);
    }
  };

  if (loading || redirecting || user) {
    return <PageLoader label={loading ? "กำลังโหลด..." : "กำลังพาคุณไปยังหน้าถัดไป..."} />;
  }

  return (
    <div className="container-page py-8 sm:py-12">
      <div className="card mx-auto grid max-w-5xl animate-fade-in overflow-hidden lg:grid-cols-2">
        <AuthBrandPanel
          title="ยินดีต้อนรับกลับมา"
          subtitle="เข้าสู่ระบบเพื่อติดตามคำสั่งซื้อและจัดการข้อมูลบัญชีของคุณกับ บริษัท เบสท เมดิคอล จำกัด"
        />

        <div className="p-6 sm:p-10">
          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
            <LogIn className="h-6 w-6" />
          </span>
          <h1 className="text-2xl font-bold text-slate-900">เข้าสู่ระบบ</h1>
          <p className="mt-1 text-sm text-slate-500">กรอกอีเมลและรหัสผ่านของคุณเพื่อดำเนินการต่อ</p>

          <div className="mt-6 space-y-3 empty:hidden">
            {verified && (
              <Alert tone={verified.tone} title={verified.title}>
                {verified.text}
              </Alert>
            )}
            {params.get("expired") === "1" && (
              <Alert tone="warning" title="เซสชันหมดอายุ">
                คุณไม่ได้ใช้งานเป็นเวลานาน ระบบจึงออกจากระบบให้อัตโนมัติ กรุณาเข้าสู่ระบบอีกครั้ง
              </Alert>
            )}
            {params.get("reset") === "1" && (
              <Alert tone="success" title="ตั้งรหัสผ่านใหม่สำเร็จ">
                กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่ของคุณ
              </Alert>
            )}
            {next && !error && !needVerify && <Alert tone="info">กรุณาเข้าสู่ระบบเพื่อเข้าถึงหน้าที่คุณต้องการ</Alert>}
            {needVerify && (
              <Alert tone="warning" title="ยังไม่ได้ยืนยันอีเมล">
                กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ โดยคลิกลิงก์ที่เราส่งไปยังกล่องจดหมายของคุณ (ตรวจสอบในโฟลเดอร์จดหมายขยะด้วย)
              </Alert>
            )}
            {error && (
              <Alert tone="error" title="เข้าสู่ระบบไม่สำเร็จ">
                {error}
              </Alert>
            )}
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-5">
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
                  autoFocus
                  value={form.email}
                  onChange={onChange}
                  className="input pl-10"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between gap-2">
                <label htmlFor="password" className="label">
                  รหัสผ่าน <span className="text-red-500">*</span>
                </label>
                <Link href="/forgot-password" className="link mb-1.5 text-sm">
                  ลืมรหัสผ่าน?
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute top-1/2 left-3 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <PasswordInput
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={onChange}
                  show={showPw}
                  onToggle={() => setShowPw((s) => !s)}
                  className="pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button type="submit" disabled={submitting} className="btn btn-primary btn-lg w-full">
              {submitting ? <Spinner /> : <LogIn className="h-5 w-5" />}
              {submitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            ยังไม่มีบัญชี?{" "}
            <Link href="/register" className="link font-medium">
              สมัครสมาชิก
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <LoginContent />
    </Suspense>
  );
}
