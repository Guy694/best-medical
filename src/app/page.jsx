"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ShieldCheck, Truck, Headphones, BadgeCheck, Search, CreditCard, PackageCheck, ShoppingCart } from "lucide-react";
import ProductCard, { ProductCardSkeleton } from "./components/ProductCard";
import { imgSrc } from "./lib/format";

const STEPS = [
  { icon: Search, title: "เลือกสินค้า", desc: "ค้นหาและเพิ่มสินค้าลงตะกร้า" },
  { icon: ShoppingCart, title: "สั่งซื้อ", desc: "กรอกอีเมลเพื่อรับเลขคำสั่งซื้อ" },
  { icon: CreditCard, title: "ชำระเงิน", desc: "โอนเงินและแจ้งชำระพร้อมแนบสลิป" },
  { icon: PackageCheck, title: "รับสินค้า", desc: "ติดตามสถานะได้ตลอดเวลา" },
];

export default function Home() {
  const [products, setProducts] = useState(null);
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    fetch("/api/product/new")
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setProducts(Array.isArray(d) ? d : []))
      .catch(() => setProducts([]));
    fetch("/api/categories")
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setCategories(Array.isArray(d) ? d : []))
      .catch(() => setCategories([]));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white">
        <div className="pointer-events-none absolute -top-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-accent-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-20 h-[26rem] w-[26rem] rounded-full bg-brand-400/30 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[size:24px_24px]" />
        <div className="container-page relative grid items-center gap-10 py-14 md:grid-cols-2 md:py-20">
          <div className="animate-slide-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-accent-200 ring-1 ring-white/20">
              <ShieldCheck className="h-3.5 w-3.5" /> ตัวแทนจำหน่ายอุปกรณ์การแพทย์คุณภาพ
            </span>
            <h1 className="mt-5 text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
              ศูนย์รวมอุปกรณ์การแพทย์
              <span className="block bg-gradient-to-r from-accent-200 to-accent-400 bg-clip-text text-transparent">ครบวงจร ในที่เดียว</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-100 sm:text-lg">
              เครื่องมือตรวจรักษา ผลิตภัณฑ์ดูแลผู้ป่วยและผู้สูงอายุ ครุภัณฑ์และเวชภัณฑ์สำหรับโรงพยาบาล คลินิก และใช้งานที่บ้าน
              จากแบรนด์คุณภาพระดับโลก
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/product" className="btn btn-lg bg-white text-brand-800 shadow-lg hover:bg-brand-50">
                เลือกซื้อสินค้า <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/contact" className="btn btn-lg bg-white/10 text-white ring-1 ring-white/30 hover:bg-white/20">
                ขอใบเสนอราคา
              </Link>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-white/15 pt-6">
              {[
                ["5,000+", "รายการสินค้า"],
                ["2", "สาขาให้บริการ"],
                ["ทั่วไทย", "จัดส่งถึงบ้าน"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="text-xl font-bold sm:text-2xl">{v}</dt>
                  <dd className="text-xs text-brand-200 sm:text-sm">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative hidden md:block">
            <div className="absolute inset-8 rounded-full bg-white/10 blur-2xl" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/banner.png" alt="อุปกรณ์การแพทย์" className="relative mx-auto w-full max-w-lg drop-shadow-2xl" />
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="container-page relative z-10 -mt-8">
        <div className="card grid grid-cols-2 divide-slate-100 lg:grid-cols-4 lg:divide-x">
          {[
            { icon: BadgeCheck, t: "สินค้าคุณภาพ", d: "มาตรฐานทางการแพทย์" },
            { icon: Truck, t: "จัดส่งทั่วประเทศ", d: "รวดเร็ว ปลอดภัย" },
            { icon: ShieldCheck, t: "รับประกันสินค้าแท้", d: "มั่นใจทุกชิ้น" },
            { icon: Headphones, t: "ปรึกษาผู้เชี่ยวชาญ", d: "ฟรี! ทุกวันทำการ" },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="flex items-center gap-3 p-4 sm:p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{t}</p>
                <p className="text-xs text-slate-500">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container-page mt-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="section-title">หมวดหมู่สินค้า</h2>
            <p className="mt-1 text-sm text-slate-500">เลือกดูสินค้าตามประเภทการใช้งาน</p>
          </div>
          <Link href="/product" className="link hidden items-center gap-1 text-sm sm:inline-flex">
            ดูสินค้าทั้งหมด <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
          {categories === null
            ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton aspect-[4/5] rounded-2xl" />)
            : categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/category/${c.id}`}
                  className="group card flex flex-col items-center p-3 text-center transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-[var(--shadow-lift)]"
                >
                  <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-slate-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgSrc(c.cate_img)}
                      alt={c.cate_name}
                      loading="lazy"
                      onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                      className="h-full w-full object-contain p-1.5 transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs font-medium text-slate-700 group-hover:text-brand-700 sm:text-sm">{c.cate_name}</p>
                </Link>
              ))}
        </div>
      </section>

      {/* New products */}
      <section className="container-page mt-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="section-title">สินค้าเข้าใหม่</h2>
            <p className="mt-1 text-sm text-slate-500">อัปเดตสินค้าล่าสุดจากทางร้าน</p>
          </div>
          <Link href="/product" className="link inline-flex items-center gap-1 text-sm">
            ดูทั้งหมด <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {products === null
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : products.slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        {products?.length === 0 && <p className="py-10 text-center text-slate-500">ยังไม่มีสินค้า</p>}
      </section>

      {/* How to order */}
      <section className="container-page mt-16">
        <div className="card overflow-hidden">
          <div className="grid lg:grid-cols-[1fr_2fr]">
            <div className="bg-gradient-to-br from-accent-600 to-accent-700 p-8 text-white">
              <h2 className="text-2xl font-bold">สั่งซื้อง่าย ใน 4 ขั้นตอน</h2>
              <p className="mt-2 text-accent-50">ไม่ต้องสมัครสมาชิกก็สั่งซื้อได้ ติดตามสถานะด้วยเลขคำสั่งซื้อ</p>
              <Link href="/howtopay" className="btn mt-6 bg-white text-accent-800 hover:bg-accent-50">
                ดูวิธีการสั่งซื้อ <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ol className="grid gap-6 p-8 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map(({ icon: Icon, title, desc }, i) => (
                <li key={title} className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="mt-3 text-xs font-semibold text-accent-600">ขั้นตอนที่ {i + 1}</p>
                  <p className="font-semibold text-slate-900">{title}</p>
                  <p className="mt-1 text-sm text-slate-500">{desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page mt-16">
        <div className="relative overflow-hidden rounded-3xl bg-brand-900 px-6 py-10 text-center text-white sm:px-12">
          <div className="pointer-events-none absolute -top-20 left-1/2 h-60 w-[40rem] -translate-x-1/2 rounded-full bg-accent-400/20 blur-3xl" />
          <h2 className="relative text-2xl font-bold sm:text-3xl">ต้องการสินค้าสำหรับโรงพยาบาลหรือคลินิก?</h2>
          <p className="relative mx-auto mt-3 max-w-2xl text-brand-100">
            เรามีบริการจัดหาสินค้าตามความต้องการ พร้อมออกใบเสนอราคาสำหรับหน่วยงานราชการและเอกชน
          </p>
          <div className="relative mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="btn btn-lg bg-white text-brand-800 hover:bg-brand-50">
              ติดต่อฝ่ายขาย
            </Link>
            <a href="tel:074606389" className="btn btn-lg bg-white/10 text-white ring-1 ring-white/30 hover:bg-white/20">
              โทร 074-606-389
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
