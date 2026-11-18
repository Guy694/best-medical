"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CreditCard, RefreshCw, CheckCircle2, XCircle, Phone, Mail, MapPin, CalendarClock, AlertTriangle, ExternalLink, ImageOff, User,
} from "lucide-react";
import { AdminHeader, FilterTabs, Pager, SearchInput, paginate } from "@/app/components/admin";
import { Alert, EmptyState, Field, Modal, Spinner, StatusBadge } from "@/app/components/ui";
import { useToast } from "@/app/components/Providers";
import { api, cn, formatDate, formatDateTime, formatTHB, slipSrc } from "@/app/lib/format";

const PAGE_SIZE = 12;
const isAwaiting = (n) => n.status === "PENDING" && !!n.paidAtdate;
const timeLabel = (t) => (t ? `${String(t).slice(0, 5)} น.` : "");

function NoticeCard({ notice, busy, onApprove, onReject, onViewSlip }) {
  const slip = slipSrc(notice.transfer_slip_file);
  const awaiting = isAwaiting(notice);
  const mismatch = notice.order_total != null && Math.abs(Number(notice.amount) - Number(notice.order_total)) > 0.009;

  return (
    <article className={cn("card flex flex-col overflow-hidden", awaiting && "ring-2 ring-sky-200")}>
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-5 py-3">
        <Link href={`/admin/orders?q=${encodeURIComponent(notice.order_code)}`} className="link font-mono text-sm font-semibold">
          {notice.order_code}
        </Link>
        {notice.status ? <StatusBadge order={{ status: notice.status, paidAtdate: notice.paidAtdate }} /> : <span className="text-xs text-slate-400">ไม่พบคำสั่งซื้อ</span>}
      </div>

      <div className="flex flex-1 gap-4 p-5">
        <button
          type="button"
          onClick={() => slip && onViewSlip(notice)}
          disabled={!slip}
          className="group relative h-32 w-24 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 sm:h-36 sm:w-28"
          aria-label="ดูหลักฐานการโอน"
        >
          {slip ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={slip} alt="สลิปการโอนเงิน" className="h-full w-full object-cover transition group-hover:scale-105" />
          ) : (
            <span className="flex h-full flex-col items-center justify-center gap-1 text-xs text-slate-400">
              <ImageOff className="h-5 w-5" /> ไม่มีไฟล์
            </span>
          )}
        </button>

        <div className="min-w-0 flex-1 space-y-1.5 text-sm">
          <div>
            <p className={cn("text-xl font-bold", mismatch ? "text-amber-600" : "text-slate-900")}>{formatTHB(notice.amount)}</p>
            {notice.order_total != null && (
              <p className={cn("text-xs", mismatch ? "font-medium text-amber-700" : "text-slate-500")}>
                {mismatch ? (
                  <span className="inline-flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" /> ไม่ตรงกับยอดคำสั่งซื้อ {formatTHB(notice.order_total)}
                  </span>
                ) : (
                  "ตรงกับยอดคำสั่งซื้อ"
                )}
              </p>
            )}
          </div>
          <p className="flex items-center gap-2 text-slate-700">
            <CalendarClock className="h-4 w-4 shrink-0 text-slate-400" />
            โอน {formatDate(notice.transfer_date)} {timeLabel(notice.transfer_time)}
          </p>
          <p className="flex items-center gap-2 truncate font-medium text-slate-800">
            <User className="h-4 w-4 shrink-0 text-slate-400" /> {notice.customer_name || "-"}
          </p>
          {notice.customer_phone && (
            <a href={`tel:${notice.customer_phone}`} className="flex items-center gap-2 text-slate-600 hover:text-brand-700">
              <Phone className="h-4 w-4 shrink-0 text-slate-400" /> {notice.customer_phone}
            </a>
          )}
          {notice.customer_email && (
            <a href={`mailto:${notice.customer_email}`} className="flex min-w-0 items-center gap-2 text-slate-600 hover:text-brand-700">
              <Mail className="h-4 w-4 shrink-0 text-slate-400" /> <span className="truncate">{notice.customer_email}</span>
            </a>
          )}
        </div>
      </div>

      {notice.shipping_address && (
        <p className="mx-5 mb-4 flex gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
          <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
          <span className="line-clamp-3 whitespace-pre-line">{notice.shipping_address}</span>
        </p>
      )}

      <div className="flex items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-3">
        <span className="text-xs text-slate-500">แจ้งเมื่อ {formatDateTime(notice.created_at)}</span>
        {awaiting ? (
          <div className="flex gap-2">
            <button className="btn btn-danger-soft btn-sm" onClick={() => onReject(notice)} disabled={busy}>
              <XCircle className="h-4 w-4" /> ปฏิเสธ
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => onApprove(notice)} disabled={busy}>
              {busy ? <Spinner className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />} ยืนยันการชำระเงิน
            </button>
          </div>
        ) : (
          <span className="text-xs text-slate-400">ดำเนินการแล้ว</span>
        )}
      </div>
    </article>
  );
}

export default function AdminPaymentNoticePage() {
  const toast = useToast();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("awaiting");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState(null);
  const [slipView, setSlipView] = useState(null);
  const [rejecting, setRejecting] = useState(null);
  const [reason, setReason] = useState("");
  const [rejectError, setRejectError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api("/api/admin/payment-notice");
      setNotices(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const searched = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return notices;
    return notices.filter((n) =>
      [n.order_code, n.customer_name, n.customer_email, n.customer_phone].some((v) => String(v || "").toLowerCase().includes(q))
    );
  }, [notices, search]);

  // only the latest notice per order is actionable in the "awaiting" tab
  const awaiting = useMemo(() => {
    const seen = new Set();
    return searched.filter((n) => {
      if (!isAwaiting(n) || seen.has(n.order_id)) return false;
      seen.add(n.order_id);
      return true;
    });
  }, [searched]);

  const list = tab === "awaiting" ? awaiting : searched;
  const pageCount = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const { rows } = paginate(list, safePage, PAGE_SIZE);

  const approve = async (n) => {
    const ok = await toast.confirm({
      title: "ยืนยันการชำระเงิน",
      message: `ยืนยันว่าได้รับยอดโอน ${formatTHB(n.amount)} สำหรับคำสั่งซื้อ ${n.order_code} แล้ว? ระบบจะเปลี่ยนสถานะเป็น "ชำระเงินแล้ว" และตัดสต็อกสินค้า`,
      confirmText: "ยืนยันการชำระเงิน",
    });
    if (!ok) return;
    setBusyId(n.id);
    try {
      const res = await api("/api/admin/payment-notice", { method: "PUT", body: { orderId: n.order_id, action: "approve" } });
      toast.success(res?.message || "ยืนยันการชำระเงินเรียบร้อย");
      await load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const openReject = (n) => {
    setRejecting(n);
    setReason("");
    setRejectError("");
  };

  const submitReject = async (e) => {
    e.preventDefault();
    if (!rejecting || busyId) return;
    if (!reason.trim()) {
      setRejectError("กรุณาระบุเหตุผลที่ปฏิเสธ");
      return;
    }
    setBusyId(rejecting.id);
    try {
      const res = await api("/api/admin/payment-notice", {
        method: "PUT",
        body: { orderId: rejecting.order_id, action: "reject", note: reason.trim() },
      });
      toast.success(res?.message || "ปฏิเสธการแจ้งชำระเงินแล้ว");
      setRejecting(null);
      await load();
    } catch (err) {
      setRejectError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <AdminHeader
        title="ตรวจสอบการชำระเงิน"
        description="ตรวจสอบหลักฐานการโอนเงินจากลูกค้า และยืนยันหรือปฏิเสธการชำระเงิน"
        actions={
          <button className="btn btn-secondary" onClick={load} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} /> รีเฟรช
          </button>
        }
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterTabs
          tabs={[
            { value: "awaiting", label: "รอตรวจสอบ", count: awaiting.length },
            { value: "all", label: "ทั้งหมด", count: searched.length },
          ]}
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
          placeholder="ค้นหารหัสคำสั่งซื้อ, ชื่อ, อีเมล, เบอร์โทร..."
          className="sm:w-80"
        />
      </div>

      {error && (
        <Alert tone="error" title="โหลดข้อมูลไม่สำเร็จ" className="mb-4">
          {error}
        </Alert>
      )}

      {loading && !notices.length ? (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card card-body flex gap-4">
              <div className="skeleton h-36 w-28 rounded-xl" />
              <div className="flex-1 space-y-3">
                <div className="skeleton h-6 w-32" />
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : !list.length ? (
        <div className="card">
          <EmptyState
            icon={tab === "awaiting" ? CheckCircle2 : CreditCard}
            title={tab === "awaiting" ? "ไม่มีรายการรอตรวจสอบ" : "ไม่มีการแจ้งชำระเงิน"}
            description={tab === "awaiting" ? "ตรวจสอบการแจ้งชำระเงินครบทุกรายการแล้ว" : search ? "ลองเปลี่ยนคำค้นหา" : undefined}
          />
        </div>
      ) : (
        <>
          <div className={cn("grid gap-4 md:grid-cols-2 2xl:grid-cols-3", loading && "opacity-60")}>
            {rows.map((n) => (
              <NoticeCard key={n.id} notice={n} busy={busyId === n.id} onApprove={approve} onReject={openReject} onViewSlip={setSlipView} />
            ))}
          </div>
          {pageCount > 1 && (
            <div className="card mt-4">
              <Pager page={safePage} pageCount={pageCount} onChange={setPage} total={list.length} />
            </div>
          )}
        </>
      )}

      <Modal
        open={!!slipView}
        onClose={() => setSlipView(null)}
        title={slipView ? `หลักฐานการโอน · ${slipView.order_code}` : ""}
        footer={
          slipView && (
            <>
              <a href={slipSrc(slipView.transfer_slip_file)} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                <ExternalLink className="h-4 w-4" /> เปิดในแท็บใหม่
              </a>
              <button className="btn btn-primary" onClick={() => setSlipView(null)}>
                ปิด
              </button>
            </>
          )
        }
      >
        {slipView && (
          <div className="space-y-3">
            <div className="flex flex-wrap justify-between gap-2 text-sm text-slate-600">
              <span>
                ยอดโอน <b className="text-slate-900">{formatTHB(slipView.amount)}</b>
              </span>
              <span>
                {formatDate(slipView.transfer_date)} {timeLabel(slipView.transfer_time)}
              </span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={slipSrc(slipView.transfer_slip_file)} alt="หลักฐานการโอนเงิน" className="mx-auto max-h-[65vh] rounded-xl border border-slate-200 object-contain" />
          </div>
        )}
      </Modal>

      <Modal
        open={!!rejecting}
        onClose={() => !busyId && setRejecting(null)}
        size="sm"
        title="ปฏิเสธการแจ้งชำระเงิน"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setRejecting(null)} disabled={!!busyId}>
              ยกเลิก
            </button>
            <button type="submit" form="reject-form" className="btn btn-danger" disabled={!!busyId}>
              {busyId && <Spinner className="h-4 w-4" />} ปฏิเสธ
            </button>
          </>
        }
      >
        {rejecting && (
          <form id="reject-form" onSubmit={submitReject} className="space-y-4">
            <p className="text-sm text-slate-600">
              คำสั่งซื้อ <b className="font-mono">{rejecting.order_code}</b> จะกลับเป็นสถานะ &quot;รอชำระเงิน&quot; และลูกค้าสามารถแจ้งชำระใหม่ได้
            </p>
            <Field label="เหตุผลที่ปฏิเสธ" required error={rejectError}>
              <textarea
                className={cn("input min-h-[100px]", rejectError && "input-error")}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="เช่น ยอดเงินไม่ตรง, สลิปไม่ชัดเจน, ไม่พบยอดเงินเข้าบัญชี"
                maxLength={1000}
                required
                autoFocus
              />
            </Field>
          </form>
        )}
      </Modal>
    </div>
  );
}
