"use client";

import Link from "next/link";
import { ChevronRight, Loader2, PackageOpen } from "lucide-react";
import { ORDER_STATUS, TONES, displayStatus, cn } from "@/app/lib/format";

export function Spinner({ className = "h-5 w-5" }) {
  return <Loader2 className={cn("animate-spin", className)} />;
}

export function PageLoader({ label = "กำลังโหลด..." }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-slate-500">
      <Spinner className="h-8 w-8 text-brand-600" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-1 text-sm text-slate-500">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-300" />}
          {it.href ? (
            <Link href={it.href} className="hover:text-brand-700">
              {it.label}
            </Link>
          ) : (
            <span className="line-clamp-1 max-w-[16rem] font-medium text-slate-700">{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

/** Coloured hero strip used at the top of storefront pages. */
export function PageHeader({ title, subtitle, breadcrumb, icon: Icon, children }) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-brand-50 via-white to-accent-50">
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-accent-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl" />
      <div className="container-page relative py-8 sm:py-10">
        {breadcrumb && <Breadcrumb items={breadcrumb} />}
        <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-4">
            {Icon && (
              <div className="hidden h-14 w-14 items-center justify-center rounded-2xl bg-brand-700 text-white shadow-lg shadow-brand-700/20 sm:flex">
                <Icon className="h-7 w-7" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
              {subtitle && <p className="mt-1 text-slate-600">{subtitle}</p>}
            </div>
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}

export function EmptyState({ icon: Icon = PackageOpen, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      {description && <p className="mt-1 max-w-md text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function Badge({ tone = "slate", children, className }) {
  return <span className={cn("badge", TONES[tone] || TONES.slate, className)}>{children}</span>;
}

/** Order status pill. Pass an order object (or { status, payment_reported }). */
export function StatusBadge({ order, status, className }) {
  const key = order ? displayStatus(order) : status;
  const meta = ORDER_STATUS[key] || { label: key, tone: "slate" };
  return (
    <Badge tone={meta.tone} className={className}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {meta.label}
    </Badge>
  );
}

export function Field({ label, required, error, help, children, className }) {
  return (
    <div className={className}>
      {label && (
        <label className="label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {children}
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : help ? <p className="help">{help}</p> : null}
    </div>
  );
}

export function Alert({ tone = "info", title, children, className }) {
  const tones = {
    info: "border-brand-200 bg-brand-50 text-brand-900",
    success: "border-emerald-200 bg-emerald-50 text-emerald-900",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
    error: "border-red-200 bg-red-50 text-red-800",
  };
  return (
    <div className={cn("rounded-xl border p-4 text-sm", tones[tone], className)}>
      {title && <p className="mb-0.5 font-semibold">{title}</p>}
      <div className="whitespace-pre-line">{children}</div>
    </div>
  );
}

export function Modal({ open, onClose, title, children, footer, size = "md" }) {
  if (!open) return null;
  const sizes = { sm: "max-w-md", md: "max-w-2xl", lg: "max-w-4xl" };
  return (
    <div className="fixed inset-0 z-[90] flex animate-fade-in items-end justify-center bg-slate-900/50 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className={cn("flex max-h-[92vh] w-full animate-slide-up flex-col rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl", sizes[size])}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button onClick={onClose} className="btn btn-ghost btn-icon -mr-2" aria-label="ปิด">
            ✕
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}

export function QuantityInput({ value, onChange, min = 1, max = 999, size = "md" }) {
  const h = size === "sm" ? "h-9" : "h-11";
  return (
    <div className={cn("inline-flex items-center overflow-hidden rounded-xl border border-slate-300 bg-white", h)}>
      <button
        type="button"
        className="h-full w-10 text-lg text-slate-600 hover:bg-slate-100 disabled:opacity-40"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="ลดจำนวน"
      >
        −
      </button>
      <input
        type="number"
        inputMode="numeric"
        className="h-full w-12 border-x border-slate-200 text-center text-sm font-medium outline-none"
        value={value}
        min={min}
        max={max}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10);
          if (!isNaN(n)) onChange(Math.max(min, Math.min(max, n)));
        }}
      />
      <button
        type="button"
        className="h-full w-10 text-lg text-slate-600 hover:bg-slate-100 disabled:opacity-40"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="เพิ่มจำนวน"
      >
        +
      </button>
    </div>
  );
}
