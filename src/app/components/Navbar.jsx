"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Search, ShoppingCart, User, Menu, X, Phone, Clock, LogOut, History, LayoutDashboard,
  ChevronDown, UserCircle, Truck, CreditCard, LayoutGrid,
} from "lucide-react";
import { useAuth, useCart } from "./Providers";
import { cn, imgSrc } from "@/app/lib/format";

const LINKS = [
  { href: "/", label: "หน้าหลัก" },
  { href: "/product", label: "สินค้าทั้งหมด" },
  { href: "/howtopay", label: "วิธีสั่งซื้อ/ชำระเงิน" },
  { href: "/payment-notice", label: "แจ้งชำระเงิน" },
  { href: "/paidstatus", label: "ตรวจสอบสถานะ" },
  { href: "/article", label: "บทความ" },
  { href: "/qa", label: "คำถามที่พบบ่อย" },
  { href: "/contact", label: "ติดต่อเรา" },
];

function SearchBox({ className, onDone, autoFocus }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  return (
    <form
      role="search"
      className={cn("relative", className)}
      onSubmit={(e) => {
        e.preventDefault();
        router.push(q.trim() ? `/product?q=${encodeURIComponent(q.trim())}` : "/product");
        onDone?.();
      }}
    >
      <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoFocus={autoFocus}
        placeholder="ค้นหาสินค้า เช่น เครื่องวัดความดัน, รถเข็น..."
        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pr-24 pl-10 text-sm transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:outline-none"
      />
      <button type="submit" className="btn btn-primary btn-sm absolute top-1/2 right-1.5 -translate-y-1/2">
        ค้นหา
      </button>
    </form>
  );
}

function useClickOutside(ref, onOutside) {
  useEffect(() => {
    const h = (e) => ref.current && !ref.current.contains(e.target) && onOutside();
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [ref, onOutside]);
}

function AccountMenu() {
  const { user, isStaff, logout, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false));

  if (loading) return <div className="skeleton h-10 w-28" />;
  if (!user) {
    return (
      <div className="hidden items-center gap-2 sm:flex">
        <Link href="/login" className="btn btn-ghost">
          <User className="h-4 w-4" /> เข้าสู่ระบบ
        </Link>
        <Link href="/register" className="btn btn-secondary">
          สมัครสมาชิก
        </Link>
      </div>
    );
  }
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} className="btn btn-ghost px-2.5" aria-haspopup="menu" aria-expanded={open}>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
          {user.name?.trim()?.[0] || "U"}
        </span>
        <span className="hidden max-w-[9rem] truncate text-left lg:block">{user.name}</span>
        <ChevronDown className="hidden h-4 w-4 lg:block" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 z-50 mt-2 w-60 animate-slide-up overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-xl">
          <div className="border-b border-slate-100 px-4 pb-3">
            <p className="truncate font-medium text-slate-900">{user.name}</p>
            <p className="truncate text-xs text-slate-500">{user.email}</p>
          </div>
          {isStaff && (
            <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setOpen(false)}>
              <LayoutDashboard className="h-4 w-4 text-brand-600" /> ระบบหลังบ้าน
            </Link>
          )}
          <Link href="/user/history" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setOpen(false)}>
            <History className="h-4 w-4 text-slate-500" /> ประวัติการสั่งซื้อ
          </Link>
          <Link href="/user/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setOpen(false)}>
            <UserCircle className="h-4 w-4 text-slate-500" /> ข้อมูลส่วนตัว
          </Link>
          <button onClick={() => logout()} className="flex w-full items-center gap-3 border-t border-slate-100 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
            <LogOut className="h-4 w-4" /> ออกจากระบบ
          </button>
        </div>
      )}
    </div>
  );
}

function CategoryMenu() {
  const [cats, setCats] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false));
  useEffect(() => {
    fetch("/api/categories")
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setCats(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);
  return (
    <div className="relative" ref={ref} onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800"
      >
        <LayoutGrid className="h-4 w-4" /> หมวดหมู่สินค้า <ChevronDown className="h-4 w-4" />
      </button>
      {open && cats.length > 0 && (
        <div className="absolute left-0 z-50 pt-2">
          <div className="grid max-h-[70vh] w-[34rem] animate-slide-up grid-cols-2 gap-1 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
            {cats.map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.id}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl p-2 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-800"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imgSrc(c.cate_img)} alt="" className="h-9 w-9 shrink-0 rounded-lg bg-slate-50 object-contain" />
                <span className="line-clamp-1 flex-1">{c.cate_name}</span>
                {c.product_count > 0 && <span className="text-xs text-slate-400">{c.product_count}</span>}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { count, ready } = useCart();
  const { user, isStaff, logout } = useAuth();
  const [drawer, setDrawer] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setDrawer(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
  }, [drawer]);

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      {/* Top strip */}
      <div className="hidden bg-brand-950 text-xs text-brand-100 md:block">
        <div className="container-page flex h-9 items-center justify-between">
          <div className="flex items-center gap-5">
            <a href="tel:074606389" className="flex items-center gap-1.5 hover:text-white">
              <Phone className="h-3.5 w-3.5" /> สาขาพัทลุง 074-606-389
            </a>
            <a href="tel:024033145" className="flex items-center gap-1.5 hover:text-white">
              <Phone className="h-3.5 w-3.5" /> สำนักงานใหญ่ 02-403-3145
            </a>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> จันทร์ - เสาร์ 08:00 - 17:00
            </span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/paidstatus" className="flex items-center gap-1.5 hover:text-white">
              <Truck className="h-3.5 w-3.5" /> ติดตามคำสั่งซื้อ
            </Link>
            <Link href="/payment-notice" className="flex items-center gap-1.5 hover:text-white">
              <CreditCard className="h-3.5 w-3.5" /> แจ้งชำระเงิน
            </Link>
          </div>
        </div>
      </div>

      <header className={cn("sticky top-0 z-40 border-b bg-white/90 backdrop-blur-md transition-shadow", scrolled ? "border-slate-200 shadow-sm" : "border-transparent")}>
        <div className="container-page flex h-16 items-center gap-4 lg:h-[72px]">
          <button className="btn btn-ghost btn-icon -ml-2 lg:hidden" onClick={() => setDrawer(true)} aria-label="เปิดเมนู">
            <Menu className="h-6 w-6" />
          </button>

          <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Best Medical หน้าหลัก">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Best Medical" className="h-10 w-auto lg:h-12" />
            <div className="hidden leading-tight xl:block">
              <p className="text-[15px] font-semibold text-brand-900">เบสท เมดิคอล</p>
              <p className="text-[11px] text-slate-500">ศูนย์รวมอุปกรณ์การแพทย์ครบวงจร</p>
            </div>
          </Link>

          <SearchBox className="mx-auto hidden max-w-xl flex-1 md:block" />

          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <AccountMenu />
            <Link href="/cart" className="btn btn-ghost btn-icon relative" aria-label={`ตะกร้าสินค้า ${count} ชิ้น`}>
              <ShoppingCart className="h-6 w-6" />
              {ready && count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-brand px-1 text-[11px] font-bold text-white ring-2 ring-white">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Desktop nav row */}
        <nav className="hidden border-t border-slate-100 lg:block">
          <div className="container-page flex h-12 items-center gap-1">
            <CategoryMenu />
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive(l.href) ? "bg-brand-50 text-brand-800" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 animate-fade-in bg-slate-900/50 backdrop-blur-sm" onClick={() => setDrawer(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm animate-slide-in-right flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Best Medical" className="h-10 w-auto" />
              <button className="btn btn-ghost btn-icon" onClick={() => setDrawer(false)} aria-label="ปิดเมนู">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <SearchBox onDone={() => setDrawer(false)} />
            </div>
            <nav className="flex-1 overflow-y-auto px-2">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "block rounded-xl px-4 py-3 text-[15px] font-medium",
                    isActive(l.href) ? "bg-brand-50 text-brand-800" : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="space-y-2 border-t border-slate-100 p-4">
              {user ? (
                <>
                  <p className="px-1 text-sm text-slate-500">
                    สวัสดี, <span className="font-medium text-slate-800">{user.name}</span>
                  </p>
                  {isStaff && (
                    <Link href="/admin/dashboard" className="btn btn-primary w-full">
                      <LayoutDashboard className="h-4 w-4" /> ระบบหลังบ้าน
                    </Link>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/user/history" className="btn btn-secondary">ประวัติสั่งซื้อ</Link>
                    <Link href="/user/profile" className="btn btn-secondary">ข้อมูลส่วนตัว</Link>
                  </div>
                  <button onClick={() => logout()} className="btn btn-danger-soft w-full">
                    <LogOut className="h-4 w-4" /> ออกจากระบบ
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/login" className="btn btn-secondary">เข้าสู่ระบบ</Link>
                  <Link href="/register" className="btn btn-primary">สมัครสมาชิก</Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
