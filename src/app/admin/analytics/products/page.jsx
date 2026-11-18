"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Eye, ShoppingCart, PackageCheck, Wallet, AlertTriangle, PhoneCall, PackageX, EyeOff, ArrowUpDown } from "lucide-react";
import { AdminHeader, SearchInput, Pager, paginate } from "@/app/components/admin";
import { Alert, Badge } from "@/app/components/ui";
import { useDateRange, RangePicker, Kpi, Panel, AnalyticsSkeleton, ExportButton, exportCsv, num, baht, pct } from "@/app/components/admin/charts";
import { api, imgSrc, cn } from "@/app/lib/format";

const SORTS = [
  { key: "views", label: "ยอดเข้าชม" },
  { key: "carts", label: "เพิ่มลงตะกร้า" },
  { key: "sold", label: "จำนวนขาย" },
  { key: "revenue", label: "รายได้" },
  { key: "cartRate", label: "% เพิ่มลงตะกร้า" },
];

function InsightList({ icon: Icon, title, hint, tone, items, metric }) {
  return (
    <div className="card card-body">
      <div className="flex items-center gap-2">
        <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg", tone)}>
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="font-semibold text-slate-900">{title}</h3>
      </div>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
      {items.length ? (
        <ul className="mt-3 space-y-2">
          {items.map((it) => (
            <li key={it.id} className="flex items-center justify-between gap-2 text-sm">
              <Link href={`/admin/product/edit/${it.id}`} className="line-clamp-1 text-slate-700 hover:text-brand-700">
                {it.name}
              </Link>
              <span className="shrink-0 text-xs font-medium text-slate-600">{metric(it)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-slate-400">ไม่มีรายการ 👍</p>
      )}
    </div>
  );
}

export default function AnalyticsProductsPage() {
  const { range, setRange, query } = useDateRange(30);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("views");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let alive = true;
    setError("");
    api(`/api/admin/analytics/products?${query}`)
      .then((d) => alive && setData(d))
      .catch((e) => alive && setError(e.message));
    return () => {
      alive = false;
    };
  }, [query]);
  useEffect(() => setPage(1), [q, sort]);

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (data?.products || [])
      .filter((p) => !s || p.name?.toLowerCase().includes(s) || p.codename?.toLowerCase().includes(s) || p.category?.toLowerCase().includes(s))
      .sort((a, b) => b[sort] - a[sort]);
  }, [data, q, sort]);
  const { rows: pageRows, pageCount } = paginate(rows, page, 15);

  const t = data?.totals;
  return (
    <div>
      <AdminHeader
        title="วิเคราะห์สินค้า"
        description="ความสนใจของลูกค้าเทียบกับยอดขายจริงของแต่ละสินค้า"
        actions={<RangePicker range={range} setRange={setRange} />}
      />
      {error && <Alert tone="error" className="mb-4">{error}</Alert>}
      {!data ? (
        <AnalyticsSkeleton />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Kpi icon={Eye} label="การเข้าชมหน้าสินค้า" value={num(t.views)} />
            <Kpi icon={ShoppingCart} tone="accent" label="เพิ่มลงตะกร้า" value={num(t.carts)} hint={`${pct(t.views ? (t.carts / t.views) * 100 : 0)} ของการเข้าชม`} />
            <Kpi icon={PackageCheck} tone="violet" label="ขายได้ (ชิ้น)" value={num(t.sold)} />
            <Kpi icon={Wallet} tone="emerald" label="รายได้จากสินค้า" value={baht(t.revenue)} />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <InsightList
              icon={AlertTriangle}
              tone="bg-amber-50 text-amber-600"
              title="คนดูเยอะ แต่ยังไม่มีคนซื้อ"
              hint="ลองปรับราคา รูปภาพ หรือรายละเอียดสินค้าให้ชัดเจนขึ้น"
              items={data.insights.viewedNotBought}
              metric={(x) => `${num(x.views)} ครั้ง`}
            />
            <InsightList
              icon={PhoneCall}
              tone="bg-accent-50 text-accent-700"
              title="สินค้าสอบถามราคาที่มีคนสนใจ"
              hint="โอกาสขาย — ควรใส่ราคาหรือเตรียมทีมขายติดต่อกลับ"
              items={data.insights.priceOnRequest}
              metric={(x) => `${num(x.views)} ครั้ง`}
            />
            <InsightList
              icon={PackageX}
              tone="bg-red-50 text-red-600"
              title="สินค้าหมด แต่ยังมีคนสนใจ"
              hint="ควรเติมสต็อกโดยเร็ว"
              items={data.insights.outOfStockDemand}
              metric={(x) => `${num(x.views)} ครั้ง`}
            />
          </div>
          {data.insights.noViews > 0 && (
            <Alert tone="info">
              มีสินค้าที่แสดงบนหน้าร้าน <b>{num(data.insights.noViews)}</b> รายการที่ยังไม่มีใครเข้าชมในช่วงนี้ — อาจต้องปรับชื่อให้ค้นหาง่ายขึ้นหรือนำไปโปรโมต
            </Alert>
          )}

          <Panel
            title="ประสิทธิภาพรายสินค้า"
            action={
              <ExportButton
                onClick={() =>
                  exportCsv(`product_performance_${data.range.from}_${data.range.to}.csv`, rows, [
                    { key: "name", label: "สินค้า" },
                    { key: "codename", label: "รหัส" },
                    { key: "category", label: "หมวดหมู่" },
                    { key: "price", label: "ราคา" },
                    { key: "stock", label: "สต็อก" },
                    { key: "views", label: "เข้าชม" },
                    { key: "viewers", label: "ผู้เข้าชม" },
                    { key: "carts", label: "เพิ่มลงตะกร้า" },
                    { key: "sold", label: "ขายได้ (ชิ้น)" },
                    { key: "revenue", label: "รายได้" },
                    { label: "% เพิ่มลงตะกร้า", value: (r) => r.cartRate.toFixed(1) },
                  ])
                }
              />
            }
          >
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <SearchInput value={q} onChange={setQ} placeholder="ค้นหาสินค้า รหัส หรือหมวดหมู่" className="sm:w-72" />
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <ArrowUpDown className="h-4 w-4" /> เรียงตาม
                <select className="input h-9 w-auto py-1" value={sort} onChange={(e) => setSort(e.target.value)}>
                  {SORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </label>
            </div>
            <div className="-mx-5 overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>สินค้า</th>
                    <th className="text-right">เข้าชม</th>
                    <th className="text-right">ใส่ตะกร้า</th>
                    <th className="text-right">ขายได้</th>
                    <th className="text-right">รายได้</th>
                    <th className="w-40">อัตราใส่ตะกร้า</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={imgSrc(r.image)} alt="" className="h-10 w-10 shrink-0 rounded-lg bg-slate-50 object-contain" onError={(e) => (e.currentTarget.src = "/placeholder.png")} />
                          <div className="min-w-0">
                            <Link href={`/admin/product/edit/${r.id}`} className="line-clamp-1 font-medium text-slate-800 hover:text-brand-700">{r.name}</Link>
                            <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                              {r.category || "-"}
                              {r.hidden && <Badge tone="slate"><EyeOff className="h-3 w-3" /> ซ่อน</Badge>}
                              {r.stock <= 0 && <Badge tone="red">หมด</Badge>}
                              {r.price <= 0 && <Badge tone="sky">สอบถามราคา</Badge>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-right font-medium">{num(r.views)}</td>
                      <td className="text-right">{num(r.carts)}</td>
                      <td className="text-right">{num(r.sold)}</td>
                      <td className="text-right font-medium">{r.revenue ? baht(r.revenue) : "-"}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                            <div className="h-full rounded-full bg-accent-500" style={{ width: `${Math.min(100, r.cartRate)}%` }} />
                          </div>
                          <span className="w-12 text-right text-xs text-slate-600">{r.views ? pct(r.cartRate, 0) : "-"}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!pageRows.length && <p className="py-8 text-center text-sm text-slate-400">ไม่พบสินค้า</p>}
            </div>
            <div className="-mx-5 -mb-5">
              <Pager page={page} pageCount={pageCount} onChange={setPage} total={rows.length} />
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
}
