"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, MessageCircle, Phone, Search, SearchX } from "lucide-react";
import { EmptyState, PageHeader } from "@/app/components/ui";
import { cn } from "@/app/lib/format";

const LINE_URL = "https://line.me/ti/p/bestmedical";

const FAQ_GROUPS = [
  {
    title: "การสั่งซื้อ",
    items: [
      {
        q: "วิธีการสั่งซื้อสินค้าเป็นอย่างไร?",
        a: "คุณสามารถเลือกสินค้าที่ต้องการและทำการสั่งซื้อผ่านทางเว็บไซต์ของเราได้เลย โดยเพิ่มสินค้าลงตะกร้า เลือกวิธีรับสินค้า (จัดส่ง EMS หรือรับที่ร้าน) กรอกอีเมล แล้วกดยืนยันคำสั่งซื้อ ระบบจะแสดงเลขคำสั่งซื้อให้ทันที",
      },
      {
        q: "จำเป็นต้องสมัครสมาชิกก่อนสั่งซื้อหรือไม่?",
        a: "ไม่จำเป็น คุณสามารถสั่งซื้อได้โดยกรอกเพียงอีเมล แต่หากสมัครสมาชิกจะสามารถดูประวัติและติดตามสถานะคำสั่งซื้อทั้งหมดได้สะดวกยิ่งขึ้น",
      },
      {
        q: "สินค้าที่แสดงว่า “สอบถามราคา” สั่งซื้ออย่างไร?",
        a: "สินค้าที่แสดงว่า “สอบถามราคา” เป็นสินค้าที่ราคาขึ้นอยู่กับรุ่น จำนวน หรือเงื่อนไขการติดตั้ง จึงไม่สามารถเพิ่มลงตะกร้าได้ กรุณาติดต่อเจ้าหน้าที่ผ่าน LINE (@bestmedical) โทร 074-606-389 หรือส่งข้อความผ่านหน้าติดต่อเรา เพื่อขอราคาหรือใบเสนอราคา",
      },
      {
        q: "สามารถเปลี่ยนแปลงหรือยกเลิกคำสั่งซื้อได้หรือไม่?",
        a: "สามารถเปลี่ยนแปลงหรือยกเลิกคำสั่งซื้อได้ภายใน 24 ชั่วโมงหลังจากที่ทำการสั่งซื้อ โดยติดต่อเจ้าหน้าที่พร้อมแจ้งเลขคำสั่งซื้อ",
      },
    ],
  },
  {
    title: "การชำระเงิน",
    items: [
      {
        q: "มีวิธีการชำระเงินแบบไหนบ้าง?",
        a: "ชำระเงินด้วยการโอนเงินเข้าบัญชีธนาคารกรุงไทย สาขาเซ็นทรัลพลาซา เวสต์เกต ชื่อบัญชี บริษัท เบสท เมดิคอล จำกัด หรือสแกน QR Code ที่แสดงในหน้าชำระเงิน หากต้องการชำระด้วยวิธีอื่น กรุณาติดต่อเจ้าหน้าที่",
      },
      {
        q: "แจ้งชำระเงินอย่างไร?",
        a: "หลังโอนเงินแล้ว ไปที่เมนู “แจ้งชำระเงิน” กรอกเลขคำสั่งซื้อ ข้อมูลผู้รับ วันและเวลาที่โอน พร้อมแนบรูปสลิปการโอน (ไฟล์รูปภาพขนาดไม่เกิน 5MB) ยอดโอนต้องตรงกับยอดรวมของคำสั่งซื้อ",
      },
      {
        q: "แจ้งชำระเงินแล้ว ต้องรอนานเท่าไร?",
        a: "เจ้าหน้าที่จะตรวจสอบการชำระเงินภายในวันทำการ (จันทร์ - เสาร์ 08:00 - 17:00 น.) ระหว่างนี้สถานะคำสั่งซื้อจะแสดงเป็น “รอตรวจสอบการชำระ” และจะเปลี่ยนเป็น “ชำระเงินแล้ว” เมื่อตรวจสอบเรียบร้อย",
      },
    ],
  },
  {
    title: "การจัดส่งและติดตามสถานะ",
    items: [
      {
        q: "ค่าจัดส่งคิดอย่างไร?",
        a: "การจัดส่งแบบ EMS คิดค่าจัดส่งตามที่กำหนดไว้ในแต่ละสินค้าคูณด้วยจำนวนที่สั่ง ระบบจะคำนวณให้อัตโนมัติในหน้าตะกร้า หากเลือกรับสินค้าที่ร้าน (สำนักงานใหญ่นนทบุรี หรือสาขาพัทลุง) ไม่มีค่าจัดส่ง",
      },
      {
        q: "ใช้เวลาจัดส่งกี่วัน?",
        a: "หลังยืนยันการชำระเงิน เราจะจัดส่งสินค้าโดยเร็วที่สุด ระยะเวลาขนส่งขึ้นอยู่กับพื้นที่ปลายทางและผู้ให้บริการขนส่ง เมื่อจัดส่งแล้วคุณจะได้รับเลขพัสดุสำหรับติดตาม",
      },
      {
        q: "ตรวจสอบสถานะคำสั่งซื้อได้ที่ไหน?",
        a: "ไปที่เมนู “ตรวจสอบสถานะ” แล้วกรอกเลขคำสั่งซื้อพร้อมอีเมลที่ใช้สั่งซื้อ หรือหากเป็นสมาชิกสามารถดูได้ที่หน้าประวัติการสั่งซื้อ สถานะมีดังนี้: รอชำระเงิน → รอตรวจสอบการชำระ → ชำระเงินแล้ว → กำลังจัดส่ง → สำเร็จ",
      },
    ],
  },
  {
    title: "การรับประกันและคืนสินค้า",
    items: [
      {
        q: "สินค้าของเรามีการรับประกันหรือไม่?",
        a: "ใช่ เรามีการรับประกันสินค้าทุกชิ้นตามเงื่อนไขที่กำหนด ระยะเวลารับประกันของแต่ละสินค้าจะแสดงอยู่ในหน้ารายละเอียดสินค้า กรุณาเก็บหลักฐานการสั่งซื้อไว้เพื่อใช้ในการเคลมสินค้า",
      },
      {
        q: "หากสินค้ามีปัญหาสามารถคืนสินค้าได้หรือไม่?",
        a: "สามารถคืนสินค้าได้ภายใน 7 วันหลังจากที่ได้รับสินค้า โดยสินค้าต้องอยู่ในสภาพสมบูรณ์ กรุณาติดต่อเจ้าหน้าที่พร้อมแจ้งเลขคำสั่งซื้อและรายละเอียดปัญหา",
      },
    ],
  },
];

function FaqItem({ item, open, onToggle }) {
  const id = useId();
  return (
    <div className={cn("rounded-xl border bg-white transition", open ? "border-brand-200 shadow-[var(--shadow-soft)]" : "border-slate-200")}>
      <h3>
        <button
          type="button"
          id={`${id}-btn`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium text-slate-800 hover:text-brand-700"
        >
          <span>{item.q}</span>
          <ChevronDown className={cn("h-5 w-5 shrink-0 text-slate-400 transition-transform", open && "rotate-180 text-brand-700")} />
        </button>
      </h3>
      {open && (
        <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-btn`} className="animate-fade-in px-5 pb-5 text-sm leading-relaxed text-slate-600">
          {item.a}
        </div>
      )}
    </div>
  );
}

export default function QaPage() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(() => new Set(["0-0"]));

  const term = query.trim().toLowerCase();
  const groups = useMemo(
    () =>
      FAQ_GROUPS.map((g, gi) => ({
        ...g,
        items: g.items
          .map((it, ii) => ({ ...it, key: `${gi}-${ii}` }))
          .filter((it) => !term || it.q.toLowerCase().includes(term) || it.a.toLowerCase().includes(term)),
      })).filter((g) => g.items.length),
    [term]
  );

  const toggle = (key) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(key)) n.delete(key);
      else n.add(key);
      return n;
    });

  return (
    <div>
      <PageHeader
        title="คำถามที่พบบ่อย"
        subtitle="รวมคำตอบเกี่ยวกับการสั่งซื้อ การชำระเงิน การจัดส่ง และการรับประกันสินค้า"
        icon={HelpCircle}
        breadcrumb={[{ label: "หน้าแรก", href: "/" }, { label: "คำถามที่พบบ่อย" }]}
      >
        <div className="relative w-full sm:w-80">
          <label htmlFor="faq-search" className="sr-only">
            ค้นหาคำถาม
          </label>
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="faq-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาคำถาม..."
            className="input bg-white pl-9"
          />
        </div>
      </PageHeader>

      <div className="container-page py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            {groups.length === 0 ? (
              <div className="card">
                <EmptyState
                  icon={SearchX}
                  title="ไม่พบคำถามที่ค้นหา"
                  description="ลองใช้คำค้นหาอื่น หรือสอบถามเจ้าหน้าที่ของเราได้โดยตรง"
                  action={
                    <button type="button" className="btn btn-secondary" onClick={() => setQuery("")}>
                      ล้างคำค้นหา
                    </button>
                  }
                />
              </div>
            ) : (
              groups.map((g) => (
                <section key={g.title}>
                  <h2 className="section-title mb-4">{g.title}</h2>
                  <div className="space-y-3">
                    {g.items.map((it) => (
                      <FaqItem key={it.key} item={it} open={!!term || open.has(it.key)} onToggle={() => toggle(it.key)} />
                    ))}
                  </div>
                </section>
              ))
            )}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="card overflow-hidden">
              <div className="bg-gradient-to-br from-brand-800 to-brand-700 p-6 text-white">
                <MessageCircle className="h-8 w-8 text-accent-200" />
                <h2 className="mt-3 text-lg font-semibold">ยังไม่พบคำตอบที่ต้องการ?</h2>
                <p className="mt-1 text-sm text-brand-100">หากคุณมีคำถามเพิ่มเติม สามารถติดต่อทีมงานของเราได้ตลอดเวลา</p>
              </div>
              <div className="card-body space-y-3">
                <Link href="/contact" className="btn btn-primary w-full">
                  ส่งข้อความถึงเรา
                </Link>
                <a href={LINE_URL} target="_blank" rel="noopener noreferrer" className="btn btn-accent w-full">
                  <MessageCircle className="h-4 w-4" /> แชทผ่าน LINE
                </a>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a href="tel:074606389" className="btn btn-secondary btn-sm">
                    <Phone className="h-4 w-4" /> 074-606-389
                  </a>
                  <a href="tel:024033145" className="btn btn-secondary btn-sm">
                    <Phone className="h-4 w-4" /> 02-403-3145
                  </a>
                </div>
                <p className="pt-1 text-center text-xs text-slate-500">เวลาทำการ จันทร์ - เสาร์ 08:00 - 17:00 น.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
