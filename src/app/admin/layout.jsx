"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, FolderTree, Package, FileText, Users, UserCog, ShoppingBag, MessageSquare,
  CreditCard, Menu, X, LogOut, Store, ChevronRight,
} from "lucide-react";
import { useAuth } from "@/app/components/Providers";
import { PageLoader } from "@/app/components/ui";
import { cn } from "@/app/lib/format";

const NAV = [
  { group: "ภาพรวม", items: [{ href: "/admin/dashboard", label: "แดชบอร์ด", icon: LayoutDashboard }] },
  {
    group: "การขาย",
    items: [
      { href: "/admin/orders", label: "คำสั่งซื้อ", icon: ShoppingBag },
      { href: "/admin/payment-notice", label: "ตรวจสอบการชำระเงิน", icon: CreditCard },
      { href: "/admin/user/customer", label: "ลูกค้า", icon: Users },
      { href: "/admin/contacts", label: "ข้อความจากลูกค้า", icon: MessageSquare },
    ],
  },
  {
    group: "แคตตาล็อก",
    items: [
      { href: "/admin/product", label: "สินค้า", icon: Package },
      { href: "/admin/categories", label: "หมวดหมู่", icon: FolderTree },
      { href: "/admin/articles", label: "บทความ", icon: FileText },
    ],
  },
  { group: "ระบบ", adminOnly: true, items: [{ href: "/admin/user/staff", label: "พนักงานและสิทธิ์", icon: UserCog }] },
];

function SidebarContent({ pathname, isAdmin, onNavigate }) {
  return (
    <div className="flex h-full flex-col">
      <Link href="/admin/dashboard" className="flex items-center gap-3 px-5 py-5" onClick={onNavigate}>
        <div className="rounded-xl bg-white p-1.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" className="h-8 w-auto" />
        </div>
        <div className="leading-tight">
          <p className="font-semibold text-white">Best Medical</p>
          <p className="text-xs text-brand-300">ระบบจัดการร้านค้า</p>
        </div>
      </Link>
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
        {NAV.filter((g) => !g.adminOnly || isAdmin).map((g) => (
          <div key={g.group}>
            <p className="mb-2 px-3 text-[11px] font-semibold tracking-wider text-brand-400 uppercase">{g.group}</p>
            <ul className="space-y-1">
              {g.items.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(href + "/");
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={onNavigate}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                        active ? "bg-white text-brand-900 shadow-sm" : "text-brand-100 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      <Icon className={cn("h-[18px] w-[18px]", active ? "text-brand-700" : "text-brand-300 group-hover:text-white")} />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-white/10 p-3">
        <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-brand-200 hover:bg-white/10 hover:text-white">
          <Store className="h-[18px] w-[18px]" /> ไปหน้าร้านค้า
        </Link>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { user, loading, isStaff, isAdmin, logout } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!loading && !isStaff) window.location.href = `/login?next=${encodeURIComponent(pathname)}`;
  }, [loading, isStaff, pathname]);

  if (loading || !isStaff) return <PageLoader label="กำลังตรวจสอบสิทธิ์..." />;

  const current = NAV.flatMap((g) => g.items).find((i) => pathname === i.href || pathname.startsWith(i.href + "/"));

  return (
    <div className="min-h-screen bg-slate-100/70">
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-brand-950 lg:block">
        <SidebarContent pathname={pathname} isAdmin={isAdmin} />
      </aside>

      {/* mobile sidebar */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 animate-fade-in bg-slate-900/60" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 animate-slide-in-right bg-brand-950 shadow-2xl">
            <button className="absolute top-4 right-3 rounded-lg p-2 text-brand-200 hover:bg-white/10" onClick={() => setOpen(false)} aria-label="ปิดเมนู">
              <X className="h-5 w-5" />
            </button>
            <SidebarContent pathname={pathname} isAdmin={isAdmin} onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
          <button className="btn btn-ghost btn-icon -ml-2 lg:hidden" onClick={() => setOpen(true)} aria-label="เปิดเมนู">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <span className="hidden sm:inline">หลังบ้าน</span>
            <ChevronRight className="hidden h-4 w-4 sm:block" />
            <span className="font-medium text-slate-800">{current?.label || "จัดการ"}</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-800">{user.name}</p>
              <p className="text-xs text-slate-500">{user.role === "ADMIN" ? "ผู้ดูแลระบบ" : "เจ้าหน้าที่"}</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700">
              {user.name?.trim()?.[0] || "A"}
            </span>
            <button onClick={() => logout({ redirect: "/login" })} className="btn btn-ghost btn-icon text-slate-500 hover:text-red-600" title="ออกจากระบบ">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
