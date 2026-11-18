"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ClipboardList, CreditCard, HelpCircle, MessageCircle, PackageSearch, Phone, ShoppingCart } from "lucide-react";
import { PageHeader } from "@/app/components/ui";
import { BankCard } from "@/app/components/order/OrderParts";
import { cn } from "@/app/lib/format";

const SECTIONS = [
  {
    icon: ShoppingCart,
    title: "ขั้นตอนการสั่งซื้อ",
    tone: "bg-brand-700",
    steps: [
      "เลือกสินค้าที่ต้องการและเพิ่มลงตะกร้า",
      "ตรวจสอบรายการสินค้าและจำนวน",
      "กรอก E-mail เพื่อรับเลขคำสั่งซื้อ/แจ้งชำระเงิน",
      "ยืนยันการสั่งซื้อ ระบบจะส่งใบสั่งซื้อไปทางอีเมล",
    ],
    cta: { href: "/product", label: "เลือกซื้อสินค้า" },
  },
  {
    icon: CreditCard,
    title: "ขั้นตอนแจ้งชำระเงิน",
    tone: "bg-accent-600",
    steps: [
      "โอนเงินตามยอดที่ระบบแจ้ง",
      "บันทึกหลักฐานการโอน เช่น สลิป หรือภาพหน้าจอ",
      "กรอกฟอร์มแจ้งชำระเงินในเว็บไซต์",
      "ยืนยันการแจ้งชำระเงิน",
    ],
    cta: { href: "/payment-notice", label: "แจ้งชำระเงิน" },
  },
  {
    icon: PackageSearch,
    title: "ขั้นตอนการตรวจสอบสถานะการสั่งซื้อ",
    tone: "bg-violet-600",
    steps: ["กรอกเลขที่ใบสั่งซื้อ", "ระบบจะแสดงข้อมูลสถานะการสั่งซื้อ"],
    cta: { href: "/paidstatus", label: "ตรวจสอบสถานะ" },
  },
];

const FAQ = [
  {
    q: "หาเลขที่ใบสั่งซื้อได้จากที่ไหน?",
    a: "เลขที่ใบสั่งซื้อจะแสดงทันทีหลังสั่งซื้อสำเร็จ และระบบจะส่งไปยังอีเมลที่ท่านกรอกไว้ หากเป็นสมาชิกสามารถดูได้ที่เมนูประวัติการสั่งซื้อ",
  },
  {
    q: "แจ้งชำระเงินแล้ว จะได้รับการยืนยันเมื่อไร?",
    a: "เจ้าหน้าที่จะตรวจสอบการชำระเงินและอัปเดตสถานะคำสั่งซื้อภายใน 24 ชั่วโมง ท่านสามารถติดตามสถานะได้ที่หน้าตรวจสอบสถานะ",
  },
  {
    q: "ต้องโอนเงินเท่าไร?",
    a: "กรุณาโอนเงินให้ตรงกับยอดชำระทั้งหมดในใบสั่งซื้อ (รวมค่าจัดส่งแล้ว) หากยอดไม่ตรง ระบบจะไม่สามารถรับแจ้งชำระเงินได้",
  },
  {
    q: "สามารถรับสินค้าที่หน้าร้านได้หรือไม่?",
    a: "ได้ เลือกวิธีจัดส่ง \"รับสินค้าที่หน้าร้าน (สาขาพัทลุง)\" ในหน้าตะกร้าสินค้า โดยไม่มีค่าจัดส่ง",
  },
  {
    q: "สินค้าที่แสดง \"สอบถามราคา\" สั่งซื้ออย่างไร?",
    a: "สินค้าดังกล่าวไม่สามารถสั่งซื้อออนไลน์ได้ กรุณาติดต่อเจ้าหน้าที่ทาง LINE หรือโทร 074-606-389 เพื่อขอใบเสนอราคา",
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-4 text-left font-medium text-slate-900 hover:text-brand-700"
      >
        {q}
        <ChevronDown className={cn("h-5 w-5 shrink-0 text-slate-400 transition-transform", open && "rotate-180")} />
      </button>
      {open && <p className="animate-fade-in pb-4 text-sm leading-relaxed text-slate-600">{a}</p>}
    </div>
  );
}

export default function HowToPayPage() {
  return (
    <div>
      <PageHeader
        title="วิธีการสั่งซื้อ & แจ้งชำระเงิน"
        subtitle="ขั้นตอนง่ายๆ สะดวก รวดเร็ว ปลอดภัย"
        icon={ClipboardList}
        breadcrumb={[{ label: "หน้าแรก", href: "/" }, { label: "วิธีการสั่งซื้อ" }]}
      />

      <div className="container-page grid gap-8 py-10 lg:grid-cols-3 lg:items-start">
        <div className="space-y-6 lg:col-span-2">
          {SECTIONS.map((s, si) => (
            <section key={s.title} className="card card-body animate-slide-up">
              <div className="mb-5 flex items-center gap-3">
                <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md", s.tone)}>
                  <s.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-medium text-slate-400">ส่วนที่ {si + 1}</p>
                  <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">{s.title}</h2>
                </div>
              </div>
              <ol className="relative space-y-4">
                {s.steps.map((step, i) => (
                  <li key={step} className="relative flex gap-4">
                    {i < s.steps.length - 1 && <span className="absolute top-8 left-4 h-[calc(100%-0.5rem)] w-px bg-slate-200" aria-hidden />}
                    <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-brand-200 bg-white text-sm font-semibold text-brand-700">
                      {i + 1}
                    </span>
                    <p className="pt-1 text-slate-700">{step}</p>
                  </li>
                ))}
              </ol>
              <div className="mt-5 border-t border-slate-100 pt-4">
                <Link href={s.cta.href} className="btn btn-secondary btn-sm">
                  {s.cta.label}
                </Link>
              </div>
            </section>
          ))}

          <section className="card card-body">
            <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-slate-900">
              <HelpCircle className="h-5 w-5 text-accent-600" /> คำถามที่พบบ่อย
            </h2>
            {FAQ.map((f) => (
              <FaqItem key={f.q} {...f} />
            ))}
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24">
          <BankCard />
          <div className="card card-body space-y-2">
            <Link href="/payment-notice" className="btn btn-primary w-full">
              <CreditCard className="h-4 w-4" /> แจ้งชำระเงิน
            </Link>
            <Link href="/paidstatus" className="btn btn-secondary w-full">
              <PackageSearch className="h-4 w-4" /> ตรวจสอบสถานะคำสั่งซื้อ
            </Link>
          </div>
          <div className="card card-body text-sm">
            <p className="font-semibold text-slate-900">ต้องการความช่วยเหลือ?</p>
            <p className="mt-1 text-slate-500">สอบถามเรื่องการสั่งซื้อและการชำระเงิน</p>
            <div className="mt-3 flex flex-col gap-2">
              <a href="https://line.me/ti/p/bestmedical" target="_blank" rel="noopener noreferrer" className="btn btn-accent btn-sm">
                <MessageCircle className="h-4 w-4" /> LINE: bestmedical
              </a>
              <a href="tel:074606389" className="btn btn-ghost btn-sm">
                <Phone className="h-4 w-4" /> 074-606-389
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
