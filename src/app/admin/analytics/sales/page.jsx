"use client";

import { useEffect, useState } from "react";
import { Wallet, ShoppingBag, Receipt, Users, PackageCheck, XCircle, Clock, UserPlus } from "lucide-react";
import { AdminHeader } from "@/app/components/admin";
import { Alert, StatusBadge } from "@/app/components/ui";
import {
  useDateRange, RangePicker, Kpi, Panel, AreaChart, BarList, Donut, AnalyticsSkeleton, ExportButton, exportCsv, num, baht, pct,
} from "@/app/components/admin/charts";
import { api, imgSrc } from "@/app/lib/format";

const WEEKDAYS = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์", "อาทิตย์"];
const STATUS_ORDER = ["PENDING", "PAID", "SHIPPING", "COMPLETED", "CANCELLED"];

export default function AnalyticsSalesPage() {
  const { range, setRange, query } = useDateRange(30);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    setError("");
    api(`/api/admin/analytics/sales?${query}`)
      .then((d) => alive && setData(d))
      .catch((e) => alive && setError(e.message));
    return () => {
      alive = false;
    };
  }, [query]);

  const c = data?.current;
  const p = data?.previous;
  const maxWd = data ? Math.max(1, ...data.weekday.map((w) => w.revenue)) : 1;

  return (
    <div>
      <AdminHeader
        title="วิเคราะห์ยอดขาย"
        description="รายได้นับเฉพาะคำสั่งซื้อที่ยืนยันการชำระแล้ว (ชำระแล้ว / กำลังจัดส่ง / สำเร็จ)"
        actions={<RangePicker range={range} setRange={setRange} />}
      />
      {error && <Alert tone="error" className="mb-4">{error}</Alert>}
      {!data ? (
        <AnalyticsSkeleton />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Kpi icon={Wallet} tone="emerald" label="รายได้" value={baht(c.revenue)} current={c.revenue} previous={p.revenue} />
            <Kpi icon={ShoppingBag} label="คำสั่งซื้อที่ชำระแล้ว" value={num(c.paidOrders)} current={c.paidOrders} previous={p.paidOrders}
              hint={`จากทั้งหมด ${num(c.orders)} คำสั่งซื้อ`} />
            <Kpi icon={Receipt} tone="violet" label="ยอดเฉลี่ยต่อคำสั่งซื้อ (AOV)" value={baht(c.aov)} current={c.aov} previous={p.aov} />
            <Kpi icon={PackageCheck} tone="accent" label="จำนวนชิ้นที่ขายได้" value={num(c.itemsSold)} current={c.itemsSold} previous={p.itemsSold} />
            <Kpi icon={Users} tone="sky" label="ลูกค้าที่สั่งซื้อ" value={num(c.customers)} current={c.customers} previous={p.customers}
              hint={`ใหม่ ${num(c.newCustomers)} · ซื้อซ้ำ ${num(c.returningCustomers)}`} />
            <Kpi icon={UserPlus} tone="brand" label="อัตราลูกค้าซื้อซ้ำ" value={pct(c.customers ? (c.returningCustomers / c.customers) * 100 : 0, 0)} />
            <Kpi icon={Clock} tone="amber" label="ยอดรอชำระ/รอตรวจสอบ" value={baht(c.pendingValue)} hint="คำสั่งซื้อสถานะรอชำระ" />
            <Kpi icon={XCircle} tone="red" label="อัตรายกเลิก" value={pct(c.cancelRate)} current={c.cancelRate} previous={p.cancelRate} invert
              hint={`${num(c.cancelled)} คำสั่งซื้อ`} />
          </div>

          <Panel
            title="รายได้และจำนวนคำสั่งซื้อรายวัน"
            action={
              <ExportButton
                onClick={() =>
                  exportCsv(`sales_${data.range.from}_${data.range.to}.csv`, data.daily, [
                    { key: "date", label: "วันที่" },
                    { key: "orders", label: "คำสั่งซื้อทั้งหมด" },
                    { key: "paidOrders", label: "ชำระแล้ว" },
                    { key: "revenue", label: "รายได้ (บาท)" },
                  ])
                }
              />
            }
          >
            <AreaChart
              data={data.daily}
              series={[{ key: "revenue", label: "รายได้", color: "#029e8e", format: baht }]}
              format={baht}
            />
          </Panel>

          <div className="grid gap-6 lg:grid-cols-2">
            <Panel title="สถานะคำสั่งซื้อ">
              <ul className="space-y-2">
                {STATUS_ORDER.map((s) => (
                  <li key={s} className="flex items-center justify-between text-sm">
                    <StatusBadge status={s} />
                    <span className="font-medium">{num(data.byStatus[s] || 0)}</span>
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel title="วิธีรับสินค้า">
              <Donut items={data.byShipping} label="คำสั่งซื้อ" />
            </Panel>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Panel
              title="สินค้าขายดี (ตามรายได้)"
              action={
                <ExportButton
                  onClick={() =>
                    exportCsv(`top_products_${data.range.from}_${data.range.to}.csv`, data.topProducts, [
                      { key: "name", label: "สินค้า" },
                      { key: "quantity", label: "จำนวนชิ้น" },
                      { key: "orders", label: "จำนวนคำสั่งซื้อ" },
                      { key: "revenue", label: "รายได้ (บาท)" },
                    ])
                  }
                />
              }
            >
              {data.topProducts.length ? (
                <ul className="divide-y divide-slate-100">
                  {data.topProducts.map((pr, i) => (
                    <li key={pr.id} className="flex items-center gap-3 py-2.5">
                      <span className="w-5 text-center text-sm font-semibold text-slate-400">{i + 1}</span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imgSrc(pr.image)} alt="" className="h-10 w-10 shrink-0 rounded-lg bg-slate-50 object-contain" onError={(e) => (e.currentTarget.src = "/placeholder.png")} />
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-sm font-medium text-slate-800">{pr.name}</p>
                        <p className="text-xs text-slate-500">{num(pr.quantity)} ชิ้น · {num(pr.orders)} คำสั่งซื้อ</p>
                      </div>
                      <span className="shrink-0 text-sm font-semibold text-slate-900">{baht(pr.revenue)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-6 text-center text-sm text-slate-400">ยังไม่มียอดขายในช่วงนี้</p>
              )}
            </Panel>
            <Panel title="รายได้ตามหมวดหมู่">
              <BarList items={data.categories} valueKey="revenue" format={baht} color="bg-accent-500/15" empty="ยังไม่มียอดขายในช่วงนี้" />
            </Panel>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Panel title="ยอดขายตามวันในสัปดาห์" description="ใช้วางแผนโปรโมชันหรือจำนวนพนักงาน">
              <div className="flex h-48 items-end gap-2">
                {data.weekday.map((w, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1" title={`${WEEKDAYS[i]}: ${baht(w.revenue)} (${num(w.orders)} คำสั่งซื้อ)`}>
                    <span className="text-[11px] text-slate-500">{w.orders ? num(w.orders) : ""}</span>
                    <div className="flex w-full flex-1 items-end">
                      <div className="w-full rounded-t-lg bg-gradient-to-t from-brand-700 to-brand-400" style={{ height: `${(w.revenue / maxWd) * 100}%`, minHeight: w.revenue ? 4 : 0 }} />
                    </div>
                    <span className="text-xs text-slate-600">{WEEKDAYS[i].slice(0, 2)}</span>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel title="ลูกค้าที่ซื้อสูงสุด">
              {data.topCustomers.length ? (
                <ul className="divide-y divide-slate-100">
                  {data.topCustomers.map((cu) => (
                    <li key={cu.email} className="flex items-center justify-between gap-3 py-2 text-sm">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-800">{cu.name || cu.email}</p>
                        <p className="truncate text-xs text-slate-500">{cu.email} · {num(cu.orders)} คำสั่งซื้อ</p>
                      </div>
                      <span className="shrink-0 font-semibold">{baht(cu.spent)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-6 text-center text-sm text-slate-400">ยังไม่มีข้อมูล</p>
              )}
            </Panel>
          </div>
        </div>
      )}
    </div>
  );
}
