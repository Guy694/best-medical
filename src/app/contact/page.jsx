"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Building2, CheckCircle2, Clock, ExternalLink, Mail, MapPin, MessageCircle, Phone, Send, Store } from "lucide-react";
import { useAuth } from "@/app/components/Providers";
import { Alert, PageHeader, PageLoader, Spinner } from "@/app/components/ui";
import { api, cn } from "@/app/lib/format";

const LINE_URL = "https://line.me/ti/p/bestmedical";
const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=100070566921817";
const EMAIL = "best_medical@hotmail.com";
const HOURS = ["จันทร์ - เสาร์: 08:00 - 17:00 น.", "อาทิตย์: ปิดทำการ"];

const BRANCHES = [
  {
    key: "hq",
    icon: Building2,
    name: "สำนักงานใหญ่ (นนทบุรี)",
    address: "เลขที่ 83 หมู่บ้านพฤกษา 95 เอ หมู่ที่ 9 ต.บางม่วง อ.บางใหญ่ จ.นนทบุรี 11140",
    phone: "02-403-3145",
    tel: "024033145",
    mapUrl: "https://maps.app.goo.gl/ujvLQj1d5YeWPKRw5",
    embed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1936.9551135479894!2d100.40520473847619!3d13.844426996639301!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2910bbdc679fb%3A0x5820b1c0b1260c3c!2z4Lia4Lij4Li04Lip4Lix4LiXIOC5gOC4muC4quC4lyDguYDguKHguJTguLTguITguK3guKUg4LiI4Liz4LiB4Lix4LiUICjguKrguLPguJnguLHguIHguIfguLLguJnguYPguKvguI3guYgp!5e0!3m2!1sth!2sth!4v1760620866582!5m2!1sth!2sth",
  },
  {
    key: "ptl",
    icon: Store,
    name: "สาขาพัทลุง",
    address: "345 หมู่ที่ 2 ต.เขาเจียก อ.เมือง จ.พัทลุง 93000",
    phone: "074-606-389",
    tel: "074606389",
    mapUrl: "https://maps.app.goo.gl/zgro1tHX8LgHdqcXA",
    embed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4912.3197340329625!2d100.04943139999999!3d7.621475400000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x304d7cfd8d3d1b9f%3A0xbee54681de6e8792!2z4Lia4Lij4Li04Lip4Lix4LiXIOC5gOC4muC4quC4lyDguYDguKHguJTguLTguITguK3guKUg4LiI4Liz4LiB4Lix4LiUICjguKrguLLguILguLLguJ7guLHguJfguKXguLjguIcp!5e1!3m2!1sth!2sth!4v1756434412181!5m2!1sth!2sth",
  },
];

const ADMINS = [
  { phone: "084-312-3061", tel: "0843123061", qr: "/contact/line-qr1.jpg" },
  { phone: "080-919-4186", tel: "0809194186", qr: "/contact/line-qr2.jpg" },
  { phone: "083-425-2332", tel: "0834252332", qr: "/contact/line-qr3.jpg" },
];

const SUBJECTS = ["สอบถามทั่วไป", "สอบถามราคาสินค้า / ขอใบเสนอราคา", "ขอความช่วยเหลือ", "ติดต่อเรื่องธุรกิจ", "ร้องเรียน", "เสนอแนะ"];
const MAX_DETAIL = 5000;

function ContactForm() {
  const params = useSearchParams();
  const { user } = useAuth();
  const product = (params.get("product") || "").slice(0, 150);
  const initialSubject = SUBJECTS.includes(params.get("subject")) ? params.get("subject") : product ? SUBJECTS[1] : "";

  const [form, setForm] = useState(() => ({
    name: "",
    email: "",
    phone: "",
    article: initialSubject,
    detail: product ? `ต้องการสอบถามราคาสินค้า: ${product}\n` : "",
  }));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // prefill from the logged-in account, but never overwrite what the user typed
  const value = (k) => form[k] || (form[`_${k}Touched`] ? "" : user?.[k] || "");

  const onChange = (e) => {
    const { name, value: v } = e.target;
    setForm((f) => ({ ...f, [name]: v, [`_${name}Touched`]: true }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    const payload = {
      name: value("name").trim(),
      email: value("email").trim(),
      phone: value("phone").replace(/[\s-]/g, ""),
      article: form.article.trim(),
      detail: form.detail.trim(),
    };
    const er = {};
    if (!payload.name) er.name = "กรุณากรอกชื่อ-นามสกุล";
    if (!/^\S+@\S+\.\S+$/.test(payload.email)) er.email = "รูปแบบอีเมลไม่ถูกต้อง";
    if (payload.phone && !/^0\d{8,9}$/.test(payload.phone)) er.phone = "เบอร์โทรศัพท์ไม่ถูกต้อง (ตัวเลข 9-10 หลัก ขึ้นต้นด้วย 0)";
    if (!payload.article) er.article = "กรุณาเลือกหัวข้อ";
    if (!payload.detail) er.detail = "กรุณากรอกรายละเอียด";
    setErrors(er);
    if (Object.keys(er).length) return;

    setSubmitting(true);
    setError("");
    try {
      const res = await api("/api/contacts", { method: "POST", body: { ...payload, phone: payload.phone || undefined } });
      setSuccess(res?.message || "ส่งข้อความเรียบร้อยแล้ว เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุด");
      setForm({ name: "", email: "", phone: "", article: "", detail: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center py-12 text-center">
        <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <h3 className="text-xl font-bold text-slate-900">ขอบคุณที่ติดต่อเรา</h3>
        <p className="mt-2 max-w-md text-slate-600">{success}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button type="button" className="btn btn-secondary" onClick={() => setSuccess("")}>
            ส่งข้อความอื่น
          </button>
          <a href={LINE_URL} target="_blank" rel="noopener noreferrer" className="btn btn-accent">
            <MessageCircle className="h-4 w-4" /> แชทผ่าน LINE
          </a>
        </div>
      </div>
    );
  }

  const fieldErr = (k) => errors[k] && <p className="mt-1 text-xs text-red-600">{errors[k]}</p>;

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {error && (
        <Alert tone="error" title="ส่งข้อความไม่สำเร็จ">
          {error}
        </Alert>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="label">
            ชื่อ-นามสกุล <span className="text-red-500">*</span>
          </label>
          <input
            id="c-name"
            name="name"
            autoComplete="name"
            required
            maxLength={150}
            value={value("name")}
            onChange={onChange}
            className={cn("input", errors.name && "input-error")}
            placeholder="กรอกชื่อ-นามสกุล"
          />
          {fieldErr("name")}
        </div>
        <div>
          <label htmlFor="c-email" className="label">
            อีเมล <span className="text-red-500">*</span>
          </label>
          <input
            id="c-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={value("email")}
            onChange={onChange}
            className={cn("input", errors.email && "input-error")}
            placeholder="you@example.com"
          />
          {fieldErr("email")}
        </div>
        <div>
          <label htmlFor="c-phone" className="label">
            เบอร์โทรศัพท์ <span className="text-xs font-normal text-slate-400">(ไม่บังคับ)</span>
          </label>
          <input
            id="c-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={12}
            value={value("phone")}
            onChange={onChange}
            className={cn("input", errors.phone && "input-error")}
            placeholder="08X-XXX-XXXX"
          />
          {fieldErr("phone")}
        </div>
        <div>
          <label htmlFor="c-subject" className="label">
            หัวข้อ <span className="text-red-500">*</span>
          </label>
          <select
            id="c-subject"
            name="article"
            required
            value={form.article}
            onChange={onChange}
            className={cn("input", errors.article && "input-error")}
          >
            <option value="">เลือกหัวข้อ</option>
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {fieldErr("article")}
        </div>
      </div>
      <div>
        <label htmlFor="c-detail" className="label">
          รายละเอียด <span className="text-red-500">*</span>
        </label>
        <textarea
          id="c-detail"
          name="detail"
          required
          rows={6}
          maxLength={MAX_DETAIL}
          value={form.detail}
          onChange={onChange}
          className={cn("input resize-y", errors.detail && "input-error")}
          placeholder="กรุณาระบุรายละเอียดที่ต้องการสอบถาม เช่น ชื่อสินค้า จำนวน หรือสถานที่จัดส่ง..."
        />
        <div className="mt-1 flex justify-between gap-2">
          {errors.detail ? <p className="text-xs text-red-600">{errors.detail}</p> : <span />}
          <span className={cn("text-xs", form.detail.length > MAX_DETAIL * 0.9 ? "text-amber-600" : "text-slate-400")}>
            {form.detail.length.toLocaleString("th-TH")}/{MAX_DETAIL.toLocaleString("th-TH")}
          </span>
        </div>
      </div>
      <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">เจ้าหน้าที่จะติดต่อกลับภายในวันทำการ</p>
        <button type="submit" disabled={submitting} className="btn btn-primary btn-lg">
          {submitting ? <Spinner /> : <Send className="h-5 w-5" />}
          {submitting ? "กำลังส่ง..." : "ส่งข้อความ"}
        </button>
      </div>
    </form>
  );
}

function BranchCard({ b }) {
  const Icon = b.icon;
  return (
    <div className="card card-body">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="font-semibold text-slate-900">{b.name}</h3>
      </div>
      <ul className="mt-4 space-y-3 text-sm text-slate-600">
        <li className="flex gap-3">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" />
          <span>{b.address}</span>
        </li>
        <li className="flex gap-3">
          <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" />
          <a href={`tel:${b.tel}`} className="link">
            {b.phone}
          </a>
        </li>
      </ul>
      <a href={b.mapUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm mt-4 w-full">
        <MapPin className="h-4 w-4" /> เปิดใน Google Maps <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

function MapCard() {
  const [active, setActive] = useState(BRANCHES[0].key);
  const b = BRANCHES.find((x) => x.key === active);
  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4 sm:px-6">
        <h2 className="section-title">แผนที่</h2>
        <div className="flex gap-1 rounded-xl bg-slate-100 p-1" role="tablist">
          {BRANCHES.map((x) => (
            <button
              key={x.key}
              type="button"
              role="tab"
              aria-selected={active === x.key}
              onClick={() => setActive(x.key)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition",
                active === x.key ? "bg-white text-brand-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
              )}
            >
              {x.name}
            </button>
          ))}
        </div>
      </div>
      <div className="relative h-80 bg-slate-100 sm:h-96">
        <iframe
          key={b.key}
          src={b.embed}
          className="absolute inset-0 h-full w-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`แผนที่ บริษัท เบสท เมดิคอล จำกัด ${b.name}`}
        />
      </div>
      <div className="flex flex-col gap-2 bg-slate-50 p-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-slate-600">
          <span className="font-medium text-slate-800">บริษัท เบสท เมดิคอล จำกัด ({b.name})</span> — {b.address}
        </p>
        <a href={b.mapUrl} target="_blank" rel="noopener noreferrer" className="link inline-flex shrink-0 items-center gap-1 font-medium">
          เปิดใน Google Maps <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <div>
      <PageHeader
        title="ติดต่อเรา"
        subtitle="สอบถามข้อมูลสินค้า ขอใบเสนอราคา หรือแจ้งปัญหาการใช้งาน ทีมงานยินดีให้บริการ"
        icon={Phone}
        breadcrumb={[{ label: "หน้าแรก", href: "/" }, { label: "ติดต่อเรา" }]}
      >
        <div className="flex flex-wrap gap-2">
          <a href={LINE_URL} target="_blank" rel="noopener noreferrer" className="btn btn-accent">
            <MessageCircle className="h-4 w-4" /> LINE
          </a>
          <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            Facebook
          </a>
        </div>
      </PageHeader>

      <div className="container-page py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="card card-body" aria-labelledby="contact-form-title">
              <h2 id="contact-form-title" className="section-title">
                ส่งข้อความถึงเรา
              </h2>
              <p className="mt-1 mb-6 text-sm text-slate-500">กรอกแบบฟอร์มด้านล่าง แล้วเจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุด</p>
              <Suspense fallback={<PageLoader />}>
                <ContactForm />
              </Suspense>
            </section>
            <MapCard />
          </div>

          <aside className="space-y-6">
            {BRANCHES.map((b) => (
              <BranchCard key={b.key} b={b} />
            ))}

            <div className="card card-body">
              <ul className="space-y-4 text-sm text-slate-600">
                <li className="flex gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" />
                  <div>
                    <p className="font-medium text-slate-800">อีเมล</p>
                    <a href={`mailto:${EMAIL}`} className="link break-all">
                      {EMAIL}
                    </a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" />
                  <div>
                    <p className="font-medium text-slate-800">เวลาทำการ</p>
                    {HOURS.map((h) => (
                      <p key={h}>{h}</p>
                    ))}
                  </div>
                </li>
              </ul>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <a href={LINE_URL} target="_blank" rel="noopener noreferrer" className="btn btn-accent btn-sm">
                  <MessageCircle className="h-4 w-4" /> LINE
                </a>
                <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                  Facebook
                </a>
              </div>
            </div>

            <div className="card card-body">
              <h3 className="font-semibold text-slate-900">ติดต่อแอดมินผ่าน LINE</h3>
              <p className="mt-1 text-sm text-slate-500">สแกน QR Code เพื่อเพิ่มเพื่อน หรือโทรหาแอดมินได้โดยตรง</p>
              <ul className="mt-4 space-y-3">
                {ADMINS.map((a, i) => (
                  <li key={a.tel} className="flex items-center gap-4 rounded-xl border border-slate-200 p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={a.qr}
                      alt={`QR Code LINE แอดมิน ${i + 1}`}
                      loading="lazy"
                      className="h-20 w-20 shrink-0 rounded-lg border border-slate-100 object-cover"
                      onError={(e) => (e.currentTarget.style.visibility = "hidden")}
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-slate-800">แอดมิน {i + 1}</p>
                      <a href={`tel:${a.tel}`} className="link inline-flex items-center gap-1 text-sm">
                        <Phone className="h-3.5 w-3.5" /> {a.phone}
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
