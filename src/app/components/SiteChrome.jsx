"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X, Phone, ArrowUp } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=100070566921817";
const LINE_URL = "https://line.me/ti/p/bestmedical";

function FloatingContact() {
  const [open, setOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="no-print fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {open && (
        <div className="w-64 animate-slide-up overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="bg-brand-700 px-4 py-3 text-white">
            <p className="font-semibold">ติดต่อเรา</p>
            <p className="text-xs text-brand-100">สอบถามสินค้า/ราคา ตอบกลับรวดเร็ว</p>
          </div>
          <div className="space-y-1 p-2">
            <a href={LINE_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl p-2.5 text-sm hover:bg-slate-50">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#06C755] text-xs font-bold text-white">LINE</span>
              แชทผ่าน LINE
            </a>
            <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl p-2.5 text-sm hover:bg-slate-50">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1877F2] text-base font-bold text-white">f</span>
              Facebook Messenger
            </a>
            <a href="tel:074606389" className="flex items-center gap-3 rounded-xl p-2.5 text-sm hover:bg-slate-50">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-600 text-white">
                <Phone className="h-4 w-4" />
              </span>
              โทร 074-606-389
            </a>
          </div>
        </div>
      )}
      {showTop && !open && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex h-11 w-11 animate-fade-in items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-lg hover:text-brand-700"
          aria-label="กลับขึ้นด้านบน"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-14 items-center gap-2 rounded-full bg-accent-600 px-5 text-white shadow-xl shadow-accent-600/30 transition hover:bg-accent-700"
        aria-expanded={open}
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        <span className="hidden text-sm font-medium sm:inline">{open ? "ปิด" : "ติดต่อเรา"}</span>
      </button>
    </div>
  );
}

function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try {
      setShow(!localStorage.getItem("cookiesAccepted"));
    } catch {}
  }, []);
  if (!show) return null;
  return (
    <div className="no-print fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl animate-slide-up rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:inset-x-6 sm:flex sm:items-center sm:gap-4">
      <p className="flex-1 text-sm text-slate-600">
        เว็บไซต์นี้ใช้คุกกี้ที่จำเป็นต่อการทำงาน เช่น การเข้าสู่ระบบและตะกร้าสินค้า เพื่อให้คุณได้รับประสบการณ์การใช้งานที่ดีที่สุด
      </p>
      <button
        className="btn btn-primary mt-3 w-full sm:mt-0 sm:w-auto"
        onClick={() => {
          localStorage.setItem("cookiesAccepted", "true");
          setShow(false);
        }}
      >
        ยอมรับ
      </button>
    </div>
  );
}

/** Storefront chrome (navbar/footer); the admin area renders its own shell. */
export default function SiteChrome({ children }) {
  const pathname = usePathname() || "/";
  if (pathname.startsWith("/admin")) return children;
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingContact />
      <CookieBanner />
    </div>
  );
}
