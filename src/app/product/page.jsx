"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Boxes, LayoutGrid, PackageSearch, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import ProductCard, { ProductCardSkeleton } from "@/app/components/ProductCard";
import { Alert, EmptyState, PageHeader, PageLoader } from "@/app/components/ui";
import { api, cn, imgSrc, isPurchasable } from "@/app/lib/format";

const PAGE_SIZE = 24;

const SORT_OPTIONS = [
  { value: "newest", label: "สินค้าใหม่ล่าสุด" },
  { value: "price_asc", label: "ราคา: ต่ำ → สูง" },
  { value: "price_desc", label: "ราคา: สูง → ต่ำ" },
  { value: "name", label: "ชื่อสินค้า (ก-ฮ)" },
];
const SORT_VALUES = SORT_OPTIONS.map((o) => o.value);

export default function ProductsPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const q = (searchParams.get("q") || "").trim();
  const category = searchParams.get("category") || "";
  const sortParam = searchParams.get("sort") || "newest";
  const sort = SORT_VALUES.includes(sortParam) ? sortParam : "newest";
  const inStock = searchParams.get("instock") === "1";

  const [search, setSearch] = useState(q);
  const pushedQ = useRef(q);
  const [categories, setCategories] = useState(null);
  const [products, setProducts] = useState(null);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const updateParams = useCallback(
    (changes) => {
      const sp = new URLSearchParams(searchParams.toString());
      Object.entries(changes).forEach(([k, v]) => {
        if (v === "" || v === null || v === undefined) sp.delete(k);
        else sp.set(k, String(v));
      });
      if (sp.get("sort") === "newest") sp.delete("sort");
      const qs = sp.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  // URL changed from outside (e.g. Navbar search) → sync the input.
  useEffect(() => {
    if (q !== pushedQ.current) {
      pushedQ.current = q;
      setSearch(q);
    }
  }, [q]);

  // Debounce typing → URL (the URL is the single source of truth for fetching).
  useEffect(() => {
    const next = search.trim();
    if (next === pushedQ.current) return;
    const t = setTimeout(() => {
      pushedQ.current = next;
      updateParams({ q: next });
    }, 300);
    return () => clearTimeout(t);
  }, [search, updateParams]);

  useEffect(() => {
    api("/api/categories")
      .then((d) => setCategories(Array.isArray(d) ? d : []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    const sp = new URLSearchParams();
    if (category) sp.set("category", category);
    if (q) sp.set("q", q);
    sp.set("sort", sort);
    setProducts(null);
    setError("");
    api(`/api/product?${sp.toString()}`)
      .then((d) => {
        if (cancelled) return;
        setProducts(Array.isArray(d) ? d : []);
        setVisible(PAGE_SIZE);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
        setProducts([]);
      });
    return () => {
      cancelled = true;
    };
  }, [category, q, sort, reloadKey]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const filtered = useMemo(() => (products ? (inStock ? products.filter(isPurchasable) : products) : null), [products, inStock]);
  const shown = filtered ? filtered.slice(0, visible) : [];
  const activeCategory = categories?.find((c) => String(c.id) === category);
  const totalCount = categories?.reduce((s, c) => s + Number(c.product_count || 0), 0) ?? 0;
  const hasFilters = Boolean(category || q || inStock || sort !== "newest");

  const clearSearch = () => {
    setSearch("");
    pushedQ.current = "";
    updateParams({ q: "" });
  };

  const resetAll = () => {
    setSearch("");
    pushedQ.current = "";
    router.replace(pathname, { scroll: false });
  };

  const selectCategory = (id) => {
    updateParams({ category: id });
    setDrawerOpen(false);
  };

  const categoryList = <CategoryList categories={categories} active={category} total={totalCount} onSelect={selectCategory} />;

  return (
    <div>
      <PageHeader
        title="สินค้าทั้งหมด"
        subtitle="อุปกรณ์การแพทย์ เครื่องมือตรวจรักษา และผลิตภัณฑ์ดูแลสุขภาพคุณภาพสูง"
        icon={LayoutGrid}
        breadcrumb={[{ label: "หน้าหลัก", href: "/" }, { label: "สินค้าทั้งหมด" }]}
      >
        <form role="search" className="relative w-full sm:w-80" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="product-search" className="sr-only">
            ค้นหาสินค้า
          </label>
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="product-search"
            type="search"
            className="input pr-10 pl-10"
            placeholder="ค้นหาชื่อสินค้า รหัสสินค้า..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
            maxLength={100}
          />
          {search && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute top-1/2 right-2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="ล้างคำค้นหา"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>
      </PageHeader>

      <div className="container-page py-8">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Sidebar (desktop) */}
          <aside className="hidden lg:block">
            <div className="card sticky top-24 overflow-hidden">
              <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
                <Boxes className="h-4 w-4 text-brand-700" />
                <h2 className="font-semibold text-slate-900">หมวดหมู่สินค้า</h2>
              </div>
              <div className="max-h-[calc(100vh-12rem)] overflow-y-auto p-2">{categoryList}</div>
            </div>
          </aside>

          <div className="min-w-0">
            {/* Toolbar */}
            <div className="card card-body flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-4">
              <div className="flex items-center gap-3">
                <button type="button" className="btn btn-secondary btn-sm lg:hidden" onClick={() => setDrawerOpen(true)}>
                  <SlidersHorizontal className="h-4 w-4" /> หมวดหมู่
                </button>
                <p className="text-sm text-slate-600" aria-live="polite">
                  {filtered === null ? (
                    "กำลังค้นหา..."
                  ) : (
                    <>
                      พบ <span className="font-semibold text-slate-900">{filtered.length.toLocaleString("th-TH")}</span> รายการ
                    </>
                  )}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-700 select-none">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 accent-brand-700"
                    checked={inStock}
                    onChange={(e) => updateParams({ instock: e.target.checked ? "1" : "" })}
                  />
                  เฉพาะสินค้าพร้อมขาย
                </label>
                <label htmlFor="product-sort" className="sr-only">
                  เรียงลำดับ
                </label>
                <select
                  id="product-sort"
                  className="input w-auto py-2"
                  value={sort}
                  onChange={(e) => updateParams({ sort: e.target.value })}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active filters */}
            {hasFilters && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {category && (
                  <FilterChip
                    label={`หมวดหมู่: ${activeCategory?.cate_name || "ที่เลือก"}`}
                    onClear={() => updateParams({ category: "" })}
                  />
                )}
                {q && <FilterChip label={`ค้นหา: "${q}"`} onClear={clearSearch} />}
                {inStock && <FilterChip label="เฉพาะสินค้าพร้อมขาย" onClear={() => updateParams({ instock: "" })} />}
                {sort !== "newest" && (
                  <FilterChip
                    label={`เรียง: ${SORT_OPTIONS.find((o) => o.value === sort)?.label}`}
                    onClear={() => updateParams({ sort: "" })}
                  />
                )}
                <button type="button" onClick={resetAll} className="link inline-flex items-center gap-1 px-1 text-sm">
                  <RotateCcw className="h-3.5 w-3.5" /> ล้างทั้งหมด
                </button>
              </div>
            )}

            {error && (
              <Alert tone="error" title="โหลดสินค้าไม่สำเร็จ" className="mt-6">
                {error}
                <div className="mt-3">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setReloadKey((k) => k + 1)}>
                    <RotateCcw className="h-4 w-4" /> ลองอีกครั้ง
                  </button>
                </div>
              </Alert>
            )}

            {/* Grid */}
            <div className="mt-6">
              {filtered === null ? (
                <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                !error && (
                  <div className="card">
                    <EmptyState
                      icon={PackageSearch}
                      title="ไม่พบสินค้าที่ค้นหา"
                      description="ลองเปลี่ยนคำค้นหา เลือกหมวดหมู่อื่น หรือล้างตัวกรองทั้งหมด หากไม่พบสินค้าที่ต้องการ สามารถติดต่อสอบถามทางร้านได้"
                      action={
                        <div className="flex flex-wrap justify-center gap-2">
                          {hasFilters && (
                            <button type="button" className="btn btn-primary" onClick={resetAll}>
                              <RotateCcw className="h-4 w-4" /> ล้างตัวกรอง
                            </button>
                          )}
                          <Link href="/contact" className="btn btn-secondary">
                            ติดต่อสอบถาม
                          </Link>
                        </div>
                      }
                    />
                  </div>
                )
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
                    {shown.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                  <div className="mt-8 flex flex-col items-center gap-3">
                    <p className="text-sm text-slate-500">
                      แสดง {shown.length.toLocaleString("th-TH")} จาก {filtered.length.toLocaleString("th-TH")} รายการ
                    </p>
                    {shown.length < filtered.length && (
                      <button type="button" className="btn btn-secondary" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                        ดูสินค้าเพิ่มเติม
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile category drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[80] animate-fade-in bg-slate-900/50 backdrop-blur-sm lg:hidden" onClick={() => setDrawerOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="เลือกหมวดหมู่สินค้า"
            className="absolute inset-x-0 bottom-0 flex max-h-[80vh] animate-slide-up flex-col rounded-t-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="font-semibold text-slate-900">หมวดหมู่สินค้า</h2>
              <button type="button" className="btn btn-ghost btn-icon -mr-2" onClick={() => setDrawerOpen(false)} aria-label="ปิด">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-2 pb-6">{categoryList}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryList({ categories, active, total, onSelect }) {
  if (categories === null) {
    return (
      <div className="space-y-2 p-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton h-9 w-full" />
        ))}
      </div>
    );
  }
  const rows = [{ id: "", cate_name: "สินค้าทั้งหมด", product_count: total, all: true }, ...categories];
  return (
    <ul className="space-y-0.5">
      {rows.map((c) => {
        const selected = String(c.id) === active;
        return (
          <li key={c.id || "all"}>
            <button
              type="button"
              onClick={() => onSelect(String(c.id))}
              aria-current={selected ? "true" : undefined}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors",
                selected ? "bg-brand-50 font-semibold text-brand-800" : "text-slate-700 hover:bg-slate-50 hover:text-brand-700"
              )}
            >
              {c.all ? (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-700 text-white">
                  <LayoutGrid className="h-4 w-4" />
                </span>
              ) : (
                <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-50 ring-1 ring-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgSrc(c.cate_img)}
                    alt=""
                    loading="lazy"
                    onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                    className="h-full w-full object-contain p-0.5"
                  />
                </span>
              )}
              <span className="line-clamp-2 flex-1">{c.cate_name}</span>
              <span
                className={cn("shrink-0 rounded-full px-2 py-0.5 text-xs", selected ? "bg-brand-700 text-white" : "bg-slate-100 text-slate-500")}
              >
                {Number(c.product_count || 0).toLocaleString("th-TH")}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function FilterChip({ label, onClear }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 py-1 pr-1 pl-3 text-sm text-brand-800 ring-1 ring-brand-100">
      <span className="line-clamp-1 max-w-[14rem]">{label}</span>
      <button
        type="button"
        onClick={onClear}
        className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-brand-100"
        aria-label={`ลบตัวกรอง ${label}`}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </span>
  );
}
