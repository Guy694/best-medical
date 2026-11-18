"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2, CreditCard, Home, Mail, Package, Printer, Search } from "lucide-react";
import { Alert, PageLoader, StatusBadge } from "@/app/components/ui";
import { BankCard, CopyButton, OrderItems, OrderTotals } from "@/app/components/order/OrderParts";
import { api, formatDateTime } from "@/app/lib/format";

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const code = decodeURIComponent(String(orderId || ""));
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code) return;
    let alive = true;
    api(`/api/orders/${encodeURIComponent(code)}`)
      .then((d) => alive && setOrder(d))
      .catch((err) => alive && setError(err.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [code]);

  const payHref = `/payment-notice?order=${encodeURIComponent(code)}${order ? `&amount=${order.totalPrice}` : ""}`;
  const canPay = !order || (order.status === "PENDING" && !order.payment_reported);

  return (
    <div className="container-page max-w-5xl py-10">
      <div className="card animate-slide-up overflow-hidden">
        <div className="bg-gradient-to-br from-emerald-50 via-white to-accent-50 px-6 py-10 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
            <CheckCircle2 className="h-11 w-11" />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-slate-900 sm:text-3xl">สั่งซื้อสำเร็จ ขอบคุณที่ใช้บริการ</h1>
          <p className="mt-2 text-slate-600">เลขคำสั่งซื้อของคุณคือ</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
            <span className="rounded-xl border-2 border-dashed border-brand-300 bg-white px-5 py-2 font-mono text-xl font-bold tracking-wider text-brand-800 sm:text-2xl">
              {code}
            </span>
            <CopyButton text={code} label="คัดลอกเลข" />
          </div>
          {order && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-slate-500">
              <span>คำสั่งซื้อวันที่ {formatDateTime(order.createdAt)}</span>
              <StatusBadge order={order} />
            </div>
          )}
        </div>
        <div className="grid gap-3 border-t border-slate-100 px-6 py-5 text-sm sm:grid-cols-2">
          <p className="flex items-start gap-2 text-slate-600">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
            ระบบได้ดำเนินการส่งเลขคำสั่งซื้อไปยัง E-mail ของท่านแล้ว เพื่อสำรองข้อมูลในกรณีเกิดข้อผิดพลาด
          </p>
          <p className="flex items-start gap-2 text-slate-600">
            <span className="font-semibold text-rose-brand">หมายเหตุ:</span>
            กรุณาบันทึกหน้าจอเพื่อเป็นหลักฐานในการสั่งซื้อ และใช้เลขคำสั่งซื้อในการชำระสินค้า
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <section className="card card-body lg:col-span-3">
          <h2 className="mb-2 flex items-center gap-2 font-semibold text-slate-900">
            <Package className="h-5 w-5 text-brand-600" /> รายการสินค้า
          </h2>
          {loading ? (
            <div className="space-y-3 py-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="skeleton h-14 w-14 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-4 w-3/4" />
                    <div className="skeleton h-3 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <Alert tone="error" title="ไม่สามารถโหลดรายละเอียดคำสั่งซื้อได้">
              {error}
            </Alert>
          ) : order ? (
            <>
              <OrderItems items={order.items} />
              <div className="mt-3 border-t border-slate-100 pt-4">
                <OrderTotals order={order} />
              </div>
            </>
          ) : (
            <PageLoader />
          )}
        </section>

        <aside className="space-y-4 lg:col-span-2">
          <BankCard amount={order?.totalPrice} compact />
          <div className="no-print space-y-2">
            {canPay && (
              <Link href={payHref} className="btn btn-primary btn-lg w-full">
                <CreditCard className="h-5 w-5" /> แจ้งชำระเงิน
              </Link>
            )}
            <Link href={`/paidstatus?code=${encodeURIComponent(code)}`} className="btn btn-secondary w-full">
              <Search className="h-4 w-4" /> ตรวจสอบสถานะคำสั่งซื้อ
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => window.print()} className="btn btn-ghost">
                <Printer className="h-4 w-4" /> พิมพ์
              </button>
              <Link href="/" className="btn btn-ghost">
                <Home className="h-4 w-4" /> หน้าแรก
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
