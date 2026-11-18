"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Users, RefreshCw, Download, Mail, Phone, MapPin, ShoppingBag, CalendarDays, BadgeCheck, UserPlus, Wallet } from "lucide-react";
import { AdminHeader, Pager, SearchInput, StatCard, paginate } from "@/app/components/admin";
import { Alert, Badge, EmptyState, Modal } from "@/app/components/ui";
import { api, cn, formatDate, formatDateTime, formatTHB } from "@/app/lib/format";

const PAGE_SIZE = 20;
const SORTS = {
  newest: { label: "สมัครล่าสุด", fn: (a, b) => new Date(b.createdAt) - new Date(a.createdAt) },
  spent: { label: "ยอดซื้อสูงสุด", fn: (a, b) => b.total_spent - a.total_spent },
  orders: { label: "สั่งซื้อบ่อยที่สุด", fn: (a, b) => b.order_count - a.order_count },
  recent: { label: "สั่งซื้อล่าสุด", fn: (a, b) => new Date(b.last_order_at || 0) - new Date(a.last_order_at || 0) },
};
const isVerified = (c) => Number(c.verified) === 1 || c.verified === true;
const initial = (name) => (name || "?").trim().charAt(0).toUpperCase();

function exportCsv(rows) {
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
  const head = ["ชื่อ-นามสกุล", "อีเมล", "เบอร์โทร", "ที่อยู่", "ยืนยันอีเมล", "จำนวนคำสั่งซื้อ", "ยอดซื้อรวม", "สั่งซื้อล่าสุด", "วันที่สมัคร"];
  const lines = rows.map((c) =>
    [
      c.name,
      c.email,
      c.phone,
      c.address,
      isVerified(c) ? "ยืนยันแล้ว" : "ยังไม่ยืนยัน",
      c.order_count,
      c.total_spent,
      c.last_order_at ? formatDateTime(c.last_order_at) : "",
      formatDateTime(c.createdAt),
    ]
      .map(esc)
      .join(",")
  );
  const blob = new Blob(["\uFEFF" + [head.map(esc).join(","), ...lines].join("\r\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `customers-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminCustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api("/api/admin/user/customer");
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = q
      ? customers.filter((c) => [c.name, c.email, c.phone, c.address].some((v) => String(v || "").toLowerCase().includes(q)))
      : customers;
    return [...rows].sort(SORTS[sort].fn);
  }, [customers, search, sort]);

  const stats = useMemo(() => {
    const monthAgo = Date.now() - 30 * 24 * 3600 * 1000;
    return {
      total: customers.length,
      buyers: customers.filter((c) => c.order_count > 0).length,
      newMonth: customers.filter((c) => new Date(c.createdAt).getTime() >= monthAgo).length,
      spent: customers.reduce((s, c) => s + (Number(c.total_spent) || 0), 0),
    };
  }, [customers]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const { rows } = paginate(filtered, safePage, PAGE_SIZE);

  return (
    <div>
      <AdminHeader
        title="ลูกค้า"
        description="ข้อมูลลูกค้าที่ลงทะเบียนและสถิติการสั่งซื้อ"
        actions={
          <>
            <button className="btn btn-secondary" onClick={() => exportCsv(filtered)} disabled={!filtered.length}>
              <Download className="h-4 w-4" /> ส่งออก CSV
            </button>
            <button className="btn btn-secondary" onClick={load} disabled={loading}>
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} /> รีเฟรช
            </button>
          </>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="ลูกค้าทั้งหมด" value={stats.total.toLocaleString("th-TH")} tone="brand" />
        <StatCard icon={ShoppingBag} label="เคยสั่งซื้อ" value={stats.buyers.toLocaleString("th-TH")} tone="accent" />
        <StatCard icon={UserPlus} label="สมัครใหม่ 30 วัน" value={stats.newMonth.toLocaleString("th-TH")} tone="violet" />
        <StatCard icon={Wallet} label="ยอดซื้อรวม" value={formatTHB(stats.spent)} tone="emerald" />
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="ค้นหาชื่อ, อีเมล, เบอร์โทร..."
          className="sm:w-80"
        />
        <div className="flex items-center gap-2">
          <label htmlFor="cust-sort" className="text-sm whitespace-nowrap text-slate-500">
            เรียงตาม
          </label>
          <select id="cust-sort" className="input w-auto" value={sort} onChange={(e) => setSort(e.target.value)}>
            {Object.entries(SORTS).map(([k, s]) => (
              <option key={k} value={k}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <Alert tone="error" title="โหลดข้อมูลไม่สำเร็จ" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="card overflow-hidden">
        {loading && !customers.length ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-12 w-full" />
            ))}
          </div>
        ) : !filtered.length ? (
          <EmptyState
            icon={Users}
            title={customers.length ? "ไม่พบข้อมูลที่ค้นหา" : "ยังไม่มีข้อมูลลูกค้า"}
            action={
              search ? (
                <button className="btn btn-secondary" onClick={() => setSearch("")}>
                  ล้างการค้นหา
                </button>
              ) : null
            }
          />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="table">
                <thead>
                  <tr>
                    <th>ลูกค้า</th>
                    <th>เบอร์โทร</th>
                    <th>สถานะ</th>
                    <th className="text-right">คำสั่งซื้อ</th>
                    <th className="text-right">ยอดซื้อรวม</th>
                    <th>สั่งซื้อล่าสุด</th>
                    <th>วันที่สมัคร</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((c) => (
                    <tr
                      key={c.id}
                      className="cursor-pointer hover:bg-slate-50"
                      onClick={() => setSelected(c)}
                      tabIndex={0}
                      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setSelected(c))}
                    >
                      <td>
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 font-semibold text-brand-700">
                            {initial(c.name)}
                          </span>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-800">{c.name || "-"}</p>
                            <p className="text-xs text-slate-500">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap text-slate-600">{c.phone || "-"}</td>
                      <td>{isVerified(c) ? <Badge tone="emerald">ยืนยันแล้ว</Badge> : <Badge tone="amber">ยังไม่ยืนยัน</Badge>}</td>
                      <td className="text-right">{c.order_count}</td>
                      <td className="text-right font-medium whitespace-nowrap">{formatTHB(c.total_spent)}</td>
                      <td className="whitespace-nowrap text-slate-500">{c.last_order_at ? formatDate(c.last_order_at) : "-"}</td>
                      <td className="whitespace-nowrap text-slate-500">{formatDate(c.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="divide-y divide-slate-100 md:hidden">
              {rows.map((c) => (
                <li key={c.id}>
                  <button className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-slate-50" onClick={() => setSelected(c)}>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 font-semibold text-brand-700">
                      {initial(c.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-slate-800">{c.name || "-"}</p>
                      <p className="truncate text-xs text-slate-500">{c.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">{formatTHB(c.total_spent)}</p>
                      <p className="text-xs text-slate-500">{c.order_count} คำสั่งซื้อ</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
            <Pager page={safePage} pageCount={pageCount} onChange={setPage} total={filtered.length} />
          </>
        )}
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="ข้อมูลลูกค้า"
        footer={
          selected && (
            <>
              <button className="btn btn-secondary" onClick={() => setSelected(null)}>
                ปิด
              </button>
              <Link href={`/admin/orders?q=${encodeURIComponent(selected.email)}`} className="btn btn-primary">
                <ShoppingBag className="h-4 w-4" /> ดูคำสั่งซื้อของลูกค้า
              </Link>
            </>
          )
        }
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-700 text-xl font-semibold text-white">
                {initial(selected.name)}
              </span>
              <div className="min-w-0">
                <p className="text-lg font-semibold text-slate-900">{selected.name || "-"}</p>
                <div className="mt-1">
                  {isVerified(selected) ? (
                    <Badge tone="emerald">
                      <BadgeCheck className="h-3.5 w-3.5" /> ยืนยันอีเมลแล้ว
                    </Badge>
                  ) : (
                    <Badge tone="amber">ยังไม่ยืนยันอีเมล</Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-lg font-bold text-slate-900">{selected.order_count}</p>
                <p className="text-xs text-slate-500">คำสั่งซื้อ</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-lg font-bold text-emerald-600">{formatTHB(selected.total_spent, { decimals: 0 })}</p>
                <p className="text-xs text-slate-500">ยอดซื้อรวม</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-sm font-bold text-slate-900">{selected.last_order_at ? formatDate(selected.last_order_at) : "-"}</p>
                <p className="text-xs text-slate-500">สั่งซื้อล่าสุด</p>
              </div>
            </div>

            <dl className="space-y-3 text-sm">
              <div className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <a href={`mailto:${selected.email}`} className="link break-all">
                  {selected.email}
                </a>
              </div>
              <div className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                {selected.phone ? (
                  <a href={`tel:${selected.phone}`} className="link">
                    {selected.phone}
                  </a>
                ) : (
                  <span className="text-slate-500">ไม่ระบุ</span>
                )}
              </div>
              <div className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <span className="whitespace-pre-line text-slate-700">{selected.address || "ไม่ระบุที่อยู่"}</span>
              </div>
              <div className="flex gap-3">
                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                <span className="text-slate-700">สมัครสมาชิกเมื่อ {formatDateTime(selected.createdAt)}</span>
              </div>
            </dl>
          </div>
        )}
      </Modal>
    </div>
  );
}
