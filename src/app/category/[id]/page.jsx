"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowRight, FolderX, LayoutGrid, PackageOpen, RotateCcw } from "lucide-react";
import ProductCard, { ProductCardSkeleton } from "@/app/components/ProductCard";
import { Alert, Breadcrumb, EmptyState, PageHeader } from "@/app/components/ui";
import { api, cn, imgSrc } from "@/app/lib/format";

const SORT_OPTIONS = [
  { value: "newest", label: "สินค้าใหม่ล่าสุด" },
  { value: "price_asc", label: "ราคา: ต่ำ → สูง" },
  { value: "price_desc", label: "ราคา: สูง → ต่ำ" },
  { value: "name", label: "ชื่อสินค้า (ก-ฮ)" },
];

const byNewest = (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0) || Number(b.id) - Number(a.id);
const SORTERS = {
  newest: byNewest,
  // "Contact for price" (0) items go last when sorting low → high.
  price_asc: (a, b) => (Number(a.price) <= 0) - (Number(b.price) <= 0) || Number(a.price) - Number(b.price),
  price_desc: (a, b) => Number(b.price) - Number(a.price),
  name: (a, b) => String(a.pro_name).localeCompare(String(b.pro_name), "th"),
};

export default function CategoryPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | notfound | error
  const [error, setError] = useState("");
  const [categories, setCategories] = useState(null);
  const [sort, setSort] = useState("newest");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setError("");
    api(`/api/categories/${encodeURIComponent(id)}`)
      .then((d) => {
        if (cancelled) return;
        setData({ category: d?.category || null, products: Array.isArray(d?.products) ? d.products : [] });
        setStatus(d?.category ? "ready" : "notfound");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
        setStatus(err.status === 404 ? "notfound" : "error");
      });
    return () => {
      cancelled = true;
    };
  }, [id, reloadKey]);

  useEffect(() => {
    api("/api/categories")
      .then((d) => setCategories(Array.isArray(d) ? d : []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (status === "ready" && data?.category) document.title = `${data.category.cate_name} | Best Medical`;
    else if (status === "notfound") document.title = "ไม่พบหมวดหมู่ | Best Medical";
  }, [status, data]);

  const sorted = useMemo(() => (data ? [...data.products].sort(SORTERS[sort] || byNewest) : []), [data, sort]);

  const otherCategories = (
    <CategoryChips categories={categories} activeId={String(id)} />
  );

  if (status === "notfound") {
    return (
      <div className="container-page py-12">
        <div className="card">
          <EmptyState
            icon={FolderX}
            title="ไม่พบหมวดหมู่สินค้านี้"
            description="หมวดหมู่นี้อาจถูกลบหรือลิงก์ไม่ถูกต้อง เลือกดูหมวดหมู่อื่นด้านล่าง หรือดูสินค้าทั้งหมด"
            action={
              <Link href="/product" className="btn btn-primary">
                ดูสินค้าทั้งหมด <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
        </div>
        <section className="mt-8">
          <h2 className="mb-3 text-sm font-semibold text-slate-700">หมวดหมู่อื่น ๆ</h2>
          {otherCategories}
        </section>
      </div>
    );
  }

  const category = data?.category;
  const loading = status === "loading";

  return (
    <div>
      {loading || !category ? (
        <section className="border-b border-slate-200 bg-gradient-to-br from-brand-50 via-white to-accent-50">
          <div className="container-page py-8 sm:py-10">
            <Breadcrumb items={[{ label: "หน้าหลัก", href: "/" }, { label: "สินค้าทั้งหมด", href: "/product" }, { label: "หมวดหมู่" }]} />
            <div className="mt-3 flex items-center gap-4">
              <div className="skeleton h-16 w-16 rounded-2xl" />
              <div className="space-y-2">
                <div className="skeleton h-7 w-56" />
                <div className="skeleton h-4 w-32" />
              </div>
            </div>
          </div>
        </section>
      ) : (
        <PageHeader
          title={
            <span className="flex items-center gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgSrc(category.cate_img)}
                  alt=""
                  onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                  className="h-full w-full object-contain p-1.5"
                />
              </span>
              <span>{category.cate_name}</span>
            </span>
          }
          subtitle={`สินค้าในหมวดหมู่นี้ ${data.products.length.toLocaleString("th-TH")} รายการ`}
          breadcrumb={[
            { label: "หน้าหลัก", href: "/" },
            { label: "สินค้าทั้งหมด", href: "/product" },
            { label: category.cate_name },
          ]}
        >
          <Link href={`/product?category=${category.id}`} className="btn btn-secondary">
            <LayoutGrid className="h-4 w-4" /> ค้นหา/กรองเพิ่มเติม
          </Link>
        </PageHeader>
      )}

      <div className="container-page py-8">
        {/* Other categories */}
        <section aria-label="หมวดหมู่อื่น ๆ">{otherCategories}</section>

        {status === "error" ? (
          <Alert tone="error" title="โหลดสินค้าไม่สำเร็จ" className="mt-6">
            {error}
            <div className="mt-3">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setReloadKey((k) => k + 1)}>
                <RotateCcw className="h-4 w-4" /> ลองอีกครั้ง
              </button>
            </div>
          </Alert>
        ) : (
          <>
            {/* Toolbar */}
            <div className="card card-body mt-6 flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-4">
              <p className="text-sm text-slate-600" aria-live="polite">
                {loading ? (
                  "กำลังโหลดสินค้า..."
                ) : (
                  <>
                    พบ <span className="font-semibold text-slate-900">{sorted.length.toLocaleString("th-TH")}</span> รายการ
                  </>
                )}
              </p>
              <div className="flex items-center gap-2">
                <label htmlFor="category-sort" className="text-sm whitespace-nowrap text-slate-600">
                  เรียงตาม
                </label>
                <select id="category-sort" className="input w-auto py-2" value={sort} onChange={(e) => setSort(e.target.value)}>
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6">
              {loading ? (
                <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              ) : sorted.length === 0 ? (
                <div className="card">
                  <EmptyState
                    icon={PackageOpen}
                    title="ยังไม่มีสินค้าในหมวดหมู่นี้"
                    description="ทางร้านกำลังเพิ่มสินค้าใหม่อย่างต่อเนื่อง หากต้องการสินค้าในหมวดนี้ สามารถติดต่อสอบถามเจ้าหน้าที่ได้"
                    action={
                      <div className="flex flex-wrap justify-center gap-2">
                        <Link href="/product" className="btn btn-primary">
                          ดูสินค้าทั้งหมด
                        </Link>
                        <Link href="/contact" className="btn btn-secondary">
                          ติดต่อสอบถาม
                        </Link>
                      </div>
                    }
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
                  {sorted.map((p) => (
                    <ProductCard key={p.id} product={{ ...p, cate_name: p.cate_name || category?.cate_name }} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CategoryChips({ categories, activeId }) {
  if (categories === null) {
    return (
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-10 w-32 shrink-0 rounded-full" />
        ))}
      </div>
    );
  }
  if (!categories.length) return null;
  return (
    <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
      <Link
        href="/product"
        className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pr-4 pl-1.5 text-sm text-slate-700 transition hover:border-brand-200 hover:text-brand-700"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-700 text-white">
          <LayoutGrid className="h-3.5 w-3.5" />
        </span>
        ทั้งหมด
      </Link>
      {categories.map((c) => {
        const active = String(c.id) === activeId;
        return (
          <Link
            key={c.id}
            href={`/category/${c.id}`}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-full border py-1.5 pr-3 pl-1.5 text-sm transition",
              active
                ? "border-brand-700 bg-brand-700 font-medium text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-brand-200 hover:text-brand-700"
            )}
          >
            <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgSrc(c.cate_img)}
                alt=""
                loading="lazy"
                onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                className="h-full w-full object-contain p-0.5"
              />
            </span>
            <span className="whitespace-nowrap">{c.cate_name}</span>
            <span className={cn("rounded-full px-1.5 text-xs", active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500")}>
              {Number(c.product_count || 0).toLocaleString("th-TH")}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
