"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, CreditCard, ImagePlus, Info, ListChecks, Search, Upload, X } from "lucide-react";
import { useAuth } from "@/app/components/Providers";
import { Alert, Field, PageHeader, PageLoader, Spinner, StatusBadge } from "@/app/components/ui";
import { BankCard } from "@/app/components/order/OrderParts";
import { api, cn, formatTHB } from "@/app/lib/format";

const MAX_SIZE = 5 * 1024 * 1024;
const ACCEPT = ["image/jpeg", "image/png", "image/gif", "image/webp"];

const TIPS = [
  "โอนเงินตามยอดที่ระบุในใบสั่งซื้อ",
  "กรอกข้อมูลให้ตรงกับใบสั่งซื้อ (เลขที่ใบสั่งซื้อและอีเมลที่ใช้สั่งซื้อ)",
  "ระบุวันที่และเวลาที่โอนให้ถูกต้อง พร้อมแนบสลิป",
  "ระบบจะตรวจสอบและอัปเดตสถานะภายใน 24 ชั่วโมง",
];

const localToday = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const EMPTY = {
  order_code: "",
  fullName: "",
  order_email: "",
  order_phone: "",
  shippingAddress: "",
  totalPrice: "",
  transfer_date: "",
  transfer_time: "",
};

function PaymentNoticeContent() {
  const sp = useSearchParams();
  const { user } = useAuth();
  const fileRef = useRef(null);

  const [form, setForm] = useState(() => ({
    ...EMPTY,
    order_code: (sp.get("order") || "").trim().toUpperCase(),
    totalPrice: sp.get("amount") && Number(sp.get("amount")) > 0 ? String(Number(sp.get("amount"))) : "",
  }));
  const [today, setToday] = useState("");
  const [slip, setSlip] = useState(null);
  const [preview, setPreview] = useState("");
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(null);
  const [lookup, setLookup] = useState({ loading: false, order: null, error: "", code: "" });

  const set = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  // fill only empty fields
  const prefill = useCallback(
    (data) =>
      setForm((f) => {
        const next = { ...f };
        for (const [k, v] of Object.entries(data)) if (v && !next[k]) next[k] = String(v);
        return next;
      }),
    []
  );

  useEffect(() => {
    setToday(localToday());
  }, []);

  useEffect(() => {
    if (!user) return;
    prefill({ fullName: user.name, order_email: user.email, order_phone: user.phone, shippingAddress: user.address });
    let alive = true;
    api("/api/account")
      .then((a) => alive && prefill({ fullName: a.name, order_email: a.email, order_phone: a.phone, shippingAddress: a.address }))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [user, prefill]);

  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  const checkOrder = async (raw) => {
    const code = String(raw || "").trim().toUpperCase();
    if (!code || code === lookup.code) return;
    setLookup({ loading: true, order: null, error: "", code });
    try {
      const o = await api(`/api/orders/${encodeURIComponent(code)}`);
      setLookup({ loading: false, order: o, error: "", code });
      prefill({ totalPrice: o.totalPrice, order_email: o.order_email, fullName: o.fullName, order_phone: o.order_phone, shippingAddress: o.shippingAddress });
    } catch (err) {
      setLookup({ loading: false, order: null, error: err.message, code });
    }
  };

  useEffect(() => {
    if (form.order_code) checkOrder(form.order_code);
    // run once for the ?order= prefill
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pickFile = (file) => {
    if (!file) return;
    if (!ACCEPT.includes(file.type)) {
      setErrors((e) => ({ ...e, slip: "รองรับเฉพาะไฟล์รูปภาพ JPG, PNG, GIF หรือ WEBP" }));
      return;
    }
    if (file.size > MAX_SIZE) {
      setErrors((e) => ({ ...e, slip: "ไฟล์มีขนาดเกิน 5MB กรุณาเลือกไฟล์ใหม่" }));
      return;
    }
    setErrors((e) => ({ ...e, slip: undefined }));
    setSlip(file);
    setPreview(URL.createObjectURL(file));
  };

  const clearFile = () => {
    setSlip(null);
    setPreview("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const validate = () => {
    const e = {};
    if (!form.order_code.trim()) e.order_code = "กรุณากรอกเลขที่ใบสั่งซื้อ";
    if (!form.fullName.trim()) e.fullName = "กรุณากรอกชื่อ-นามสกุล";
    if (!/^\S+@\S+\.\S+$/.test(form.order_email.trim())) e.order_email = "รูปแบบอีเมลไม่ถูกต้อง";
    if (!/^0\d{9}$/.test(form.order_phone)) e.order_phone = "กรุณากรอกเบอร์โทรศัพท์ 10 หลัก ขึ้นต้นด้วย 0";
    if (!form.shippingAddress.trim()) e.shippingAddress = "กรุณากรอกที่อยู่จัดส่ง";
    if (!(Number(form.totalPrice) > 0)) e.totalPrice = "กรุณากรอกจำนวนเงินที่โอน";
    else if (lookup.order && Math.abs(Number(lookup.order.totalPrice) - Number(form.totalPrice)) > 0.009)
      e.totalPrice = `จำนวนเงินไม่ตรงกับยอดที่ต้องชำระ (${formatTHB(lookup.order.totalPrice)})`;
    if (!form.transfer_date) e.transfer_date = "กรุณาเลือกวันที่โอน";
    else if (today && form.transfer_date > today) e.transfer_date = "วันที่โอนต้องไม่เป็นวันในอนาคต";
    if (!form.transfer_time) e.transfer_time = "กรุณาระบุเวลาที่โอน";
    if (!slip) e.slip = "กรุณาแนบหลักฐานการโอนเงิน (สลิป)";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (submitting) return;
    setApiError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v).trim()));
      fd.set("order_code", form.order_code.trim().toUpperCase());
      fd.append("transfer_slip_file", slip);
      const res = await api("/api/payment-notice", { method: "POST", body: fd });
      setDone({ code: res.order_code || form.order_code.trim().toUpperCase(), message: res.message });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setApiError(err.message);
      if (err.data?.expectedAmount != null) setErrors((e) => ({ ...e, totalPrice: `ยอดที่ต้องชำระคือ ${formatTHB(err.data.expectedAmount)}` }));
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="container-page max-w-2xl py-12">
        <div className="card animate-slide-up overflow-hidden text-center">
          <div className="bg-gradient-to-br from-emerald-50 via-white to-accent-50 px-6 py-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="h-11 w-11" />
            </div>
            <h1 className="mt-5 text-2xl font-bold text-slate-900">แจ้งชำระเงินสำเร็จ!</h1>
            <p className="mt-2 text-slate-600">{done.message || "ระบบได้รับข้อมูลการชำระเงินของคุณแล้ว"}</p>
            <p className="mt-4 inline-block rounded-xl bg-white px-4 py-2 font-mono font-semibold text-brand-800 ring-1 ring-slate-200">{done.code}</p>
          </div>
          <div className="card-body space-y-5">
            <p className="text-sm text-slate-600">เราจะตรวจสอบการชำระเงินและอัปเดตสถานะคำสั่งซื้อของคุณภายใน 24 ชั่วโมง</p>
            <div className="flex flex-col justify-center gap-2 sm:flex-row">
              <Link href={`/paidstatus?code=${encodeURIComponent(done.code)}`} className="btn btn-primary">
                <Search className="h-4 w-4" /> ตรวจสอบสถานะ
              </Link>
              <Link href="/product" className="btn btn-secondary">
                เลือกซื้อสินค้าต่อ
              </Link>
              <Link href="/" className="btn btn-ghost">
                กลับหน้าแรก
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const lo = lookup.order;

  return (
    <div>
      <PageHeader
        title="แจ้งชำระเงิน"
        subtitle="กรอกข้อมูลการโอนเงินพร้อมแนบสลิป เพื่อให้เจ้าหน้าที่ตรวจสอบ"
        icon={CreditCard}
        breadcrumb={[{ label: "หน้าแรก", href: "/" }, { label: "แจ้งชำระเงิน" }]}
      />
      <div className="container-page grid gap-6 py-8 lg:grid-cols-3 lg:items-start">
        <form onSubmit={submit} noValidate className="card card-body space-y-5 lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900">ข้อมูลการชำระเงิน</h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="เลขที่ใบสั่งซื้อ" required error={errors.order_code}>
              <input
                className={cn("input font-mono uppercase", errors.order_code && "input-error")}
                value={form.order_code}
                onChange={(e) => set("order_code", e.target.value.toUpperCase())}
                onBlur={(e) => checkOrder(e.target.value)}
                placeholder="เช่น ORD20261118ABC123"
                autoComplete="off"
                required
              />
            </Field>
            <Field label="ชื่อ-นามสกุล" required error={errors.fullName}>
              <input
                className={cn("input", errors.fullName && "input-error")}
                value={form.fullName}
                onChange={(e) => set("fullName", e.target.value)}
                placeholder="ชื่อ นามสกุล"
                autoComplete="name"
                maxLength={150}
                required
              />
            </Field>
          </div>

          {lookup.loading && (
            <p className="flex items-center gap-2 text-sm text-slate-500">
              <Spinner className="h-4 w-4" /> กำลังตรวจสอบใบสั่งซื้อ...
            </p>
          )}
          {lookup.error && !lookup.loading && <Alert tone="warning">{lookup.error}</Alert>}
          {lo && (
            <div
              className={cn(
                "flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4",
                lo.status === "PENDING" && !lo.payment_reported ? "border-brand-200 bg-brand-50" : "border-amber-200 bg-amber-50"
              )}
            >
              <div>
                <p className="text-sm text-slate-600">ยอดที่ต้องชำระ</p>
                <p className="text-2xl font-bold text-brand-700">{formatTHB(lo.totalPrice)}</p>
              </div>
              <div className="text-right">
                <StatusBadge order={lo} />
                {lo.status !== "PENDING" && <p className="mt-1 text-xs text-amber-700">ใบสั่งซื้อนี้ไม่อยู่ในสถานะรอชำระเงิน</p>}
                {lo.status === "PENDING" && lo.payment_reported && (
                  <p className="mt-1 text-xs text-amber-700">ใบสั่งซื้อนี้แจ้งชำระแล้ว หากส่งซ้ำจะเป็นการแจ้งใหม่</p>
                )}
              </div>
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="อีเมลที่ใช้สั่งซื้อ" required error={errors.order_email}>
              <input
                type="email"
                inputMode="email"
                className={cn("input", errors.order_email && "input-error")}
                value={form.order_email}
                onChange={(e) => set("order_email", e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </Field>
            <Field label="เบอร์โทรติดต่อ" required error={errors.order_phone} help="กรอกเบอร์โทรศัพท์ 10 หลัก">
              <input
                type="tel"
                inputMode="numeric"
                className={cn("input", errors.order_phone && "input-error")}
                value={form.order_phone}
                onChange={(e) => set("order_phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="0812345678"
                autoComplete="tel"
                pattern="0[0-9]{9}"
                required
              />
            </Field>
          </div>

          <Field label="ที่อยู่การจัดส่ง" required error={errors.shippingAddress} help="กรุณากรอกที่อยู่ให้ครบถ้วนเพื่อความถูกต้องในการจัดส่ง">
            <textarea
              rows={3}
              className={cn("input", errors.shippingAddress && "input-error")}
              value={form.shippingAddress}
              onChange={(e) => set("shippingAddress", e.target.value)}
              placeholder="บ้านเลขที่ ถนน ตำบล อำเภอ จังหวัด รหัสไปรษณีย์"
              autoComplete="street-address"
              maxLength={1000}
              required
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="จำนวนเงินที่โอน (บาท)" required error={errors.totalPrice} help="ต้องตรงกับยอดในใบสั่งซื้อ">
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                className={cn("input", errors.totalPrice && "input-error")}
                value={form.totalPrice}
                onChange={(e) => set("totalPrice", e.target.value)}
                placeholder="0.00"
                required
              />
            </Field>
            <Field label="วันที่โอน" required error={errors.transfer_date}>
              <input
                type="date"
                max={today || undefined}
                className={cn("input", errors.transfer_date && "input-error")}
                value={form.transfer_date}
                onChange={(e) => set("transfer_date", e.target.value)}
                required
              />
            </Field>
            <Field label="เวลาที่โอน" required error={errors.transfer_time}>
              <input
                type="time"
                className={cn("input", errors.transfer_time && "input-error")}
                value={form.transfer_time}
                onChange={(e) => set("transfer_time", e.target.value)}
                required
              />
            </Field>
          </div>

          <div>
            <p className="label">
              หลักฐานการโอน (สลิป) <span className="text-red-500">*</span>
            </p>
            {preview ? (
              <div className="relative flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="ตัวอย่างสลิป" className="h-32 w-24 rounded-lg border border-slate-200 bg-white object-contain" />
                <div className="min-w-0 flex-1 text-sm">
                  <p className="truncate font-medium text-slate-800">{slip?.name}</p>
                  <p className="text-slate-500">{slip ? (slip.size / 1024 / 1024).toFixed(2) : 0} MB</p>
                  <button type="button" onClick={() => fileRef.current?.click()} className="btn btn-secondary btn-sm mt-2">
                    เปลี่ยนไฟล์
                  </button>
                </div>
                <button type="button" onClick={clearFile} className="btn btn-ghost btn-icon btn-sm absolute top-2 right-2" aria-label="ลบไฟล์">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  pickFile(e.dataTransfer.files?.[0]);
                }}
                className={cn(
                  "flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition",
                  dragging ? "border-brand-500 bg-brand-50" : errors.slip ? "border-red-300 bg-red-50/50" : "border-slate-300 hover:border-brand-400 hover:bg-slate-50"
                )}
              >
                {dragging ? <Upload className="h-8 w-8 text-brand-600" /> : <ImagePlus className="h-8 w-8 text-slate-400" />}
                <span className="text-sm font-medium text-slate-700">คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวาง</span>
                <span className="text-xs text-slate-500">รองรับไฟล์ JPG, PNG, GIF, WEBP (ขนาดไม่เกิน 5MB)</span>
              </button>
            )}
            <input ref={fileRef} type="file" accept={ACCEPT.join(",")} className="sr-only" tabIndex={-1} onChange={(e) => pickFile(e.target.files?.[0])} />
            {errors.slip && <p className="mt-1 text-xs text-red-600">{errors.slip}</p>}
          </div>

          {apiError && <Alert tone="error">{apiError}</Alert>}

          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={submitting}>
            {submitting ? (
              <>
                <Spinner className="h-5 w-5" /> กำลังดำเนินการ...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5" /> ยืนยันการแจ้งชำระเงิน
              </>
            )}
          </button>
        </form>

        <aside className="space-y-6 lg:sticky lg:top-24">
          <BankCard amount={lo?.totalPrice} compact />
          <div className="card card-body">
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-900">
              <ListChecks className="h-5 w-5 text-accent-600" /> คำแนะนำ
            </h3>
            <ol className="space-y-3">
              {TIPS.map((t, i) => (
                <li key={t} className="flex gap-3 text-sm text-slate-600">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700">
                    {i + 1}
                  </span>
                  {t}
                </li>
              ))}
            </ol>
            <p className="mt-4 flex gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
              <Info className="h-4 w-4 shrink-0" />
              <span>
                <strong>หมายเหตุ:</strong> กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนกดยืนยัน หากข้อมูลไม่ตรงกับในระบบ การแจ้งชำระเงินจะไม่สำเร็จ
              </span>
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function PaymentNoticePage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <PaymentNoticeContent />
    </Suspense>
  );
}
