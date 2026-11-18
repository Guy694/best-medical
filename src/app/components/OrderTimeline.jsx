"use client";

import { Check, ClipboardList, CreditCard, Truck, PackageCheck, XCircle, Clock, History } from "lucide-react";
import { ORDER_STATUS, formatDateTime, cn } from "@/app/lib/format";

const STEPS = [
  { key: "PENDING", label: "สั่งซื้อ / รอชำระ", icon: ClipboardList },
  { key: "PAID", label: "ชำระเงินแล้ว", icon: CreditCard },
  { key: "SHIPPING", label: "กำลังจัดส่ง", icon: Truck },
  { key: "COMPLETED", label: "สำเร็จ", icon: PackageCheck },
];

const STEP_INDEX = { PENDING: 0, PAID: 1, SHIPPING: 2, COMPLETED: 3 };

const DOT_TONES = {
  amber: "bg-amber-500",
  sky: "bg-sky-500",
  blue: "bg-brand-600",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  red: "bg-red-500",
  slate: "bg-slate-400",
};

/** Order progress (4 steps) + status history list when available. */
export default function OrderTimeline({ order }) {
  if (!order) return null;
  const cancelled = order.status === "CANCELLED";
  const verifying = order.status === "PENDING" && (order.payment_reported || order.statusInfo?.verifying);
  const current = STEP_INDEX[order.status] ?? 0;
  const history = Array.isArray(order.history) ? [...order.history].reverse() : [];

  return (
    <div className="space-y-6">
      {cancelled ? (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
          <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">คำสั่งซื้อนี้ถูกยกเลิกแล้ว</p>
            <p className="text-sm text-red-700">{order.statusInfo?.description || "หากมีข้อสงสัย กรุณาติดต่อร้านค้า"}</p>
          </div>
        </div>
      ) : (
        <ol className="grid grid-cols-4 gap-1" aria-label="ขั้นตอนคำสั่งซื้อ">
          {STEPS.map((s, i) => {
            const done = i < current || (i === current && order.status === "COMPLETED");
            const active = i === current && !done;
            const Icon = done ? Check : active && verifying ? Clock : s.icon;
            return (
              <li key={s.key} className="relative flex flex-col items-center text-center" aria-current={active ? "step" : undefined}>
                {i > 0 && (
                  <span
                    className={cn("absolute top-5 right-1/2 h-0.5 w-full -translate-y-1/2", i <= current ? "bg-brand-600" : "bg-slate-200")}
                    aria-hidden
                  />
                )}
                <span
                  className={cn(
                    "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition",
                    done && "border-brand-600 bg-brand-600 text-white",
                    active && "border-brand-600 bg-white text-brand-700 ring-4 ring-brand-100",
                    !done && !active && "border-slate-200 bg-white text-slate-400"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className={cn("mt-2 text-xs font-medium sm:text-sm", done || active ? "text-slate-900" : "text-slate-400")}>
                  {s.label}
                </span>
                {active && verifying && (
                  <span className="mt-1 rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700">รอตรวจสอบการชำระ</span>
                )}
              </li>
            );
          })}
        </ol>
      )}

      {history.length > 0 && (
        <div>
          <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <History className="h-4 w-4 text-brand-600" /> ประวัติสถานะ
          </h4>
          <ul className="relative ml-1.5 space-y-4 border-l-2 border-slate-100 pl-5">
            {history.map((h) => {
              const meta = ORDER_STATUS[h.status] || { label: h.status, tone: "slate" };
              return (
                <li key={h.id} className="relative">
                  <span
                    className={cn("absolute top-1.5 -left-[27px] h-3 w-3 rounded-full ring-4 ring-white", DOT_TONES[meta.tone])}
                    aria-hidden
                  />
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <p className="font-medium text-slate-900">{meta.label}</p>
                    <time className="text-xs text-slate-500">{formatDateTime(h.created_at)}</time>
                  </div>
                  {h.note && <p className="mt-0.5 text-sm text-slate-600">{h.note}</p>}
                  {h.tracking_number && (
                    <p className="mt-0.5 text-sm text-slate-600">
                      เลขพัสดุ: <span className="font-mono font-medium text-slate-800">{h.tracking_number}</span>
                      {h.shipping_company && ` (${h.shipping_company})`}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
