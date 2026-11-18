"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, LogIn, Printer, ReceiptText, RefreshCw, Search } from "lucide-react";
import { useAuth } from "@/app/components/Providers";
import { Alert, EmptyState, PageHeader, PageLoader } from "@/app/components/ui";
import { OrderDetail } from "@/app/components/order/OrderParts";
import { api } from "@/app/lib/format";

export default function OrderStatusPage() {
  const { orderId } = useParams();
  const code = decodeURIComponent(String(orderId || ""));
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setOrder(await api(`/api/orders/${encodeURIComponent(code)}`));
    } catch (err) {
      setOrder(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [code]);

  // re-fetch once auth is known so owners get the full view
  useEffect(() => {
    if (!authLoading && code) load();
  }, [authLoading, user?.id, code, load]);

  const isFull = order && "order_email" in order;

  return (
    <div>
      <PageHeader
        title="รายละเอียดคำสั่งซื้อ"
        subtitle={code}
        icon={ReceiptText}
        breadcrumb={[
          { label: "หน้าแรก", href: "/" },
          ...(user ? [{ label: "ประวัติการสั่งซื้อ", href: "/user/history" }] : []),
          { label: code },
        ]}
      >
        <div className="no-print flex gap-2">
          <button type="button" onClick={load} className="btn btn-secondary btn-sm" disabled={loading}>
            <RefreshCw className={loading ? "h-4 w-4 animate-spin" : "h-4 w-4"} /> รีเฟรช
          </button>
          <button type="button" onClick={() => window.print()} className="btn btn-secondary btn-sm">
            <Printer className="h-4 w-4" /> พิมพ์
          </button>
        </div>
      </PageHeader>

      <div className="container-page space-y-6 py-8">
        {loading && !order ? (
          <PageLoader label="กำลังโหลดคำสั่งซื้อ..." />
        ) : error ? (
          <div className="card">
            <EmptyState
              icon={ReceiptText}
              title="ไม่พบคำสั่งซื้อ"
              description={error}
              action={
                <Link href="/paidstatus" className="btn btn-primary">
                  <Search className="h-4 w-4" /> ค้นหาคำสั่งซื้อ
                </Link>
              }
            />
          </div>
        ) : order ? (
          <>
            {!isFull && (
              <Alert tone="info" title="แสดงข้อมูลบางส่วน" className="no-print">
                <p>ข้อมูลผู้รับและที่อยู่จัดส่งจะแสดงเฉพาะเจ้าของคำสั่งซื้อ กรุณาเข้าสู่ระบบด้วยบัญชีที่ใช้สั่งซื้อ หรือค้นหาด้วยอีเมลที่ใช้สั่งซื้อ</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {!user && (
                    <Link href={`/login?next=${encodeURIComponent(`/order-status/${code}`)}`} className="btn btn-primary btn-sm">
                      <LogIn className="h-4 w-4" /> เข้าสู่ระบบ
                    </Link>
                  )}
                  <Link href={`/paidstatus?code=${encodeURIComponent(code)}`} className="btn btn-secondary btn-sm">
                    <Search className="h-4 w-4" /> ค้นหาด้วยอีเมล
                  </Link>
                </div>
              </Alert>
            )}
            <OrderDetail
              order={order}
              actions={
                user && (
                  <Link href="/user/history" className="btn btn-ghost">
                    <ArrowLeft className="h-4 w-4" /> กลับไปประวัติการสั่งซื้อ
                  </Link>
                )
              }
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
