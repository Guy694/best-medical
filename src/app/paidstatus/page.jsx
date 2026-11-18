"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, PackageSearch, Search } from "lucide-react";
import { Alert, EmptyState, PageHeader, PageLoader, Spinner } from "@/app/components/ui";
import { OrderDetail } from "@/app/components/order/OrderParts";
import { api } from "@/app/lib/format";

function PaidStatusContent() {
  const sp = useSearchParams();
  const router = useRouter();
  const initialCode = (sp.get("code") || "").trim().toUpperCase();

  const [code, setCode] = useState(initialCode);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);
  const autoRan = useRef(false);

  const search = useCallback(
    async (c, em) => {
      const orderCode = String(c || "").trim().toUpperCase();
      if (!orderCode) {
        setError("กรุณากรอกเลขที่ใบสั่งซื้อ");
        return;
      }
      setLoading(true);
      setError("");
      try {
        const qs = new URLSearchParams({ order_code: orderCode });
        if (em?.trim()) qs.set("email", em.trim());
        const res = await api(`/api/order-status?${qs}`);
        setOrder(res.order);
        router.replace(`/paidstatus?code=${encodeURIComponent(orderCode)}`, { scroll: false });
      } catch (err) {
        setOrder(null);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  useEffect(() => {
    if (initialCode && !autoRan.current) {
      autoRan.current = true;
      search(initialCode, "");
    }
  }, [initialCode, search]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!loading) search(code, email);
  };

  const isFull = order && "order_email" in order;

  return (
    <div>
      <PageHeader
        title="ตรวจสอบสถานะการสั่งซื้อ"
        subtitle="กรอกเลขที่ใบสั่งซื้อเพื่อติดตามสถานะคำสั่งซื้อของคุณ"
        icon={PackageSearch}
        breadcrumb={[{ label: "หน้าแรก", href: "/" }, { label: "ตรวจสอบสถานะ" }]}
      />
      <div className="container-page space-y-6 py-8">
        <form onSubmit={onSubmit} className="card card-body no-print">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">ค้นหาใบสั่งซื้อ</h2>
          <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-start">
            <div>
              <label htmlFor="ps-code" className="label">
                เลขที่ใบสั่งซื้อ <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="ps-code"
                  className="input pl-9 font-mono uppercase"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="เช่น ORD20261118ABC123"
                  autoComplete="off"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="ps-email" className="label">
                อีเมลที่ใช้สั่งซื้อ <span className="font-normal text-slate-400">(ไม่บังคับ)</span>
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="ps-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  className="input pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <p className="help">กรอกอีเมลที่ใช้สั่งซื้อเพื่อดูรายละเอียดผู้รับและที่อยู่</p>
            </div>
            <button type="submit" className="btn btn-primary w-full md:mt-6 md:w-auto" disabled={loading}>
              {loading ? <Spinner className="h-4 w-4" /> : <Search className="h-4 w-4" />}
              {loading ? "กำลังค้นหา..." : "ตรวจสอบสถานะ"}
            </button>
          </div>
        </form>

        {error && !loading && (
          <Alert tone="error" title="ไม่พบข้อมูล">
            {error}
          </Alert>
        )}

        {loading && !order ? (
          <PageLoader label="กำลังค้นหาใบสั่งซื้อ..." />
        ) : order ? (
          <div className="animate-fade-in space-y-4">
            {!isFull && (
              <Alert tone="info" className="no-print">
                <span className="inline-flex items-start gap-2">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0" />
                  แสดงเฉพาะสถานะและรายการสินค้า หากต้องการดูข้อมูลผู้รับและที่อยู่จัดส่ง กรุณากรอกอีเมลที่ใช้สั่งซื้อแล้วค้นหาอีกครั้ง
                </span>
              </Alert>
            )}
            <OrderDetail order={order} />
          </div>
        ) : (
          !error && (
            <div className="card">
              <EmptyState
                icon={PackageSearch}
                title="ติดตามคำสั่งซื้อของคุณ"
                description="กรอกเลขที่ใบสั่งซื้อที่ได้รับทางอีเมล ระบบจะแสดงข้อมูลสถานะการสั่งซื้อ"
              />
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default function PaidStatusPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <PaidStatusContent />
    </Suspense>
  );
}
