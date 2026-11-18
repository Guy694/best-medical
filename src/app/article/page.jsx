"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, BookOpen, CalendarDays, ChevronLeft, ChevronRight, Eye, Newspaper, Search, X } from "lucide-react";
import { Alert, EmptyState, PageHeader, PageLoader } from "@/app/components/ui";
import { api, cn, formatDate, imgSrc } from "@/app/lib/format";

const LIMIT = 9;

function ArticleCard({ a, featured = false }) {
  return (
    <Link
      href={`/article/${a.id}`}
      className={cn(
        "group card flex overflow-hidden transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]",
        featured ? "flex-col sm:col-span-full md:flex-row" : "flex-col"
      )}
    >
      <div className={cn("relative overflow-hidden bg-slate-100", featured ? "aspect-[16/9] md:aspect-auto md:w-3/5" : "aspect-[16/9]")}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc(a.banner)}
          alt={a.title}
          loading={featured ? "eager" : "lazy"}
          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
          onError={(e) => (e.currentTarget.src = "/placeholder.png")}
        />
        {a.category && (
          <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-brand-700 shadow-sm backdrop-blur">
            {a.category}
          </span>
        )}
        {featured && (
          <span className="absolute top-3 right-3 rounded-full bg-brand-700 px-3 py-1 text-xs font-medium text-white shadow-sm">ล่าสุด</span>
        )}
      </div>
      <div className={cn("flex flex-1 flex-col p-5", featured && "md:justify-center md:p-8")}>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(a.published_at || a.created_at, featured ? { month: "long" } : {})}
          </span>
          <span className="inline-flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {Number(a.views || 0).toLocaleString("th-TH")} ครั้ง
          </span>
        </div>
        <h2
          className={cn(
            "mt-2 font-semibold text-slate-900 transition group-hover:text-brand-700",
            featured ? "line-clamp-3 text-xl sm:text-2xl" : "line-clamp-2 text-lg"
          )}
        >
          {a.title}
        </h2>
        {a.excerpt && (
          <p className={cn("mt-2 text-sm leading-relaxed text-slate-600", featured ? "line-clamp-4" : "line-clamp-3")}>{a.excerpt}</p>
        )}
        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-brand-700">
          อ่านต่อ <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

function CardSkeleton({ featured }) {
  return (
    <div className={cn("card overflow-hidden", featured && "sm:col-span-full md:flex")}>
      <div className={cn("skeleton aspect-[16/9] rounded-none", featured && "md:aspect-auto md:h-72 md:w-3/5")} />
      <div className="flex-1 space-y-3 p-5">
        <div className="skeleton h-3 w-1/3" />
        <div className="skeleton h-5 w-4/5" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-2/3" />
      </div>
    </div>
  );
}

function Pagination({ pagination, onChange }) {
  const { page, totalPages } = pagination;
  if (!totalPages || totalPages <= 1) return null;
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) pages.push(i);
    else if (pages[pages.length - 1] !== "…") pages.push("…");
  }
  return (
    <nav className="mt-10 flex items-center justify-center gap-1" aria-label="เปลี่ยนหน้า">
      <button type="button" className="btn btn-secondary btn-icon" disabled={!pagination.hasPrev} onClick={() => onChange(page - 1)} aria-label="หน้าก่อนหน้า">
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="px-2 text-slate-400">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn("btn btn-icon", p === page ? "btn-primary" : "btn-ghost")}
          >
            {p}
          </button>
        )
      )}
      <button type="button" className="btn btn-secondary btn-icon" disabled={!pagination.hasNext} onClick={() => onChange(page + 1)} aria-label="หน้าถัดไป">
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}

function ArticlesContent() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const q = params.get("q") || "";
  const category = params.get("category") || "";
  const page = Math.max(parseInt(params.get("page"), 10) || 1, 1);

  const [search, setSearch] = useState(q);
  const [data, setData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  // keep the search box in sync with back/forward navigation
  const [lastQ, setLastQ] = useState(q);
  if (q !== lastQ) {
    setLastQ(q);
    setSearch(q);
  }

  useEffect(() => {
    let alive = true;
    const sp = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
    if (q) sp.set("q", q);
    if (category) sp.set("category", category);
    api(`/api/articles?${sp}`)
      .then((d) => {
        if (!alive) return;
        setData(d);
        setError("");
        if (d?.categories?.length) setCategories(d.categories);
      })
      .catch((err) => alive && setError(err.message));
    return () => {
      alive = false;
    };
  }, [q, category, page, reload]);

  const setParams = (patch) => {
    const sp = new URLSearchParams(params.toString());
    Object.entries(patch).forEach(([k, v]) => (v ? sp.set(k, String(v)) : sp.delete(k)));
    if (!("page" in patch)) sp.delete("page");
    setData(null);
    const qs = sp.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const onSearch = (e) => {
    e.preventDefault();
    const v = search.trim();
    if (v !== q) setParams({ q: v });
  };

  const goPage = (p) => {
    setParams({ page: p > 1 ? p : "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const loading = !data && !error;
  const articles = data?.articles || [];
  const showFeatured = page === 1 && !q && !category && articles.length > 0;
  const filtered = !!(q || category);

  return (
    <div>
      <PageHeader
        title="บทความและข่าวสาร"
        subtitle="ติดตามข่าวสารและความรู้เกี่ยวกับสุขภาพ อุปกรณ์การแพทย์ และเวชภัณฑ์"
        icon={Newspaper}
        breadcrumb={[{ label: "หน้าแรก", href: "/" }, { label: "บทความ" }]}
      >
        <form onSubmit={onSearch} className="relative w-full sm:w-80" role="search">
          <label htmlFor="article-search" className="sr-only">
            ค้นหาบทความ
          </label>
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="article-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาบทความ..."
            maxLength={100}
            className="input bg-white pr-20 pl-9"
          />
          <button type="submit" className="btn btn-primary btn-sm absolute top-1/2 right-1.5 -translate-y-1/2">
            ค้นหา
          </button>
        </form>
      </PageHeader>

      <div className="container-page py-8">
        {categories.length > 0 && (
          <div className="scrollbar-none -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            {["", ...categories].map((c) => (
              <button
                key={c || "all"}
                type="button"
                onClick={() => c !== category && setParams({ category: c })}
                aria-pressed={c === category}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition",
                  c === category
                    ? "border-brand-700 bg-brand-700 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700"
                )}
              >
                {c || "ทั้งหมด"}
              </button>
            ))}
          </div>
        )}

        {filtered && data && (
          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <span>
              พบ <strong className="text-slate-900">{Number(data.pagination?.total || 0).toLocaleString("th-TH")}</strong> บทความ
              {q && (
                <>
                  {" "}
                  สำหรับ “<span className="font-medium text-slate-900">{q}</span>”
                </>
              )}
              {category && (
                <>
                  {" "}
                  ในหมวด <span className="font-medium text-slate-900">{category}</span>
                </>
              )}
            </span>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setParams({ q: "", category: "" })}>
              <X className="h-4 w-4" /> ล้างตัวกรอง
            </button>
          </div>
        )}

        {error ? (
          <Alert tone="error" title="โหลดบทความไม่สำเร็จ">
            {error}
            {"\n"}
            <button type="button" className="mt-2 font-medium underline" onClick={() => {
                setError("");
                setReload((r) => r + 1);
              }}>
              ลองใหม่อีกครั้ง
            </button>
          </Alert>
        ) : loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <CardSkeleton featured={page === 1 && !filtered} />
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="card">
            <EmptyState
              icon={BookOpen}
              title={filtered ? "ไม่พบบทความที่ค้นหา" : "ยังไม่มีบทความ"}
              description={filtered ? "ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่น" : "โปรดติดตามบทความและข่าวสารจากเราเร็ว ๆ นี้"}
              action={
                filtered && (
                  <button type="button" className="btn btn-secondary" onClick={() => setParams({ q: "", category: "" })}>
                    ดูบทความทั้งหมด
                  </button>
                )
              }
            />
          </div>
        ) : (
          <>
            <div className="grid animate-fade-in gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((a, i) => (
                <ArticleCard key={a.id} a={a} featured={showFeatured && i === 0} />
              ))}
            </div>
            <Pagination pagination={data.pagination || {}} onChange={goPage} />
          </>
        )}
      </div>
    </div>
  );
}

export default function ArticlesPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ArticlesContent />
    </Suspense>
  );
}
