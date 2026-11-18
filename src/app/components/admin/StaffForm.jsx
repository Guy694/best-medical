"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, KeyRound, Save, ShieldAlert, UserCog, UserX } from "lucide-react";
import { useAuth, useToast } from "@/app/components/Providers";
import { Alert, EmptyState, Field, PageLoader, Spinner } from "@/app/components/ui";
import { FormSection, StickyActions } from "@/app/components/admin/FormParts";
import { api } from "@/app/lib/format";

const EMPTY = { name: "", email: "", phone: "", address: "", role: "STAFF", password: "", confirm: "" };

/** Shared add / edit form for staff accounts (ADMIN only). `staffId` → edit mode. */
export default function StaffForm({ staffId }) {
  const isEdit = Boolean(staffId);
  const router = useRouter();
  const toast = useToast();
  const { user, isAdmin } = useAuth();
  const submitting = useRef(false);

  const [form, setForm] = useState(EMPTY);
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);

  const isSelf = isEdit && Number(staffId) === Number(user?.id);

  useEffect(() => {
    if (!isEdit || !isAdmin) return;
    let alive = true;
    api(`/api/admin/user/staff/${staffId}`)
      .then((s) => {
        if (!alive) return;
        setForm({
          ...EMPTY,
          name: s.name || "",
          email: s.email || "",
          phone: s.phone || "",
          address: s.address || "",
          role: s.role === "ADMIN" ? "ADMIN" : "STAFF",
        });
      })
      .catch((err) => alive && setLoadError(err.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [isEdit, isAdmin, staffId]);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (!form.name.trim()) er.name = "กรุณากรอกชื่อ";
    if (!form.email.trim()) er.email = "กรุณากรอกอีเมล";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) er.email = "รูปแบบอีเมลไม่ถูกต้อง";
    if (form.phone && !/^0\d{8,9}$/.test(form.phone.replace(/[\s-]/g, ""))) er.phone = "เบอร์โทรศัพท์ไม่ถูกต้อง (เช่น 0812345678)";
    if (!["ADMIN", "STAFF"].includes(form.role)) er.role = "กรุณาเลือกสิทธิ์การใช้งาน";
    if (!isEdit && !form.password) er.password = "กรุณากำหนดรหัสผ่าน";
    if (form.password && form.password.length < 8) er.password = "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร";
    if (form.password && form.password !== form.confirm) er.confirm = "รหัสผ่านทั้งสองช่องไม่ตรงกัน";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting.current) return;
    setApiError("");
    if (!validate()) return;
    submitting.current = true;
    setSaving(true);
    try {
      const body = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.replace(/[\s-]/g, ""),
        address: form.address.trim(),
        role: form.role,
      };
      if (form.password) body.password = form.password;
      const res = await api(isEdit ? `/api/admin/user/staff/${staffId}` : "/api/admin/user/staff", {
        method: isEdit ? "PUT" : "POST",
        body,
      });
      toast.success(res?.message || "บันทึกข้อมูลพนักงานเรียบร้อย");
      router.push("/admin/user/staff");
    } catch (err) {
      setApiError(err.message);
      toast.error(err.message);
      submitting.current = false;
      setSaving(false);
    }
  };

  if (!isAdmin)
    return (
      <div className="card">
        <EmptyState icon={ShieldAlert} title="เฉพาะผู้ดูแลระบบ" description="คุณไม่มีสิทธิ์จัดการบัญชีพนักงาน" />
      </div>
    );
  if (loading) return <PageLoader label="กำลังโหลดข้อมูลพนักงาน..." />;
  if (loadError)
    return (
      <div className="card">
        <EmptyState
          icon={UserX}
          title="ไม่สามารถโหลดข้อมูลได้"
          description={loadError}
          action={
            <Link href="/admin/user/staff" className="btn btn-primary">
              กลับไปหน้ารายชื่อพนักงาน
            </Link>
          }
        />
      </div>
    );

  const pwType = showPw ? "text" : "password";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      {apiError && (
        <Alert tone="error" title="บันทึกไม่สำเร็จ">
          {apiError}
        </Alert>
      )}

      <FormSection title="ข้อมูลพนักงาน" icon={UserCog}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="ชื่อ-นามสกุล" required error={errors.name} className="sm:col-span-2">
            <input
              className={`input ${errors.name ? "input-error" : ""}`}
              value={form.name}
              onChange={set("name")}
              maxLength={100}
              required
              autoComplete="name"
            />
          </Field>
          <Field label="อีเมล (ใช้เข้าสู่ระบบ)" required error={errors.email}>
            <input
              type="email"
              inputMode="email"
              className={`input ${errors.email ? "input-error" : ""}`}
              value={form.email}
              onChange={set("email")}
              required
              autoComplete="off"
              placeholder="name@example.com"
            />
          </Field>
          <Field label="เบอร์โทรศัพท์" error={errors.phone}>
            <input
              type="tel"
              inputMode="tel"
              className={`input ${errors.phone ? "input-error" : ""}`}
              value={form.phone}
              onChange={set("phone")}
              maxLength={12}
              autoComplete="off"
              placeholder="0812345678"
            />
          </Field>
          <Field label="ที่อยู่" className="sm:col-span-2">
            <textarea className="input" rows={2} value={form.address} onChange={set("address")} maxLength={191} />
          </Field>
          <Field
            label="สิทธิ์การใช้งาน"
            required
            error={errors.role}
            className="sm:col-span-2"
            help={
              isSelf
                ? "ไม่สามารถลดสิทธิ์บัญชีของตัวเองได้"
                : form.role === "ADMIN"
                  ? "ผู้ดูแลระบบ: จัดการได้ทุกส่วน รวมถึงบัญชีพนักงาน"
                  : "เจ้าหน้าที่: จัดการคำสั่งซื้อ สินค้า หมวดหมู่ บทความ และลูกค้า"
            }
          >
            <select className="input" value={form.role} onChange={set("role")} required disabled={isSelf}>
              <option value="STAFF">เจ้าหน้าที่</option>
              <option value="ADMIN">ผู้ดูแลระบบ</option>
            </select>
          </Field>
        </div>
      </FormSection>

      <FormSection
        title={isEdit ? "เปลี่ยนรหัสผ่าน" : "รหัสผ่าน"}
        icon={KeyRound}
        description={isEdit ? "เว้นว่างไว้หากไม่ต้องการเปลี่ยน" : "รหัสผ่านอย่างน้อย 8 ตัวอักษร"}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label={isEdit ? "รหัสผ่านใหม่" : "รหัสผ่าน"}
            required={!isEdit}
            error={errors.password}
            help={isEdit ? "เว้นว่างไว้หากไม่ต้องการเปลี่ยน" : "อย่างน้อย 8 ตัวอักษร"}
          >
            <div className="relative">
              <input
                type={pwType}
                className={`input pr-11 ${errors.password ? "input-error" : ""}`}
                value={form.password}
                onChange={set("password")}
                required={!isEdit}
                minLength={8}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:text-slate-600"
                aria-label={showPw ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </Field>
          <Field label="ยืนยันรหัสผ่าน" required={!isEdit || Boolean(form.password)} error={errors.confirm}>
            <input
              type={pwType}
              className={`input ${errors.confirm ? "input-error" : ""}`}
              value={form.confirm}
              onChange={set("confirm")}
              autoComplete="new-password"
              disabled={isEdit && !form.password}
            />
          </Field>
        </div>
      </FormSection>

      <StickyActions>
        <Link href="/admin/user/staff" className={`btn btn-secondary ${saving ? "pointer-events-none opacity-60" : ""}`}>
          ยกเลิก
        </Link>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? <Spinner className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saving ? "กำลังบันทึก..." : isEdit ? "บันทึกการเปลี่ยนแปลง" : "เพิ่มพนักงาน"}
        </button>
      </StickyActions>
    </form>
  );
}
