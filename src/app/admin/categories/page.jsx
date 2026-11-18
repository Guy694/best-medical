"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, FolderTree, Package, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useToast } from "@/app/components/Providers";
import { Alert, EmptyState, Spinner } from "@/app/components/ui";
import { AdminHeader, SearchInput } from "@/app/components/admin";
import { api, imgSrc } from "@/app/lib/format";

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="card overflow-hidden">
          <div className="skeleton aspect-[4/3] rounded-none" />
          <div className="space-y-2 p-4">
            <div className="skeleton h-4 w-2/3" />
            <div className="skeleton h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminCategoriesPage() {
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const rows = await api("/api/admin/categories");
      setCategories(Array.isArray(rows) ? rows : []);
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
    const term = q.trim().toLowerCase();
    return term ? categories.filter((c) => (c.cate_name || "").toLowerCase().includes(term)) : categories;
  }, [categories, q]);

  const totalProducts = categories.reduce((s, c) => s + Number(c.product_count || 0), 0);

  const remove = async (c) => {
    const count = Number(c.product_count || 0);
    const ok = await toast.confirm({
      title: "ลบหมวดหมู่นี้?",
      message:
        count > 0
          ? `“${c.cate_name}” มีสินค้า ${count} รายการ ต้องย้ายสินค้าไปหมวดหมู่อื่นก่อนจึงจะลบได้`
          : `“${c.cate_name}” จะถูกลบออกจากระบบอย่างถาวร`,
      confirmText: "ลบหมวดหมู่",
      tone: "danger",
    });
    if (!ok) return;
    setDeleting(c.id);
    try {
      const res = await api(`/api/admin/categories/${c.id}`, { method: "DELETE" });
      setCategories((list) => list.filter((x) => x.id !== c.id));
      toast.success(res?.message || "ลบหมวดหมู่เรียบร้อย");
    } catch (err) {
      toast.error(err.message, { title: "ลบไม่สำเร็จ" });
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <AdminHeader
        title="หมวดหมู่สินค้า"
        description={loading ? "กำลังโหลด..." : `ทั้งหมด ${categories.length} หมวดหมู่ · สินค้ารวม ${totalProducts} รายการ`}
        actions={
          <Link href="/admin/categories/add" className="btn btn-primary">
            <Plus className="h-4 w-4" /> เพิ่มหมวดหมู่
          </Link>
        }
      />

      <SearchInput value={q} onChange={setQ} placeholder="ค้นหาชื่อหมวดหมู่..." className="mb-5 max-w-md" />

      {loading ? (
        <GridSkeleton />
      ) : error ? (
        <Alert tone="error" title="โหลดหมวดหมู่ไม่สำเร็จ">
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
            icon={FolderTree}
            title={q ? "ไม่พบหมวดหมู่ที่ค้นหา" : "ยังไม่มีหมวดหมู่"}
            description={q ? "ลองใช้คำค้นหาอื่น" : "สร้างหมวดหมู่เพื่อจัดกลุ่มสินค้าให้ลูกค้าค้นหาได้ง่ายขึ้น"}
            action={
              q ? (
                <button className="btn btn-secondary" onClick={() => setQ("")}>
                  ล้างคำค้นหา
                </button>
              ) : (
                <Link href="/admin/categories/add" className="btn btn-primary">
                  <Plus className="h-4 w-4" /> เพิ่มหมวดหมู่
                </Link>
              )
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((c) => {
            const count = Number(c.product_count || 0);
            return (
              <div key={c.id} className="card group flex flex-col overflow-hidden transition hover:shadow-[var(--shadow-lift)]">
                <Link href={`/admin/categories/edit/${c.id}`} className="block aspect-[4/3] overflow-hidden bg-slate-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgSrc(c.cate_img)}
                    alt={c.cate_name}
                    loading="lazy"
                    className="h-full w-full object-contain p-4 transition duration-300 group-hover:scale-105"
                    onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                  />
                </Link>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="line-clamp-2 font-semibold text-slate-900">{c.cate_name}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                    <Package className="h-4 w-4" />
                    {count > 0 ? `${count} สินค้า` : "ยังไม่มีสินค้า"}
                  </p>
                  <div className="mt-4 flex items-center gap-1 border-t border-slate-100 pt-3">
                    <Link href={`/admin/categories/edit/${c.id}`} className="btn btn-secondary btn-sm flex-1">
                      <Pencil className="h-4 w-4" /> แก้ไข
                    </Link>
                    <a
                      href={`/category/${c.id}`}
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
                      onClick={() => remove(c)}
                      disabled={deleting === c.id}
                      title="ลบ"
                      aria-label={`ลบหมวดหมู่ ${c.cate_name}`}
                    >
                      {deleting === c.id ? <Spinner className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
