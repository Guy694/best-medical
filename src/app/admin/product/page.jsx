"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Check, ExternalLink, Package, Pencil, Plus, RefreshCw, Trash2, X } from "lucide-react";
import { useToast } from "@/app/components/Providers";
import { Alert, Badge, EmptyState, Spinner } from "@/app/components/ui";
import { AdminHeader, FilterTabs, Pager, SearchInput, paginate } from "@/app/components/admin";
import { Switch } from "@/app/components/admin/FormParts";
import { api, cn, imgSrc, priceLabel } from "@/app/lib/format";

const PAGE_SIZE = 20;
const LOW_STOCK = 5;

const isShown = (p) => Number(p.visible) === 0;
const TAB_FILTERS = {
  all: () => true,
  shown: isShown,
  hidden: (p) => !isShown(p),
  low: (p) => Number(p.stock) <= LOW_STOCK,
  ask: (p) => Number(p.price) <= 0,
};

function Thumb({ product, className = "h-12 w-12" }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imgSrc(product.imageUrl)}
      alt=""
      loading="lazy"
      className={cn("shrink-0 rounded-xl border border-slate-100 bg-white object-contain", className)}
      onError={(e) => (e.currentTarget.src = "/placeholder.png")}
    />
  );
}

/** Stock value with inline quick edit. */
function StockCell({ product, onSave }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(String(product.stock ?? 0));
  const [saving, setSaving] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  const stock = Number(product.stock) || 0;
  const start = () => {
    setValue(String(stock));
    setEditing(true);
  };
  const cancel = () => setEditing(false);
  const valid = value !== "" && Number.isInteger(Number(value)) && Number(value) >= 0;
  const save = async () => {
    if (!valid) return;
    const n = Number(value);
    if (n === stock) return cancel();
    setSaving(true);
    const ok = await onSave(product, n);
    setSaving(false);
    if (ok) setEditing(false);
  };

  if (editing)
    return (
      <div className="flex items-center gap-1">
        <input
          ref={inputRef}
          type="number"
          inputMode="numeric"
          min="0"
          step="1"
          aria-label="จำนวนสต็อก"
          className={cn("input h-9 w-20 px-2 py-1 text-sm", !valid && "input-error")}
          value={value}
          disabled={saving}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              save();
            }
            if (e.key === "Escape") cancel();
          }}
        />
        <button className="btn btn-primary btn-icon btn-sm" onClick={save} disabled={saving || !valid} aria-label="บันทึกสต็อก">
          {saving ? <Spinner className="h-4 w-4" /> : <Check className="h-4 w-4" />}
        </button>
        <button className="btn btn-ghost btn-icon btn-sm" onClick={cancel} disabled={saving} aria-label="ยกเลิก">
          <X className="h-4 w-4" />
        </button>
      </div>
    );

  return (
    <button
      onClick={start}
      title="คลิกเพื่อแก้ไขสต็อก"
      className={cn(
        "group inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold ring-1 transition hover:ring-brand-300",
        stock <= 0
          ? "bg-red-50 text-red-700 ring-red-200"
          : stock <= LOW_STOCK
            ? "bg-amber-50 text-amber-700 ring-amber-200"
            : "bg-white text-slate-800 ring-slate-200"
      )}
    >
      {stock <= 0 ? "หมด" : stock.toLocaleString("th-TH")}
      <Pencil className="h-3 w-3 opacity-40 group-hover:opacity-100" />
    </button>
  );
}

function RowActions({ product, onDelete, deleting }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Link href={`/admin/product/edit/${product.id}`} className="btn btn-ghost btn-icon btn-sm" title="แก้ไข" aria-label="แก้ไข">
        <Pencil className="h-4 w-4" />
      </Link>
      <a
        href={`/product/${product.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-ghost btn-icon btn-sm"
        title="ดูบนหน้าร้าน"
        aria-label="ดูบนหน้าร้าน"
      >
        <ExternalLink className="h-4 w-4" />
      </a>
      <button
        className="btn btn-ghost btn-icon btn-sm text-red-600 hover:bg-red-50"
        onClick={() => onDelete(product)}
        disabled={deleting}
        title="ลบ"
        aria-label="ลบสินค้า"
      >
        {deleting ? <Spinner className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
      </button>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="card divide-y divide-slate-100">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4">
          <div className="skeleton h-12 w-12 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-1/2" />
            <div className="skeleton h-3 w-1/4" />
          </div>
          <div className="skeleton hidden h-6 w-20 sm:block" />
        </div>
      ))}
    </div>
  );
}

export default function AdminProductsPage() {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [tab, setTab] = useState("all");
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [rows, cats] = await Promise.all([api("/api/admin/product"), api("/api/admin/categories")]);
      setProducts(Array.isArray(rows) ? rows : []);
      setCategories(Array.isArray(cats) ? cats : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => setPage(1), [q, cat, tab]);

  const base = useMemo(() => {
    const term = q.trim().toLowerCase();
    return products.filter((p) => {
      if (cat && String(p.categoryId) !== cat) return false;
      if (!term) return true;
      return `${p.pro_name || ""} ${p.codename || ""}`.toLowerCase().includes(term);
    });
  }, [products, q, cat]);

  const tabs = useMemo(
    () =>
      [
        { value: "all", label: "ทั้งหมด" },
        { value: "shown", label: "แสดง" },
        { value: "hidden", label: "ซ่อน" },
        { value: "low", label: `สต็อกต่ำ (≤${LOW_STOCK})` },
        { value: "ask", label: "สอบถามราคา" },
      ].map((t) => ({ ...t, count: base.filter(TAB_FILTERS[t.value]).length })),
    [base]
  );

  const filtered = useMemo(() => base.filter(TAB_FILTERS[tab]), [base, tab]);
  const { rows, pageCount } = paginate(filtered, page, PAGE_SIZE);

  const patch = (id, data) => setProducts((list) => list.map((p) => (p.id === id ? { ...p, ...data } : p)));
  const setBusyFor = (id, v) => setBusy((b) => ({ ...b, [id]: v }));

  const toggleVisible = async (product) => {
    const prev = product.visible;
    const next = isShown(product) ? 1 : 0;
    patch(product.id, { visible: next });
    setBusyFor(product.id, "visible");
    try {
      const res = await api(`/api/admin/product/${product.id}`, { method: "PUT", body: { visible: next } });
      toast.success(res?.message || (next ? "ซ่อนสินค้าแล้ว" : "แสดงสินค้าแล้ว"));
    } catch (err) {
      patch(product.id, { visible: prev });
      toast.error(err.message);
    } finally {
      setBusyFor(product.id, null);
    }
  };

  const saveStock = async (product, stock) => {
    try {
      const res = await api(`/api/admin/product/${product.id}`, { method: "PUT", body: { stock } });
      patch(product.id, { stock });
      toast.success(res?.message || "อัปเดตสต็อกแล้ว");
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  };

  const remove = async (product) => {
    const ok = await toast.confirm({
      title: "ลบสินค้านี้?",
      message: `“${product.pro_name}” จะถูกลบออกจากระบบอย่างถาวร หากต้องการเพียงซ่อนจากหน้าร้าน ให้ปิดสวิตช์การแสดงผลแทน`,
      confirmText: "ลบสินค้า",
      tone: "danger",
    });
    if (!ok) return;
    setBusyFor(product.id, "delete");
    try {
      const res = await api(`/api/admin/product/${product.id}`, { method: "DELETE" });
      setProducts((list) => list.filter((p) => p.id !== product.id));
      toast.success(res?.message || "ลบสินค้าเรียบร้อย");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyFor(product.id, null);
    }
  };

  const hasFilter = Boolean(q || cat || tab !== "all");
  const clearFilters = () => {
    setQ("");
    setCat("");
    setTab("all");
  };

  const visibilitySwitch = (p) => (
    <Switch
      checked={isShown(p)}
      onChange={() => toggleVisible(p)}
      disabled={busy[p.id] === "visible"}
      label={`แสดง ${p.pro_name} บนหน้าร้าน`}
    />
  );

  return (
    <div>
      <AdminHeader
        title="สินค้า"
        description={
          loading ? "กำลังโหลด..." : `ทั้งหมด ${products.length} รายการ · แสดงบนหน้าร้าน ${products.filter(isShown).length} รายการ`
        }
        actions={
          <Link href="/admin/product/add" className="btn btn-primary">
            <Plus className="h-4 w-4" /> เพิ่มสินค้า
          </Link>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <SearchInput value={q} onChange={setQ} placeholder="ค้นหาชื่อสินค้า หรือรหัสสินค้า..." className="flex-1" />
        <select className="input sm:w-64" value={cat} onChange={(e) => setCat(e.target.value)} aria-label="กรองตามหมวดหมู่">
          <option value="">ทุกหมวดหมู่</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.cate_name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <FilterTabs tabs={tabs} value={tab} onChange={setTab} />
      </div>

      {loading ? (
        <ListSkeleton />
      ) : error ? (
        <Alert tone="error" title="โหลดรายการสินค้าไม่สำเร็จ">
          {error}
          <div className="mt-3">
            <button className="btn btn-secondary btn-sm" onClick={load}>
              <RefreshCw className="h-4 w-4" /> ลองอีกครั้ง
            </button>
          </div>
        </Alert>
      ) : filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={Package}
            title={hasFilter ? "ไม่พบสินค้าที่ตรงกับเงื่อนไข" : "ยังไม่มีสินค้า"}
            description={hasFilter ? "ลองเปลี่ยนคำค้นหาหรือตัวกรอง" : "เริ่มต้นเพิ่มสินค้าชิ้นแรกของร้าน"}
            action={
              hasFilter ? (
                <button className="btn btn-secondary" onClick={clearFilters}>
                  ล้างตัวกรอง
                </button>
              ) : (
                <Link href="/admin/product/add" className="btn btn-primary">
                  <Plus className="h-4 w-4" /> เพิ่มสินค้า
                </Link>
              )
            }
          />
        </div>
      ) : (
        <>
          {/* desktop table */}
          <div className="card hidden overflow-hidden md:block">
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>สินค้า</th>
                    <th>หมวดหมู่</th>
                    <th className="text-right">ราคา</th>
                    <th>สต็อก</th>
                    <th>หน้าร้าน</th>
                    <th className="text-right">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((p) => (
                    <tr key={p.id} className={cn(!isShown(p) && "bg-slate-50/70")}>
                      <td>
                        <div className="flex min-w-[16rem] items-center gap-3">
                          <Thumb product={p} />
                          <div className="min-w-0">
                            <Link
                              href={`/admin/product/edit/${p.id}`}
                              className="line-clamp-2 font-medium text-slate-900 hover:text-brand-700"
                            >
                              {p.pro_name}
                            </Link>
                            <p className="text-xs text-slate-500">{p.codename ? `รหัส ${p.codename}` : `#${p.id}`}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-sm text-slate-600">{p.cate_name || <span className="text-slate-400">ไม่มีหมวดหมู่</span>}</td>
                      <td className="text-right whitespace-nowrap">
                        {Number(p.price) > 0 ? (
                          <span className="font-semibold text-slate-900">{priceLabel(p.price)}</span>
                        ) : (
                          <Badge tone="amber">สอบถามราคา</Badge>
                        )}
                      </td>
                      <td>
                        <StockCell product={p} onSave={saveStock} />
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          {visibilitySwitch(p)}
                          <span className={cn("text-xs", isShown(p) ? "text-accent-700" : "text-slate-400")}>
                            {isShown(p) ? "แสดง" : "ซ่อน"}
                          </span>
                        </div>
                      </td>
                      <td>
                        <RowActions product={p} onDelete={remove} deleting={busy[p.id] === "delete"} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pager page={page} pageCount={pageCount} onChange={setPage} total={filtered.length} />
          </div>

          {/* mobile cards */}
          <div className="space-y-3 md:hidden">
            {rows.map((p) => (
              <div key={p.id} className="card p-4">
                <div className="flex gap-3">
                  <Thumb product={p} className="h-16 w-16" />
                  <div className="min-w-0 flex-1">
                    <Link href={`/admin/product/edit/${p.id}`} className="line-clamp-2 font-medium text-slate-900">
                      {p.pro_name}
                    </Link>
                    <p className="text-xs text-slate-500">
                      {p.codename ? `รหัส ${p.codename} · ` : ""}
                      {p.cate_name || "ไม่มีหมวดหมู่"}
                    </p>
                    <p className={cn("mt-1 text-sm font-semibold", Number(p.price) > 0 ? "text-brand-700" : "text-amber-600")}>
                      {priceLabel(p.price)}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    สต็อก <StockCell product={p} onSave={saveStock} />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    {isShown(p) ? "แสดง" : "ซ่อน"}
                    {visibilitySwitch(p)}
                  </div>
                </div>
                <div className="mt-2 border-t border-slate-100 pt-2">
                  <RowActions product={p} onDelete={remove} deleting={busy[p.id] === "delete"} />
                </div>
              </div>
            ))}
            <div className="card">
              <Pager page={page} pageCount={pageCount} onChange={setPage} total={filtered.length} />
            </div>
          </div>

          {tab === "low" && (
            <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> แสดงสินค้าที่มีสต็อกไม่เกิน {LOW_STOCK} ชิ้น (รวมสินค้าหมด)
            </p>
          )}
        </>
      )}
    </div>
  );
}
