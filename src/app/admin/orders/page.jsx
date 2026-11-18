"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ShoppingBag, RefreshCw, Download, Printer, User, MapPin, CreditCard, History, Truck, Package, ExternalLink, AlertTriangle,
  Mail, Phone, ChevronRight,
} from "lucide-react";
import { AdminHeader, FilterTabs, Pager, SearchInput, paginate } from "@/app/components/admin";
import { Alert, EmptyState, Field, Modal, PageLoader, Spinner, StatusBadge } from "@/app/components/ui";
import { useToast } from "@/app/components/Providers";
import { ORDER_STATUS, api, cn, displayStatus, formatDate, formatDateTime, formatTHB, imgSrc, slipSrc } from "@/app/lib/format";

const STATUSES = ["PENDING", "PAID", "SHIPPING", "COMPLETED", "CANCELLED"];
const TRANSITIONS = {
  PENDING: ["PAID", "CANCELLED"],
  PAID: ["SHIPPING", "COMPLETED", "CANCELLED", "PENDING"],
  SHIPPING: ["COMPLETED", "CANCELLED", "PAID"],
  COMPLETED: ["SHIPPING"],
  CANCELLED: ["PENDING"],
};
const ACTION_LABEL = {
  PENDING: "ย้อนกลับเป็นรอชำระเงิน",
  PAID: "ยืนยันชำระเงินแล้ว",
  SHIPPING: "จัดส่งสินค้า",
  COMPLETED: "จัดส่งสำเร็จ",
  CANCELLED: "ยกเลิกคำสั่งซื้อ",
};
const SHIPPING_LABEL = { ems: "จัดส่งพัสดุ (EMS)", store: "รับสินค้าที่ร้าน" };
const PAGE_SIZE = 15;

const matchTab = (o, tab) => {
  if (tab === "all") return true;
  if (tab === "verify") return o.status === "PENDING" && o.payment_reported;
  return o.status === tab;
};
const statusLabel = (o) => ORDER_STATUS[displayStatus(o)]?.label || o.status;
const itemsSubtotal = (o) => (o.items || []).reduce((s, i) => s + Number(i.price) * Number(i.quantity), 0);

function exportCsv(rows) {
  const head = ["รหัสคำสั่งซื้อ", "วันที่สั่งซื้อ", "ชื่อลูกค้า", "อีเมล", "เบอร์โทร", "สถานะ", "การจัดส่ง", "ค่าจัดส่ง", "ยอดรวม", "เลขพัสดุ", "ที่อยู่จัดส่ง"];
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
  const lines = rows.map((o) =>
    [
      o.order_code,
      formatDateTime(o.createdAt),
      o.fullName,
      o.order_email,
      o.order_phone,
      statusLabel(o),
      SHIPPING_LABEL[o.shipping] || o.shipping,
      o.shipping_cost,
      o.totalPrice,
      o.tracking_number,
      o.shippingAddress,
    ]
      .map(esc)
      .join(",")
  );
  const blob = new Blob(["\uFEFF" + [head.map(esc).join(","), ...lines].join("\r\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ------------------------------------------------------------------ */
/* Print sheet (rendered into <body> so only it is printed)            */
/* ------------------------------------------------------------------ */
function PrintSheet({ order }) {
  if (typeof document === "undefined") return null;
  return createPortal(
    <div id="bm-print-sheet" className="hidden p-8 text-sm text-black">
      <style>{`@media print {
        body > *:not(#bm-print-sheet) { display: none !important; }
        #bm-print-sheet { display: block !important; }
        @page { margin: 12mm; }
      }`}</style>
      <div className="flex items-start justify-between border-b-2 border-black pb-4">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="" className="h-12 w-auto" />
          <div>
            <p className="text-lg font-bold">บริษัท เบสท เมดิคอล จำกัด</p>
            <p>โทร 074-606-389</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold">ใบสั่งซื้อ</p>
          <p>เลขที่ {order.order_code}</p>
          <p>วันที่ {formatDateTime(order.createdAt)}</p>
          <p>สถานะ: {statusLabel(order)}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-6">
        <div>
          <p className="font-bold">ลูกค้า</p>
          <p>{order.fullName || "-"}</p>
          <p>{order.order_email}</p>
          <p>{order.order_phone || "-"}</p>
        </div>
        <div>
          <p className="font-bold">ที่อยู่จัดส่ง</p>
          <p className="whitespace-pre-line">{order.shippingAddress || "-"}</p>
          <p>วิธีจัดส่ง: {SHIPPING_LABEL[order.shipping] || order.shipping || "-"}</p>
          {order.tracking_number && (
            <p>
              เลขพัสดุ: {order.tracking_number} {order.shipping_company && `(${order.shipping_company})`}
            </p>
          )}
        </div>
      </div>
      <table className="mt-6 w-full border-collapse">
        <thead>
          <tr className="border-y border-black">
            <th className="py-2 text-left">#</th>
            <th className="py-2 text-left">รายการสินค้า</th>
            <th className="py-2 text-right">ราคา/หน่วย</th>
            <th className="py-2 text-right">จำนวน</th>
            <th className="py-2 text-right">รวม</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((it, i) => (
            <tr key={i} className="border-b border-slate-300">
              <td className="py-2">{i + 1}</td>
              <td className="py-2">{it.name}</td>
              <td className="py-2 text-right">{formatTHB(it.price)}</td>
              <td className="py-2 text-right">{it.quantity}</td>
              <td className="py-2 text-right">{formatTHB(it.price * it.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 ml-auto w-64 space-y-1">
        <div className="flex justify-between">
          <span>รวมค่าสินค้า</span>
          <span>{formatTHB(itemsSubtotal(order))}</span>
        </div>
        <div className="flex justify-between">
          <span>ค่าจัดส่ง</span>
          <span>{formatTHB(order.shipping_cost)}</span>
        </div>
        <div className="flex justify-between border-t border-black pt-1 text-base font-bold">
          <span>ยอดรวมทั้งสิ้น</span>
          <span>{formatTHB(order.totalPrice)}</span>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ------------------------------------------------------------------ */
/* Order detail modal                                                  */
/* ------------------------------------------------------------------ */
function InfoRow({ icon: Icon, children }) {
  return (
    <p className="flex items-start gap-2 text-sm text-slate-700">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
      <span className="min-w-0 break-words">{children}</span>
    </p>
  );
}

function Section({ icon: Icon, title, children, className }) {
  return (
    <section className={cn("rounded-2xl border border-slate-200 p-4", className)}>
      <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
        <Icon className="h-4 w-4 text-brand-700" /> {title}
      </h4>
      {children}
    </section>
  );
}

function StatusPanel({ order, onDone }) {
  const toast = useToast();
  const options = useMemo(() => {
    const next = TRANSITIONS[order.status] || [];
    return order.status === "SHIPPING" ? ["SHIPPING", ...next] : next;
  }, [order.status]);
  const [next, setNext] = useState("");
  const [note, setNote] = useState("");
  const [tracking, setTracking] = useState(order.tracking_number || "");
  const [company, setCompany] = useState(order.shipping_company || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!next || saving) return;
    setError("");
    if (next === "CANCELLED" && !note.trim()) {
      setError("กรุณาระบุเหตุผลในการยกเลิก");
      return;
    }
    if (next === "SHIPPING" && order.shipping !== "store" && !tracking.trim()) {
      setError("กรุณากรอกเลขพัสดุ");
      return;
    }
    if (next === "CANCELLED") {
      const ok = await toast.confirm({
        title: "ยืนยันการยกเลิกคำสั่งซื้อ",
        message: `ต้องการยกเลิกคำสั่งซื้อ ${order.order_code} ใช่หรือไม่? หากตัดสต็อกไปแล้ว ระบบจะคืนสต็อกให้อัตโนมัติ`,
        confirmText: "ยกเลิกคำสั่งซื้อ",
        tone: "danger",
      });
      if (!ok) return;
    }
    setSaving(true);
    try {
      const res = await api("/api/admin/orders", {
        method: "PUT",
        body: {
          order_id: order.order_id,
          status: next,
          note: note.trim() || undefined,
          tracking_number: next === "SHIPPING" ? tracking.trim() || undefined : undefined,
          shipping_company: next === "SHIPPING" ? company.trim() || undefined : undefined,
        },
      });
      toast.success(res?.message || "อัปเดตสถานะเรียบร้อย");
      setNext("");
      setNote("");
      onDone();
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!options.length) return null;

  return (
    <Section icon={RefreshCw} title="อัปเดตสถานะคำสั่งซื้อ" className="no-print bg-slate-50/60">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <p className="label">เลือกสถานะถัดไป</p>
          <div className="flex flex-wrap gap-2">
            {options.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => {
                  setNext(s);
                  setError("");
                }}
                aria-pressed={next === s}
                className={cn(
                  "btn btn-sm",
                  next === s ? (s === "CANCELLED" ? "btn-danger" : "btn-primary") : s === "CANCELLED" ? "btn-danger-soft" : "btn-secondary"
                )}
              >
                {s === order.status ? "อัปเดตข้อมูลการจัดส่ง" : ACTION_LABEL[s]}
              </button>
            ))}
          </div>
        </div>

        {next === "PAID" && order.status === "PENDING" && !order.payment_reported && (
          <Alert tone="warning">ลูกค้ายังไม่ได้แจ้งชำระเงิน กรุณาตรวจสอบยอดเงินเข้าบัญชีก่อนยืนยัน</Alert>
        )}
        {next && ["PAID", "SHIPPING", "COMPLETED"].includes(next) && ["PENDING", "CANCELLED"].includes(order.status) && (
          <p className="help">ระบบจะตัดสต็อกสินค้าอัตโนมัติเมื่อยืนยันการชำระเงิน</p>
        )}

        {next === "SHIPPING" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="เลขพัสดุ" required={order.shipping !== "store"}>
              <input className="input" value={tracking} onChange={(e) => setTracking(e.target.value)} maxLength={100} placeholder="เช่น EF123456789TH" />
            </Field>
            <Field label="บริษัทขนส่ง">
              <input
                className="input"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                maxLength={100}
                placeholder="เช่น ไปรษณีย์ไทย, Kerry, Flash"
                list="bm-carriers"
              />
              <datalist id="bm-carriers">
                <option value="ไปรษณีย์ไทย (EMS)" />
                <option value="Kerry Express" />
                <option value="Flash Express" />
                <option value="J&T Express" />
              </datalist>
            </Field>
          </div>
        )}

        {next && (
          <Field
            label={next === "CANCELLED" ? "เหตุผลในการยกเลิก" : "หมายเหตุ"}
            required={next === "CANCELLED"}
            help={next === "CANCELLED" ? "เช่น สินค้าหมด, ลูกค้าขอยกเลิก" : "ไม่บังคับ — บันทึกไว้ในประวัติสถานะ"}
          >
            <textarea
              className={cn("input min-h-[80px]", error && next === "CANCELLED" && !note.trim() && "input-error")}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={1000}
              required={next === "CANCELLED"}
            />
          </Field>
        )}

        {error && <Alert tone="error">{error}</Alert>}

        {next && (
          <div className="flex justify-end gap-2">
            <button type="button" className="btn btn-ghost" onClick={() => setNext("")} disabled={saving}>
              ยกเลิก
            </button>
            <button type="submit" className={cn("btn", next === "CANCELLED" ? "btn-danger" : "btn-primary")} disabled={saving}>
              {saving && <Spinner className="h-4 w-4" />} บันทึกสถานะ
            </button>
          </div>
        )}
      </form>
    </Section>
  );
}

function OrderDetailModal({ orderId, onClose, onUpdated }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setOrder(await api(`/api/admin/orders/${orderId}`));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    load();
  }, [load]);

  const slip = order ? slipSrc(order.transfer_slip_file) : "";

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      title={order ? `คำสั่งซื้อ ${order.order_code}` : "รายละเอียดคำสั่งซื้อ"}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose}>
            ปิด
          </button>
          <button className="btn btn-primary" onClick={() => window.print()} disabled={!order}>
            <Printer className="h-4 w-4" /> พิมพ์ใบสั่งซื้อ
          </button>
        </>
      }
    >
      {loading && !order ? (
        <PageLoader label="กำลังโหลดรายละเอียด..." />
      ) : error && !order ? (
        <Alert tone="error" title="โหลดข้อมูลไม่สำเร็จ">
          {error}
        </Alert>
      ) : order ? (
        <div className={cn("space-y-4 transition-opacity", loading && "opacity-60")}>
          <PrintSheet order={order} />
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge order={order} />
            <span className="text-sm text-slate-500">สั่งซื้อเมื่อ {formatDateTime(order.createdAt)}</span>
            {order.statusInfo?.description && <span className="text-sm text-slate-500">· {order.statusInfo.description}</span>}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Section icon={User} title="ข้อมูลลูกค้า">
              <div className="space-y-1.5">
                <InfoRow icon={User}>{order.fullName || "ไม่ระบุ"}</InfoRow>
                <InfoRow icon={Mail}>
                  <a href={`mailto:${order.order_email}`} className="link">
                    {order.order_email}
                  </a>
                </InfoRow>
                <InfoRow icon={Phone}>
                  {order.order_phone ? (
                    <a href={`tel:${order.order_phone}`} className="link">
                      {order.order_phone}
                    </a>
                  ) : (
                    "ไม่ระบุ"
                  )}
                </InfoRow>
              </div>
            </Section>
            <Section icon={MapPin} title="การจัดส่ง">
              <div className="space-y-1.5">
                <InfoRow icon={Truck}>{SHIPPING_LABEL[order.shipping] || order.shipping || "-"}</InfoRow>
                <InfoRow icon={MapPin}>
                  <span className="whitespace-pre-line">{order.shippingAddress || "ไม่ระบุที่อยู่"}</span>
                </InfoRow>
                {order.tracking_number && (
                  <InfoRow icon={Package}>
                    เลขพัสดุ <b className="font-mono">{order.tracking_number}</b>
                    {order.shipping_company && ` · ${order.shipping_company}`}
                  </InfoRow>
                )}
              </div>
            </Section>
          </div>

          <Section icon={ShoppingBag} title={`รายการสินค้า (${order.items.length})`}>
            <div className="-mx-4 overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>สินค้า</th>
                    <th className="text-right">ราคา/หน่วย</th>
                    <th className="text-right">จำนวน</th>
                    <th className="text-right">รวม</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((it, i) => (
                    <tr key={`${it.product_id}-${i}`}>
                      <td>
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={imgSrc(it.image)}
                            alt=""
                            className="h-12 w-12 shrink-0 rounded-lg border border-slate-100 object-cover"
                            onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                          />
                          <span className="min-w-[10rem] font-medium text-slate-800">{it.name}</span>
                        </div>
                      </td>
                      <td className="text-right whitespace-nowrap">{formatTHB(it.price)}</td>
                      <td className="text-right">{it.quantity}</td>
                      <td className="text-right font-medium whitespace-nowrap">{formatTHB(it.price * it.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <dl className="mt-3 ml-auto max-w-xs space-y-1 text-sm">
              <div className="flex justify-between text-slate-600">
                <dt>รวมค่าสินค้า</dt>
                <dd>{formatTHB(itemsSubtotal(order))}</dd>
              </div>
              <div className="flex justify-between text-slate-600">
                <dt>ค่าจัดส่ง</dt>
                <dd>{order.shipping_cost > 0 ? formatTHB(order.shipping_cost) : "ฟรี"}</dd>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-1.5 text-base font-bold text-slate-900">
                <dt>ยอดรวมทั้งสิ้น</dt>
                <dd className="text-brand-700">{formatTHB(order.totalPrice)}</dd>
              </div>
            </dl>
          </Section>

          <div className="grid gap-4 md:grid-cols-2">
            <Section icon={CreditCard} title="การชำระเงิน">
              {order.paidAtdate ? (
                <div className="space-y-3">
                  <p className="text-sm text-slate-700">
                    โอนเมื่อ {formatDate(order.paidAtdate)} {order.paidAttime && `เวลา ${String(order.paidAttime).slice(0, 5)} น.`}
                  </p>
                  {slip ? (
                    <a href={slip} target="_blank" rel="noopener noreferrer" className="group relative block w-fit" title="เปิดสลิปขนาดเต็มในแท็บใหม่">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={slip} alt="หลักฐานการโอนเงิน" className="max-h-64 rounded-xl border border-slate-200 object-contain" />
                      <span className="absolute top-2 right-2 flex items-center gap-1 rounded-lg bg-slate-900/70 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100">
                        <ExternalLink className="h-3 w-3" /> ขยาย
                      </span>
                    </a>
                  ) : (
                    <p className="text-sm text-slate-400">ไม่พบรูปภาพสลิป</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  {order.status === "PENDING" ? "ลูกค้ายังไม่ได้แจ้งชำระเงิน" : "ไม่มีข้อมูลการแจ้งโอนในคำสั่งซื้อ"}
                </p>
              )}

              {order.payments?.length > 0 && (
                <div className="mt-4 border-t border-slate-100 pt-3">
                  <p className="mb-2 text-xs font-semibold text-slate-500">ประวัติการแจ้งชำระเงิน ({order.payments.length})</p>
                  <ul className="space-y-2">
                    {order.payments.map((p) => {
                      const ps = slipSrc(p.transfer_slip_file);
                      const mismatch = Math.abs(Number(p.amount) - Number(order.totalPrice)) > 0.009;
                      return (
                        <li key={p.id} className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm">
                          <div className="min-w-0">
                            <p className={cn("font-medium", mismatch ? "text-amber-700" : "text-slate-800")}>
                              {formatTHB(p.amount)} {mismatch && <AlertTriangle className="inline h-3.5 w-3.5" aria-label="ยอดไม่ตรง" />}
                            </p>
                            <p className="text-xs text-slate-500">
                              โอน {formatDate(p.transfer_date)} {p.transfer_time && String(p.transfer_time).slice(0, 5)} · แจ้งเมื่อ {formatDateTime(p.created_at)}
                            </p>
                          </div>
                          {ps && (
                            <a href={ps} target="_blank" rel="noopener noreferrer" className="link shrink-0 text-xs">
                              ดูสลิป
                            </a>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </Section>

            <Section icon={History} title="ประวัติสถานะ">
              {order.history?.length ? (
                <ol className="relative space-y-4 border-l-2 border-slate-100 pl-5">
                  {order.history
                    .slice()
                    .reverse()
                    .map((h) => (
                      <li key={h.id} className="relative">
                        <span
                          className={cn(
                            "absolute top-1 -left-[27px] h-3 w-3 rounded-full ring-4 ring-white",
                            h.status === "CANCELLED" ? "bg-red-500" : h.status === "COMPLETED" ? "bg-emerald-500" : "bg-brand-600"
                          )}
                        />
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusBadge status={h.status} />
                          {h.previous_status && h.previous_status !== h.status && (
                            <span className="text-xs text-slate-400">จาก {ORDER_STATUS[h.previous_status]?.label || h.previous_status}</span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-slate-500">{formatDateTime(h.created_at)}</p>
                        {h.note && <p className="mt-1 text-sm text-slate-700">{h.note}</p>}
                        {h.tracking_number && (
                          <p className="mt-1 text-xs text-slate-600">
                            เลขพัสดุ {h.tracking_number} {h.shipping_company && `(${h.shipping_company})`}
                          </p>
                        )}
                      </li>
                    ))}
                </ol>
              ) : (
                <p className="text-sm text-slate-500">ยังไม่มีประวัติการเปลี่ยนสถานะ</p>
              )}
            </Section>
          </div>

          <StatusPanel
            key={order.status}
            order={order}
            onDone={() => {
              load();
              onUpdated();
            }}
          />
        </div>
      ) : null}
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
function OrdersContent() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initialTab = (() => {
    const s = params.get("status");
    if (params.get("verify") === "1" || s === "verify" || s === "VERIFYING") return "verify";
    return STATUSES.includes(s) ? s : "all";
  })();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState(initialTab);
  const [search, setSearch] = useState(params.get("q") || "");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api("/api/admin/orders");
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // keep URL in sync so links/back button work
  useEffect(() => {
    const sp = new URLSearchParams();
    if (tab !== "all") sp.set("status", tab);
    if (search.trim()) sp.set("q", search.trim());
    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [tab, search, pathname, router]);

  const searched = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter((o) =>
      [o.order_code, o.order_email, o.fullName, o.order_phone].some((v) => String(v || "").toLowerCase().includes(q))
    );
  }, [orders, search]);

  const tabs = useMemo(() => {
    const count = (t) => searched.filter((o) => matchTab(o, t)).length;
    return [
      { value: "all", label: "ทั้งหมด", count: searched.length },
      { value: "verify", label: "รอตรวจสอบการชำระ", count: count("verify") },
      ...STATUSES.map((s) => ({ value: s, label: ORDER_STATUS[s].label, count: count(s) })),
    ];
  }, [searched]);

  const filtered = useMemo(() => searched.filter((o) => matchTab(o, tab)), [searched, tab]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const { rows } = paginate(filtered, safePage, PAGE_SIZE);

  return (
    <div>
      <AdminHeader
        title="คำสั่งซื้อ"
        description="ตรวจสอบ อัปเดตสถานะ และจัดการการจัดส่งคำสั่งซื้อทั้งหมด"
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

      <div className="mb-4 space-y-3">
        <FilterTabs
          tabs={tabs}
          value={tab}
          onChange={(v) => {
            setTab(v);
            setPage(1);
          }}
        />
        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="ค้นหารหัสคำสั่งซื้อ, อีเมล, ชื่อ หรือเบอร์โทร..."
          className="max-w-md"
        />
      </div>

      {error && (
        <Alert tone="error" title="โหลดข้อมูลไม่สำเร็จ" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="card overflow-hidden">
        {loading && !orders.length ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-12 w-full" />
            ))}
          </div>
        ) : !filtered.length ? (
          <EmptyState
            icon={ShoppingBag}
            title={orders.length ? "ไม่พบคำสั่งซื้อที่ตรงกับเงื่อนไข" : "ยังไม่มีคำสั่งซื้อ"}
            description={orders.length ? "ลองเปลี่ยนตัวกรองหรือคำค้นหา" : undefined}
            action={
              orders.length && (search || tab !== "all") ? (
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setSearch("");
                    setTab("all");
                  }}
                >
                  ล้างตัวกรอง
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
                    <th>รหัสคำสั่งซื้อ</th>
                    <th>ลูกค้า</th>
                    <th className="text-right">รายการ</th>
                    <th className="text-right">ยอดรวม</th>
                    <th>การจัดส่ง</th>
                    <th>สถานะ</th>
                    <th>วันที่สั่งซื้อ</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((o) => (
                    <tr
                      key={o.order_id}
                      className="cursor-pointer hover:bg-slate-50"
                      onClick={() => setSelected(o.order_id)}
                      tabIndex={0}
                      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setSelected(o.order_id))}
                    >
                      <td className="font-mono text-sm font-medium text-brand-700">{o.order_code}</td>
                      <td>
                        <p className="font-medium text-slate-800">{o.fullName || "-"}</p>
                        <p className="text-xs text-slate-500">{o.order_email}</p>
                      </td>
                      <td className="text-right text-slate-600">{o.items.reduce((s, i) => s + i.quantity, 0)}</td>
                      <td className="text-right font-medium whitespace-nowrap">{formatTHB(o.totalPrice)}</td>
                      <td className="text-sm whitespace-nowrap text-slate-600">
                        {o.shipping === "store" ? "รับที่ร้าน" : "EMS"}
                        {o.tracking_number && <p className="font-mono text-xs text-slate-400">{o.tracking_number}</p>}
                      </td>
                      <td>
                        <StatusBadge order={o} />
                      </td>
                      <td className="whitespace-nowrap text-slate-500">{formatDateTime(o.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-slate-100 md:hidden">
              {rows.map((o) => (
                <li key={o.order_id}>
                  <button className="flex w-full items-center gap-3 px-4 py-4 text-left hover:bg-slate-50" onClick={() => setSelected(o.order_id)}>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-sm font-semibold text-brand-700">{o.order_code}</span>
                        <StatusBadge order={o} />
                      </div>
                      <p className="truncate text-sm text-slate-800">{o.fullName || o.order_email}</p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{formatDateTime(o.createdAt)}</span>
                        <span className="text-sm font-semibold text-slate-900">{formatTHB(o.totalPrice)}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
                  </button>
                </li>
              ))}
            </ul>
            <Pager page={safePage} pageCount={pageCount} onChange={setPage} total={filtered.length} />
          </>
        )}
      </div>

      {selected && <OrderDetailModal orderId={selected} onClose={() => setSelected(null)} onUpdated={load} />}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <OrdersContent />
    </Suspense>
  );
}
