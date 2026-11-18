"use client";

import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { cn } from "@/app/lib/format";

/** Page title row for admin screens. */
export function AdminHeader({ title, description, back, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {back && (
          <Link href={back} className="mb-2 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-brand-700">
            <ArrowLeft className="h-4 w-4" /> ย้อนกลับ
          </Link>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({ icon: Icon, label, value, hint, tone = "brand", href }) {
  const tones = {
    brand: "bg-brand-50 text-brand-700",
    accent: "bg-accent-50 text-accent-700",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
    red: "bg-red-50 text-red-600",
    sky: "bg-sky-50 text-sky-600",
  };
  const body = (
    <div className={cn("card card-body flex items-start gap-4", href && "transition hover:-translate-y-0.5 hover:shadow-md")}>
      <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", tones[tone])}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="mt-0.5 truncate text-2xl font-bold text-slate-900">{value}</p>
        {hint && <p className="mt-0.5 text-xs text-slate-500">{hint}</p>}
      </div>
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

export function SearchInput({ value, onChange, placeholder = "ค้นหา...", className }) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input className="input pl-9" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

/** Pill tabs used for status filters. */
export function FilterTabs({ tabs, value, onChange }) {
  return (
    <div className="scrollbar-none -mx-1 flex gap-1 overflow-x-auto px-1">
      {tabs.map((t) => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={cn(
            "flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-colors",
            value === t.value ? "bg-brand-700 text-white shadow-sm" : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
          )}
        >
          {t.label}
          {t.count != null && (
            <span className={cn("rounded-full px-1.5 text-xs", value === t.value ? "bg-white/20" : "bg-slate-100 text-slate-500")}>{t.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}

/** Simple client-side pagination footer. */
export function Pager({ page, pageCount, onChange, total }) {
  if (pageCount <= 1) return total != null ? <p className="px-4 py-3 text-sm text-slate-500">ทั้งหมด {total} รายการ</p> : null;
  return (
    <div className="flex items-center justify-between gap-4 border-t border-slate-100 px-4 py-3 text-sm">
      <p className="text-slate-500">
        หน้า {page} / {pageCount} {total != null && `· ทั้งหมด ${total} รายการ`}
      </p>
      <div className="flex gap-2">
        <button className="btn btn-secondary btn-sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          ก่อนหน้า
        </button>
        <button className="btn btn-secondary btn-sm" disabled={page >= pageCount} onClick={() => onChange(page + 1)}>
          ถัดไป
        </button>
      </div>
    </div>
  );
}

export const paginate = (rows, page, size = 20) => ({
  rows: rows.slice((page - 1) * size, page * size),
  pageCount: Math.max(1, Math.ceil(rows.length / size)),
});
