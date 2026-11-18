"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, History, KeyRound, Save, UserCog } from "lucide-react";
import { useAuth, useToast } from "@/app/components/Providers";
import { Alert, Field, PageHeader, PageLoader, Spinner } from "@/app/components/ui";
import { api, cn, formatDate } from "@/app/lib/format";

function PasswordInput({ id, value, onChange, autoComplete, error }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        className={cn("input pr-10", error && "input-error")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:text-slate-600"
        aria-label={show ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

export default function ProfilePage() {
  const { user, loading: authLoading, refresh } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const [account, setAccount] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [pw, setPw] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [pwErrors, setPwErrors] = useState({});
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login?next=/user/profile");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    let alive = true;
    api("/api/account")
      .then((a) => {
        if (!alive) return;
        setAccount(a);
        setForm({ name: a.name || "", phone: a.phone || "", address: a.address || "" });
      })
      .catch((err) => alive && setLoadError(err.message));
    return () => {
      alive = false;
    };
  }, [user]);

  const setField = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    if (saving) return;
    const errs = {};
    if (!form.name.trim()) errs.name = "กรุณากรอกชื่อ-นามสกุล";
    if (form.phone && !/^0\d{9}$/.test(form.phone)) errs.phone = "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก ขึ้นต้นด้วย 0";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSaving(true);
    try {
      const res = await api("/api/account", {
        method: "PUT",
        body: { name: form.name.trim(), phone: form.phone, address: form.address.trim() },
      });
      toast.success(res?.message || "บันทึกข้อมูลเรียบร้อย");
      setAccount((a) => ({ ...a, ...form }));
      await refresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (pwSaving) return;
    const errs = {};
    if (!pw.currentPassword) errs.currentPassword = "กรุณากรอกรหัสผ่านปัจจุบัน";
    if (pw.newPassword.length < 8) errs.newPassword = "รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร";
    else if (pw.newPassword === pw.currentPassword) errs.newPassword = "รหัสผ่านใหม่ต้องไม่ซ้ำกับรหัสผ่านเดิม";
    if (pw.confirm !== pw.newPassword) errs.confirm = "ยืนยันรหัสผ่านไม่ตรงกัน";
    setPwErrors(errs);
    if (Object.keys(errs).length) return;
    setPwSaving(true);
    try {
      // the API requires name/phone/address on every update – send the saved values
      await api("/api/account", {
        method: "PUT",
        body: {
          name: account?.name || form.name.trim(),
          phone: account?.phone || "",
          address: account?.address || "",
          currentPassword: pw.currentPassword,
          newPassword: pw.newPassword,
        },
      });
      toast.success("เปลี่ยนรหัสผ่านเรียบร้อย");
      setPw({ currentPassword: "", newPassword: "", confirm: "" });
      await refresh();
    } catch (err) {
      if (/รหัสผ่านปัจจุบัน/.test(err.message)) setPwErrors({ currentPassword: err.message });
      else toast.error(err.message);
    } finally {
      setPwSaving(false);
    }
  };

  if (authLoading || (user && !account && !loadError)) return <PageLoader />;
  if (!user) return <PageLoader label="กำลังไปหน้าเข้าสู่ระบบ..." />;

  return (
    <div>
      <PageHeader
        title="ข้อมูลส่วนตัว"
        subtitle="จัดการข้อมูลบัญชีและรหัสผ่านของคุณ"
        icon={UserCog}
        breadcrumb={[{ label: "หน้าแรก", href: "/" }, { label: "ข้อมูลส่วนตัว" }]}
      >
        <Link href="/user/history" className="btn btn-secondary btn-sm">
          <History className="h-4 w-4" /> ประวัติการสั่งซื้อ
        </Link>
      </PageHeader>

      <div className="container-page grid gap-6 py-8 lg:grid-cols-5 lg:items-start">
        {loadError && (
          <Alert tone="error" className="lg:col-span-5">
            {loadError}
          </Alert>
        )}

        <form onSubmit={saveProfile} noValidate className="card card-body space-y-5 lg:col-span-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">ข้อมูลบัญชี</h2>
            {account?.createdAt && <p className="text-sm text-slate-500">สมาชิกตั้งแต่ {formatDate(account.createdAt)}</p>}
          </div>
          <Field label="อีเมล" help="ไม่สามารถเปลี่ยนอีเมลได้">
            <input type="email" className="input bg-slate-50 text-slate-500" value={account?.email || user.email || ""} readOnly disabled />
          </Field>
          <Field label="ชื่อ-นามสกุล" required error={errors.name}>
            <input
              className={cn("input", errors.name && "input-error")}
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              autoComplete="name"
              maxLength={100}
              required
            />
          </Field>
          <Field label="เบอร์โทรศัพท์" error={errors.phone} help="ตัวเลข 10 หลัก เช่น 0812345678">
            <input
              type="tel"
              inputMode="numeric"
              className={cn("input", errors.phone && "input-error")}
              value={form.phone}
              onChange={(e) => setField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
              autoComplete="tel"
              placeholder="0812345678"
            />
          </Field>
          <Field label="ที่อยู่สำหรับจัดส่ง" help={`${form.address.length}/191 ตัวอักษร`}>
            <textarea
              rows={3}
              className="input"
              value={form.address}
              onChange={(e) => setField("address", e.target.value)}
              autoComplete="street-address"
              maxLength={191}
              placeholder="บ้านเลขที่ ถนน ตำบล อำเภอ จังหวัด รหัสไปรษณีย์"
            />
          </Field>
          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary" disabled={saving || !account}>
              {saving ? <Spinner className="h-4 w-4" /> : <Save className="h-4 w-4" />}
              {saving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
            </button>
          </div>
        </form>

        <form onSubmit={changePassword} noValidate className="card card-body space-y-5 lg:col-span-2">
          <div className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-brand-600" />
            <h2 className="text-lg font-semibold text-slate-900">เปลี่ยนรหัสผ่าน</h2>
          </div>
          <Field label="รหัสผ่านปัจจุบัน" required error={pwErrors.currentPassword}>
            <PasswordInput
              id="pw-current"
              value={pw.currentPassword}
              onChange={(v) => setPw((p) => ({ ...p, currentPassword: v }))}
              autoComplete="current-password"
              error={pwErrors.currentPassword}
            />
          </Field>
          <Field label="รหัสผ่านใหม่" required error={pwErrors.newPassword} help="อย่างน้อย 8 ตัวอักษร">
            <PasswordInput
              id="pw-new"
              value={pw.newPassword}
              onChange={(v) => setPw((p) => ({ ...p, newPassword: v }))}
              autoComplete="new-password"
              error={pwErrors.newPassword}
            />
          </Field>
          <Field label="ยืนยันรหัสผ่านใหม่" required error={pwErrors.confirm}>
            <PasswordInput
              id="pw-confirm"
              value={pw.confirm}
              onChange={(v) => setPw((p) => ({ ...p, confirm: v }))}
              autoComplete="new-password"
              error={pwErrors.confirm}
            />
          </Field>
          <button type="submit" className="btn btn-accent w-full" disabled={pwSaving || !account}>
            {pwSaving ? <Spinner className="h-4 w-4" /> : <KeyRound className="h-4 w-4" />}
            {pwSaving ? "กำลังบันทึก..." : "เปลี่ยนรหัสผ่าน"}
          </button>
        </form>
      </div>
    </div>
  );
}
