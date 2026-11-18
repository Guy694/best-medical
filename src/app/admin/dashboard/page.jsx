"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Wallet, ShoppingBag, CreditCard, Truck, Users, MessageSquare, RefreshCw, TrendingUp, PackageX, Trophy, ArrowRight,
} from "lucide-react";
import { AdminHeader, StatCard } from "@/app/components/admin";
import { Alert, EmptyState, StatusBadge } from "@/app/components/ui";
import { ORDER_STATUS, api, cn, formatDate, formatTHB, imgSrc } from "@/app/lib/format";

const THAI_MONTHS = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
const THAI_MONTHS_FULL = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];
const STATUS_ORDER = ["PENDING", "PAID", "SHIPPING", "COMPLETED", "CANCELLED"];
const STATUS_COLORS = {
  PENDING: "#f59e0b",
  PAID: "#1d4ed8",
  SHIPPING: "#8b5cf6",
  COMPLETED: "#10b981",
  CANCELLED: "#ef4444",
};
const num = (n) => Number(n || 0).toLocaleString("th-TH");
const beYear = (y) => Number(y) + 543;

function Skeleton({ className }) {
  return <div className={cn("skeleton", className)} />;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card card-body flex items-start gap-4">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card card-body lg:col-span-2">
          <Skeleton className="mb-6 h-5 w-40" />
          <Skeleton className="h-56 w-full" />
        </div>
        <div className="card card-body">
          <Skeleton className="mb-6 h-5 w-32" />
          <Skeleton className="mx-auto h-40 w-40 rounded-full" />
        </div>
      </div>
      <div className="card card-body space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}

function RevenueChart({ data, year }) {
  const [active, setActive] = useState(null);
  const max = Math.max(1, ...data.map((m) => m.revenue));
  const totalOrders = data.reduce((s, m) => s + m.orders, 0);
  const shown = active != null ? data[active] : null;

  return (
    <div className="card card-body lg:col-span-2">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 font-semibold text-slate-900">
            <TrendingUp className="h-5 w-5 text-brand-700" /> ยอดขายรายเดือน ปี {beYear(year)}
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">นับเฉพาะคำสั่งซื้อที่ชำระเงินแล้ว · คำสั่งซื้อทั้งปี {num(totalOrders)} รายการ</p>
        </div>
        <div className="min-h-[2.5rem] rounded-xl bg-slate-50 px-3 py-1.5 text-right text-sm" aria-live="polite">
          {shown ? (
            <>
              <p className="font-semibold text-slate-900">{formatTHB(shown.revenue)}</p>
              <p className="text-xs text-slate-500">
                {THAI_MONTHS_FULL[active]} · {num(shown.orders)} คำสั่งซื้อ
              </p>
            </>
          ) : (
            <p className="py-1.5 text-xs text-slate-400">ชี้ที่แท่งกราฟเพื่อดูรายละเอียด</p>
          )}
        </div>
      </div>

      <div className="flex h-60 gap-1.5 sm:gap-3">
        {data.map((m, i) => {
          const h = (m.revenue / max) * 100;
          return (
            <button
              type="button"
              key={m.month}
              className="group flex h-full flex-1 flex-col items-center justify-end gap-1.5 focus:outline-none"
              title={`${THAI_MONTHS_FULL[i]}: ${formatTHB(m.revenue)} (${num(m.orders)} คำสั่งซื้อ)`}
              aria-label={`${THAI_MONTHS_FULL[i]} ยอดขาย ${formatTHB(m.revenue)} จำนวน ${m.orders} คำสั่งซื้อ`}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
            >
              <span className={cn("text-[10px] font-medium text-slate-500", m.orders ? "" : "invisible")}>{m.orders}</span>
              <div className="relative flex w-full flex-1 items-end overflow-hidden rounded-lg bg-slate-50">
                <div
                  className={cn(
                    "w-full rounded-lg bg-gradient-to-t transition-all duration-500",
                    active === i ? "from-accent-600 to-accent-400" : "from-brand-700 to-brand-500 group-hover:opacity-90",
                    m.revenue > 0 ? "" : "opacity-0"
                  )}
                  style={{ height: `${Math.max(m.revenue > 0 ? 3 : 0, h)}%` }}
                />
              </div>
              <span className={cn("text-[10px] sm:text-xs", active === i ? "font-semibold text-brand-700" : "text-slate-500")}>
                {THAI_MONTHS[i]}
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] text-slate-400">ตัวเลขเหนือแท่ง = จำนวนคำสั่งซื้อในเดือนนั้น</p>
    </div>
  );
}

function StatusBreakdown({ counts }) {
  const total = STATUS_ORDER.reduce((s, k) => s + (counts?.[k] || 0), 0);
  let acc = 0;
  const stops = STATUS_ORDER.map((k) => {
    const start = (acc / Math.max(total, 1)) * 360;
    acc += counts?.[k] || 0;
    const end = (acc / Math.max(total, 1)) * 360;
    return `${STATUS_COLORS[k]} ${start}deg ${end}deg`;
  });
  const gradient = total ? `conic-gradient(${stops.join(", ")})` : "conic-gradient(#e2e8f0 0deg 360deg)";

  return (
    <div className="card card-body">
      <h2 className="mb-5 font-semibold text-slate-900">สถานะคำสั่งซื้อ</h2>
      <div className="flex flex-col items-center gap-6 sm:flex-row lg:flex-col">
        <div className="relative h-40 w-40 shrink-0 rounded-full" style={{ background: gradient }} role="img" aria-label="สัดส่วนสถานะคำสั่งซื้อ">
          <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-white">
            <span className="text-2xl font-bold text-slate-900">{num(total)}</span>
            <span className="text-xs text-slate-500">คำสั่งซื้อ</span>
          </div>
        </div>
        <ul className="w-full space-y-2.5">
          {STATUS_ORDER.map((k) => {
            const c = counts?.[k] || 0;
            const pct = total ? Math.round((c / total) * 100) : 0;
            return (
              <li key={k}>
                <Link href={`/admin/orders?status=${k}`} className="group block">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-600 group-hover:text-brand-700">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_COLORS[k] }} />
                      {ORDER_STATUS[k].label}
                    </span>
                    <span className="font-medium text-slate-900">
                      {num(c)} <span className="text-xs font-normal text-slate-400">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: STATUS_COLORS[k] }} />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async (y) => {
    setLoading(true);
    setError("");
    try {
      setData(await api(`/api/admin/dashboard?year=${y}`));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(year);
  }, [year, load]);

  const years = useMemo(() => (data?.years?.length ? data.years : [year]), [data, year]);

  return (
    <div>
      <AdminHeader
        title="แดชบอร์ด"
        description="ภาพรวมยอดขาย คำสั่งซื้อ และงานที่ต้องดำเนินการ"
        actions={
          <>
            <label htmlFor="dash-year" className="sr-only">
              เลือกปี
            </label>
            <select id="dash-year" className="input w-auto" value={year} onChange={(e) => setYear(Number(e.target.value))}>
              {years.map((y) => (
                <option key={y} value={y}>
                  ปี {beYear(y)}
                </option>
              ))}
            </select>
            <button className="btn btn-secondary" onClick={() => load(year)} disabled={loading}>
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} /> รีเฟรช
            </button>
          </>
        }
      />

      {error && (
        <Alert tone="error" title="โหลดข้อมูลไม่สำเร็จ" className="mb-6">
          {error}
        </Alert>
      )}

      {loading && !data ? (
        <DashboardSkeleton />
      ) : data ? (
        <div className={cn("space-y-6 transition-opacity", loading && "opacity-60")}>
          {data.awaitingVerification > 0 && (
            <Link
              href="/admin/payment-notice"
              className="flex items-center justify-between gap-3 rounded-2xl border border-sky-200 bg-sky-50 px-5 py-4 text-sm text-sky-900 transition hover:bg-sky-100"
            >
              <span className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 shrink-0 text-sky-600" />
                <span>
                  มีการแจ้งชำระเงิน <b>{num(data.awaitingVerification)}</b> รายการที่รอตรวจสอบ
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-1 font-medium">
                ตรวจสอบเลย <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          )}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard
              icon={Wallet}
              label={`ยอดขายปี ${beYear(data.year)}`}
              value={formatTHB(data.totalRevenue)}
              hint={`ชำระแล้ว ${num(data.paidOrders)} คำสั่งซื้อ`}
              tone="emerald"
            />
            <StatCard
              icon={ShoppingBag}
              label="คำสั่งซื้อทั้งหมด"
              value={num(data.totalOrders)}
              hint={`รอชำระเงิน ${num(data.pendingOrders)} รายการ`}
              tone="brand"
              href="/admin/orders"
            />
            <div className={cn("rounded-2xl", data.awaitingVerification > 0 && "ring-2 ring-sky-400 ring-offset-2 ring-offset-slate-50")}>
              <StatCard
                icon={CreditCard}
                label="รอตรวจสอบการชำระ"
                value={num(data.awaitingVerification)}
                hint={data.awaitingVerification > 0 ? "คลิกเพื่อตรวจสอบสลิป" : "ไม่มีรายการค้าง"}
                tone={data.awaitingVerification > 0 ? "sky" : "accent"}
                href="/admin/payment-notice"
              />
            </div>
            <StatCard
              icon={Truck}
              label="รอจัดส่ง"
              value={num(data.statusCounts?.PAID)}
              hint="ชำระเงินแล้ว รอส่งสินค้า"
              tone="violet"
              href="/admin/orders?status=PAID"
            />
            <StatCard icon={Users} label="ลูกค้า" value={num(data.counts?.customers)} hint="สมาชิกที่ลงทะเบียน" tone="accent" href="/admin/user/customer" />
            <StatCard
              icon={MessageSquare}
              label="ข้อความใหม่"
              value={num(data.counts?.unreadContacts)}
              hint="ข้อความที่ยังไม่อ่าน"
              tone={data.counts?.unreadContacts > 0 ? "amber" : "brand"}
              href="/admin/contacts"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <RevenueChart data={data.monthlyData || []} year={data.year} />
            <StatusBreakdown counts={data.statusCounts} />
          </div>

          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="font-semibold text-slate-900">คำสั่งซื้อล่าสุด</h2>
              <Link href="/admin/orders" className="link text-sm">
                ดูทั้งหมด
              </Link>
            </div>
            {data.recentOrders?.length ? (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>รหัสคำสั่งซื้อ</th>
                      <th>ลูกค้า</th>
                      <th className="text-right">ยอดรวม</th>
                      <th>สถานะ</th>
                      <th>วันที่สั่งซื้อ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentOrders.map((o) => (
                      <tr key={o.order_id}>
                        <td>
                          <Link href={`/admin/orders?q=${encodeURIComponent(o.order_code)}`} className="link font-mono text-sm">
                            {o.order_code}
                          </Link>
                        </td>
                        <td>
                          <p className="font-medium text-slate-800">{o.fullName || "-"}</p>
                          <p className="text-xs text-slate-500">{o.order_email}</p>
                        </td>
                        <td className="text-right font-medium whitespace-nowrap">{formatTHB(o.totalPrice)}</td>
                        <td>
                          <StatusBadge order={{ status: o.status, paidAtdate: o.paidAtdate }} />
                        </td>
                        <td className="whitespace-nowrap text-slate-500">{formatDate(o.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState icon={ShoppingBag} title="ยังไม่มีคำสั่งซื้อ" />
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="card">
              <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
                <Trophy className="h-5 w-5 text-amber-500" />
                <h2 className="font-semibold text-slate-900">สินค้าขายดี ปี {beYear(data.year)}</h2>
              </div>
              {data.topProducts?.length ? (
                <ul className="divide-y divide-slate-100">
                  {data.topProducts.map((p, i) => (
                    <li key={p.id} className="flex items-center gap-3 px-5 py-3">
                      <span className={cn("w-5 text-center text-sm font-bold", i < 3 ? "text-amber-500" : "text-slate-400")}>{i + 1}</span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgSrc(p.image)}
                        alt=""
                        className="h-11 w-11 shrink-0 rounded-lg border border-slate-100 object-cover"
                        onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-800">{p.name}</p>
                        <p className="text-xs text-slate-500">ขายได้ {num(p.quantity)} ชิ้น</p>
                      </div>
                      <span className="text-sm font-semibold whitespace-nowrap text-slate-900">{formatTHB(p.totalRevenue)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState icon={Trophy} title="ยังไม่มีข้อมูลยอดขาย" description="ข้อมูลจะแสดงเมื่อมีคำสั่งซื้อที่ชำระเงินแล้ว" />
              )}
            </div>

            <div className="card">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <h2 className="flex items-center gap-2 font-semibold text-slate-900">
                  <PackageX className="h-5 w-5 text-red-500" /> สินค้าใกล้หมดสต็อก
                </h2>
                <Link href="/admin/product" className="link text-sm">
                  จัดการสินค้า
                </Link>
              </div>
              {data.lowStock?.length ? (
                <ul className="divide-y divide-slate-100">
                  {data.lowStock.map((p) => (
                    <li key={p.id}>
                      <Link href={`/admin/product/edit/${p.id}`} className="flex items-center gap-3 px-5 py-3 transition hover:bg-slate-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imgSrc(p.imageUrl)}
                          alt=""
                          className="h-11 w-11 shrink-0 rounded-lg border border-slate-100 object-cover"
                          onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                        />
                        <p className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">{p.pro_name}</p>
                        <span
                          className={cn(
                            "badge",
                            Number(p.stock) <= 0 ? "bg-red-50 text-red-700 ring-red-600/20" : "bg-amber-50 text-amber-700 ring-amber-600/20"
                          )}
                        >
                          {Number(p.stock) <= 0 ? "หมดสต็อก" : `เหลือ ${num(p.stock)} ชิ้น`}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyState icon={PackageX} title="สต็อกสินค้าเพียงพอ" description="ไม่มีสินค้าที่แสดงอยู่และเหลือไม่เกิน 5 ชิ้น" />
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
