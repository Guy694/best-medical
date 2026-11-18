"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Users, Eye, MousePointerClick, Timer, TrendingUp, Activity, Search, ShoppingCart, LogOut } from "lucide-react";
import { AdminHeader } from "@/app/components/admin";
import { Alert, Badge } from "@/app/components/ui";
import {
  useDateRange, RangePicker, Kpi, Panel, AreaChart, BarList, Donut, Heatmap, Funnel,
  AnalyticsSkeleton, ExportButton, exportCsv, num, pct, duration,
} from "@/app/components/admin/charts";
import { api } from "@/app/lib/format";

const SOURCE_LABEL = {
  direct: "เข้าโดยตรง / บุ๊กมาร์ก", google: "Google", facebook: "Facebook", line: "LINE", bing: "Bing",
  youtube: "YouTube", tiktok: "TikTok", instagram: "Instagram", shopee: "Shopee", lazada: "Lazada",
};
const DEVICE_LABEL = { mobile: "มือถือ", desktop: "คอมพิวเตอร์", tablet: "แท็บเล็ต" };

export default function AnalyticsTrafficPage() {
  const { range, setRange, query } = useDateRange(30);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    setError("");
    api(`/api/admin/analytics/traffic?${query}`)
      .then((d) => alive && setData(d))
      .catch((e) => alive && setError(e.message));
    return () => {
      alive = false;
    };
  }, [query]);

  const c = data?.current;
  const p = data?.previous;

  return (
    <div>
      <AdminHeader
        title="สถิติผู้เข้าชมเว็บไซต์"
        description="จำนวนผู้เข้าชม แหล่งที่มา พฤติกรรม และเส้นทางสู่การสั่งซื้อ (ไม่นับการเข้าชมของพนักงานและบอท)"
        actions={<RangePicker range={range} setRange={setRange} />}
      />
      {error && <Alert tone="error" className="mb-4">{error}</Alert>}
      {!data ? (
        <AnalyticsSkeleton />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            กำลังออนไลน์ตอนนี้ <b className="text-slate-900">{num(data.online)}</b> คน (5 นาทีล่าสุด)
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Kpi icon={Users} label="ผู้เข้าชม (คน)" value={num(c.visitors)} current={c.visitors} previous={p.visitors}
              hint={`ใหม่ ${num(c.newVisitors)} · กลับมาซ้ำ ${num(c.returningVisitors)}`} />
            <Kpi icon={Activity} tone="accent" label="จำนวนการเข้าชม (เซสชัน)" value={num(c.sessions)} current={c.sessions} previous={p.sessions} />
            <Kpi icon={Eye} tone="violet" label="จำนวนหน้าที่ถูกเปิด" value={num(c.pageviews)} current={c.pageviews} previous={p.pageviews}
              hint={`เฉลี่ย ${num(c.pagesPerSession, 1)} หน้า/การเข้าชม`} />
            <Kpi icon={TrendingUp} tone="emerald" label="อัตราการสั่งซื้อ (Conversion)" value={pct(c.conversionRate, 2)}
              current={c.conversionRate} previous={p.conversionRate} hint={`${num(c.purchases)} คำสั่งซื้อจากเว็บ`} />
            <Kpi icon={Timer} tone="sky" label="เวลาเฉลี่ยต่อการเข้าชม" value={duration(c.avgDuration)} current={c.avgDuration} previous={p.avgDuration} />
            <Kpi icon={LogOut} tone="amber" label="อัตราออกทันที (Bounce)" value={pct(c.bounceRate)} current={c.bounceRate} previous={p.bounceRate} invert
              hint="ดูหน้าเดียวแล้วออก — ยิ่งต่ำยิ่งดี" />
            <Kpi icon={ShoppingCart} tone="brand" label="ยอดสั่งซื้อจากเว็บ" value={`฿${num(c.purchaseValue)}`} current={c.purchaseValue} previous={p.purchaseValue} />
            <Kpi icon={MousePointerClick} tone="accent" label="ผู้เข้าชมใหม่" value={pct(c.visitors ? (c.newVisitors / c.visitors) * 100 : 0, 0)}
              hint={`${num(c.newVisitors)} จาก ${num(c.visitors)} คน`} />
          </div>

          <Panel
            title="แนวโน้มผู้เข้าชมรายวัน"
            description={`${data.range.days} วัน`}
            action={
              <ExportButton
                onClick={() =>
                  exportCsv(`visitors_${data.range.from}_${data.range.to}.csv`, data.daily, [
                    { key: "date", label: "วันที่" },
                    { key: "visitors", label: "ผู้เข้าชม" },
                    { key: "sessions", label: "การเข้าชม" },
                    { key: "pageviews", label: "หน้าที่เปิด" },
                  ])
                }
              />
            }
          >
            <AreaChart
              data={data.daily}
              series={[
                { key: "pageviews", label: "หน้าที่เปิด", color: "#c7d2fe" },
                { key: "sessions", label: "การเข้าชม", color: "#029e8e" },
                { key: "visitors", label: "ผู้เข้าชม", color: "#1c30bd" },
              ]}
            />
          </Panel>

          <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
            <Panel title="เส้นทางสู่การสั่งซื้อ (Funnel)" description="จำนวนเซสชันที่ไปถึงแต่ละขั้น — ดูว่าลูกค้าหลุดออกที่ขั้นไหนมากที่สุด">
              <Funnel steps={data.funnel} />
            </Panel>
            <Panel title="แหล่งที่มาของผู้เข้าชม" description="นับจากหน้าแรกที่เข้ามาในแต่ละการเข้าชม">
              <BarList items={data.sources} renderLabel={(s) => SOURCE_LABEL[s.name] || s.name} />
            </Panel>
          </div>

          <Panel title="หน้าที่ถูกเข้าชมมากที่สุด">
            {data.topPages.length ? (
              <div className="-m-5 overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>หน้า</th>
                      <th className="text-right">เปิดดู</th>
                      <th className="text-right">ผู้เข้าชม</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topPages.map((pg) => (
                      <tr key={pg.path}>
                        <td>
                          <Link href={pg.path} target="_blank" className="line-clamp-1 font-medium text-slate-800 hover:text-brand-700">
                            {pg.title}
                          </Link>
                          <p className="text-xs text-slate-400">{pg.path}</p>
                        </td>
                        <td className="text-right font-medium">{num(pg.views)}</td>
                        <td className="text-right text-slate-600">{num(pg.visitors)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-slate-400">ยังไม่มีข้อมูล</p>
            )}
          </Panel>

          <div className="grid gap-6 lg:grid-cols-3">
            <Panel title="อุปกรณ์">
              <Donut items={data.devices.map((d) => ({ ...d, name: DEVICE_LABEL[d.name] || d.name }))} label="การเข้าชม" />
            </Panel>
            <Panel title="เบราว์เซอร์ / แอป">
              <BarList items={data.browsers} color="bg-accent-500/15" />
            </Panel>
            <Panel title="ระบบปฏิบัติการ">
              <BarList items={data.os} color="bg-violet-500/15" />
            </Panel>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <Panel title="ช่วงเวลาที่มีผู้เข้าชม" description="วันในสัปดาห์ × ชั่วโมง (เวลาไทย) — ใช้วางแผนโพสต์โปรโมชันหรือจัดคนตอบแชท">
              <Heatmap grid={data.heatmap} unit="หน้า" />
            </Panel>
            <Panel title="คำค้นหายอดนิยม" description="คำที่ลูกค้าพิมพ์ค้นหาในเว็บ">
              {data.searches.length ? (
                <ul className="divide-y divide-slate-100">
                  {data.searches.map((s) => (
                    <li key={s.term} className="flex items-center justify-between gap-3 py-2 text-sm">
                      <span className="flex min-w-0 items-center gap-2">
                        <Search className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                        <Link href={`/product?q=${encodeURIComponent(s.term)}`} target="_blank" className="truncate text-slate-700 hover:text-brand-700">
                          {s.term}
                        </Link>
                        {s.results === 0 && <Badge tone="red">ไม่พบสินค้า</Badge>}
                      </span>
                      <span className="shrink-0 font-medium">{num(s.count)} ครั้ง</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-6 text-center text-sm text-slate-400">ยังไม่มีการค้นหา</p>
              )}
              {data.searches.some((s) => s.results === 0) && (
                <Alert tone="warning" className="mt-4">
                  คำที่ขึ้น “ไม่พบสินค้า” คือสิ่งที่ลูกค้าต้องการแต่ร้านยังไม่มี/ตั้งชื่อไม่ตรง — พิจารณาเพิ่มสินค้าหรือเพิ่มคำนั้นในชื่อ/รายละเอียดสินค้า
                </Alert>
              )}
            </Panel>
          </div>
        </div>
      )}
    </div>
  );
}
