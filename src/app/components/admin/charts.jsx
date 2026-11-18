"use client";

import { useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Download, Minus } from "lucide-react";
import { cn } from "@/app/lib/format";

/* ---------------- helpers ---------------- */
export const num = (v, d = 0) => Number(v || 0).toLocaleString("th-TH", { minimumFractionDigits: d, maximumFractionDigits: d });
export const baht = (v) => `฿${num(v, 0)}`;
export const pct = (v, d = 1) => `${num(v, d)}%`;
export const duration = (sec) => {
  const s = Math.round(Number(sec) || 0);
  if (s < 60) return `${s} วินาที`;
  return `${Math.floor(s / 60)} นาที ${s % 60} วินาที`;
};
const TH_MONTHS = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
export const shortDate = (iso) => {
  const [, m, d] = String(iso).split("-").map(Number);
  return `${d} ${TH_MONTHS[m - 1]}`;
};
const todayTH = () => new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);
const addDays = (iso, n) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

/* ---------------- date range ---------------- */
const PRESETS = [
  { key: "7", label: "7 วัน", days: 7 },
  { key: "30", label: "30 วัน", days: 30 },
  { key: "90", label: "90 วัน", days: 90 },
  { key: "365", label: "1 ปี", days: 365 },
];

export function useDateRange(defaultDays = 30) {
  const [range, setRange] = useState(() => {
    const to = todayTH();
    return { preset: String(defaultDays), from: addDays(to, -(defaultDays - 1)), to };
  });
  const query = `from=${range.from}&to=${range.to}`;
  return { range, setRange, query };
}

export function RangePicker({ range, setRange }) {
  const pick = (p) => {
    const to = todayTH();
    setRange({ preset: p.key, from: addDays(to, -(p.days - 1)), to });
  };
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex rounded-xl bg-white p-1 ring-1 ring-slate-200">
        {PRESETS.map((p) => (
          <button
            key={p.key}
            onClick={() => pick(p)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              range.preset === p.key ? "bg-brand-700 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1.5 text-sm">
        <input
          type="date"
          className="input h-9 w-auto py-1"
          value={range.from}
          max={range.to}
          onChange={(e) => e.target.value && setRange((r) => ({ ...r, preset: "custom", from: e.target.value }))}
          aria-label="ตั้งแต่วันที่"
        />
        <span className="text-slate-400">–</span>
        <input
          type="date"
          className="input h-9 w-auto py-1"
          value={range.to}
          min={range.from}
          max={todayTH()}
          onChange={(e) => e.target.value && setRange((r) => ({ ...r, preset: "custom", to: e.target.value }))}
          aria-label="ถึงวันที่"
        />
      </div>
    </div>
  );
}

/* ---------------- KPI ---------------- */
export function Change({ current, previous, invert = false }) {
  const c = Number(current) || 0;
  const p = Number(previous) || 0;
  if (!p && !c) return <span className="text-xs text-slate-400">—</span>;
  if (!p) return <span className="text-xs font-medium text-emerald-600">ใหม่</span>;
  const diff = ((c - p) / p) * 100;
  const flat = Math.abs(diff) < 0.5;
  const good = invert ? diff < 0 : diff > 0;
  const Icon = flat ? Minus : diff > 0 ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-xs font-medium", flat ? "text-slate-500" : good ? "text-emerald-600" : "text-red-600")}>
      <Icon className="h-3.5 w-3.5" />
      {num(Math.abs(diff), 1)}%
    </span>
  );
}

export function Kpi({ icon: Icon, label, value, current, previous, invert, hint, tone = "brand" }) {
  const tones = {
    brand: "bg-brand-50 text-brand-700",
    accent: "bg-accent-50 text-accent-700",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
    sky: "bg-sky-50 text-sky-600",
    red: "bg-red-50 text-red-600",
  };
  return (
    <div className="card card-body">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        {Icon && (
          <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl", tones[tone])}>
            <Icon className="h-[18px] w-[18px]" />
          </span>
        )}
      </div>
      <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
      <div className="mt-1 flex items-center gap-2">
        {previous !== undefined && <Change current={current} previous={previous} invert={invert} />}
        <span className="text-xs text-slate-400">{hint ?? (previous !== undefined ? "เทียบช่วงก่อนหน้า" : "")}</span>
      </div>
    </div>
  );
}

export function Panel({ title, description, action, children, className }) {
  return (
    <section className={cn("card", className)}>
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="font-semibold text-slate-900">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

/* ---------------- Area / line chart (SVG) ---------------- */
const SERIES_COLORS = ["#1c30bd", "#029e8e", "#f59e0b", "#ef3b3b"];

export function AreaChart({ data, series, height = 240, format = num }) {
  const ref = useRef(null);
  const [hover, setHover] = useState(null);
  const W = 800;
  const H = height;
  const pad = { l: 44, r: 12, t: 12, b: 26 };
  const max = Math.max(1, ...data.flatMap((d) => series.map((s) => Number(d[s.key]) || 0)));
  const niceMax = (() => {
    const p = Math.pow(10, Math.floor(Math.log10(max)));
    return Math.ceil(max / p) * p;
  })();
  const x = (i) => pad.l + (data.length <= 1 ? 0 : (i / (data.length - 1)) * (W - pad.l - pad.r));
  const y = (v) => pad.t + (1 - v / niceMax) * (H - pad.t - pad.b);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => niceMax * t);
  const labelEvery = Math.max(1, Math.ceil(data.length / 8));

  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(((px - pad.l) / (W - pad.l - pad.r)) * (data.length - 1));
    setHover(Math.max(0, Math.min(data.length - 1, i)));
  };

  return (
    <div className="relative">
      <div className="mb-3 flex flex-wrap gap-4">
        {series.map((s, i) => (
          <span key={s.key} className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color || SERIES_COLORS[i] }} />
            {s.label}
          </span>
        ))}
      </div>
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="h-auto w-full touch-none" onMouseMove={onMove} onMouseLeave={() => setHover(null)} role="img">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke="#e2e8f0" strokeDasharray={t ? "4 4" : ""} />
            <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" className="fill-slate-400 text-[11px]">
              {t >= 1000 ? `${num(t / 1000, t % 1000 ? 1 : 0)}k` : num(t)}
            </text>
          </g>
        ))}
        {data.map((d, i) =>
          (i % labelEvery === 0 && data.length - 1 - i >= labelEvery / 2) || i === data.length - 1 ? (
            <text key={d.date} x={x(i)} y={H - 6} textAnchor="middle" className="fill-slate-400 text-[11px]">
              {shortDate(d.date)}
            </text>
          ) : null
        )}
        {series.map((s, si) => {
          const color = s.color || SERIES_COLORS[si];
          const pts = data.map((d, i) => `${x(i)},${y(Number(d[s.key]) || 0)}`);
          return (
            <g key={s.key}>
              {si === 0 && (
                <>
                  <defs>
                    <linearGradient id={`g-${s.key}`} x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity="0.22" />
                      <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <polygon points={`${x(0)},${y(0)} ${pts.join(" ")} ${x(data.length - 1)},${y(0)}`} fill={`url(#g-${s.key})`} />
                </>
              )}
              <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            </g>
          );
        })}
        {hover != null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={H - pad.b} stroke="#94a3b8" strokeDasharray="3 3" />
            {series.map((s, si) => (
              <circle key={s.key} cx={x(hover)} cy={y(Number(data[hover][s.key]) || 0)} r="4.5" fill="#fff" stroke={s.color || SERIES_COLORS[si]} strokeWidth="2.5" />
            ))}
          </g>
        )}
      </svg>
      {hover != null && (
        <div
          className="pointer-events-none absolute top-8 z-10 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg"
          style={{ left: `${Math.min(80, Math.max(2, (x(hover) / W) * 100 - 8))}%` }}
        >
          <p className="mb-1 font-semibold text-slate-800">{shortDate(data[hover].date)}</p>
          {series.map((s, si) => (
            <p key={s.key} className="flex items-center gap-1.5 text-slate-600">
              <span className="h-2 w-2 rounded-full" style={{ background: s.color || SERIES_COLORS[si] }} />
              {s.label}: <span className="font-medium text-slate-900">{(s.format || format)(data[hover][s.key])}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Horizontal bar list ---------------- */
export function BarList({ items, format = num, color = "bg-brand-500/15", empty = "ยังไม่มีข้อมูล", labelKey = "name", valueKey = "value", renderLabel }) {
  const max = Math.max(1, ...items.map((i) => Number(i[valueKey]) || 0));
  const total = items.reduce((s, i) => s + (Number(i[valueKey]) || 0), 0);
  if (!items.length) return <p className="py-6 text-center text-sm text-slate-400">{empty}</p>;
  return (
    <ul className="space-y-1.5">
      {items.map((it, idx) => {
        const v = Number(it[valueKey]) || 0;
        return (
          <li key={idx} className="relative flex items-center justify-between gap-3 overflow-hidden rounded-lg px-3 py-2 text-sm">
            <span className={cn("absolute inset-y-0 left-0 rounded-lg", color)} style={{ width: `${(v / max) * 100}%` }} />
            <span className="relative min-w-0 truncate text-slate-700">{renderLabel ? renderLabel(it) : it[labelKey]}</span>
            <span className="relative shrink-0 font-medium text-slate-900">
              {format(v)} <span className="ml-1 text-xs font-normal text-slate-400">{total ? pct((v / total) * 100, 0) : ""}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------------- Donut ---------------- */
const DONUT = ["#1c30bd", "#029e8e", "#f59e0b", "#8b5cf6", "#ef3b3b", "#0ea5e9", "#64748b", "#ec4899"];
export function Donut({ items, label = "ทั้งหมด", format = num }) {
  const total = items.reduce((s, i) => s + i.value, 0);
  let acc = 0;
  const stops = items.map((it, i) => {
    const a = (acc / Math.max(total, 1)) * 360;
    acc += it.value;
    const b = (acc / Math.max(total, 1)) * 360;
    return `${DONUT[i % DONUT.length]} ${a}deg ${b}deg`;
  });
  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row lg:flex-col 2xl:flex-row">
      <div className="relative h-36 w-36 shrink-0 rounded-full" style={{ background: total ? `conic-gradient(${stops.join(",")})` : "#e2e8f0" }}>
        <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-white">
          <span className="text-xl font-bold text-slate-900">{format(total)}</span>
          <span className="text-[11px] text-slate-500">{label}</span>
        </div>
      </div>
      <ul className="w-full space-y-1.5 text-sm">
        {items.map((it, i) => (
          <li key={it.name} className="flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-2 text-slate-600">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: DONUT[i % DONUT.length] }} />
              <span className="truncate">{it.name}</span>
            </span>
            <span className="shrink-0 font-medium text-slate-900">
              {format(it.value)} <span className="text-xs font-normal text-slate-400">{total ? pct((it.value / total) * 100, 0) : ""}</span>
            </span>
          </li>
        ))}
        {!items.length && <li className="text-slate-400">ยังไม่มีข้อมูล</li>}
      </ul>
    </div>
  );
}

/* ---------------- Heatmap (weekday × hour) ---------------- */
const DAYS = ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."];
export function Heatmap({ grid, unit = "ครั้ง" }) {
  const max = Math.max(1, ...grid.flat());
  return (
    <div className="overflow-x-auto">
      <div className="inline-grid min-w-full gap-[3px]" style={{ gridTemplateColumns: `32px repeat(24, minmax(16px, 1fr))` }}>
        <span />
        {Array.from({ length: 24 }, (_, h) => (
          <span key={h} className="text-center text-[10px] text-slate-400">{h % 3 === 0 ? h : ""}</span>
        ))}
        {grid.map((row, d) => (
          <FragmentRow key={d} day={DAYS[d]} row={row} max={max} unit={unit} />
        ))}
      </div>
      <div className="mt-3 flex items-center justify-end gap-1.5 text-[11px] text-slate-400">
        น้อย
        {[0.1, 0.3, 0.5, 0.7, 0.9].map((o) => (
          <span key={o} className="h-3 w-3 rounded-sm" style={{ background: `rgba(28,48,189,${o})` }} />
        ))}
        มาก
      </div>
    </div>
  );
}
function FragmentRow({ day, row, max, unit }) {
  return (
    <>
      <span className="pr-1 text-right text-[11px] leading-4 text-slate-500">{day}</span>
      {row.map((v, h) => (
        <span
          key={h}
          title={`${day} ${String(h).padStart(2, "0")}:00 น. – ${num(v)} ${unit}`}
          className="aspect-square rounded-[3px]"
          style={{ background: v ? `rgba(28,48,189,${0.08 + (v / max) * 0.85})` : "#f1f5f9" }}
        />
      ))}
    </>
  );
}

/* ---------------- Funnel ---------------- */
export function Funnel({ steps }) {
  const top = Math.max(1, steps[0]?.value || 0);
  return (
    <ol className="space-y-3">
      {steps.map((s, i) => {
        const prev = i ? steps[i - 1].value : null;
        const w = (s.value / top) * 100;
        return (
          <li key={s.key}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">
                {i + 1}. {s.label}
              </span>
              <span className="text-slate-900">
                <b>{num(s.value)}</b> <span className="text-xs text-slate-400">({pct((s.value / top) * 100)})</span>
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-gradient-to-r from-brand-600 to-accent-500 transition-all" style={{ width: `${Math.max(w, s.value ? 1.5 : 0)}%` }} />
            </div>
            {prev != null && prev > 0 && (
              <p className="mt-1 text-xs text-slate-500">
                ไปต่อจากขั้นก่อนหน้า {pct((s.value / prev) * 100)} · หลุดออก {num(prev - s.value)} เซสชัน
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/* ---------------- CSV export ---------------- */
export function exportCsv(filename, rows, columns) {
  const esc = (v) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [columns.map((c) => esc(c.label)).join(","), ...rows.map((r) => columns.map((c) => esc(typeof c.value === "function" ? c.value(r) : r[c.key])).join(","))];
  const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export function ExportButton({ onClick, label = "ส่งออก CSV" }) {
  return (
    <button onClick={onClick} className="btn btn-secondary btn-sm">
      <Download className="h-4 w-4" /> {label}
    </button>
  );
}

/* ---------------- loading skeleton ---------------- */
export function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
      </div>
      <div className="skeleton h-80 rounded-2xl" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="skeleton h-72 rounded-2xl" />
        <div className="skeleton h-72 rounded-2xl" />
      </div>
    </div>
  );
}

