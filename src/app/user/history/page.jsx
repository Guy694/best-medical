"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CreditCard, Eye, History, RefreshCw, ShoppingBag, UserCog } from "lucide-react";
import { useAuth } from "@/app/components/Providers";
import { Alert, EmptyState, PageHeader, StatusBadge } from "@/app/components/ui";
import { ORDER_STATUS, api, cn, displayStatus, formatDateTime, formatTHB, imgSrc } from "@/app/lib/format";

const TABS = ["ALL", "PENDING", "VERIFYING", "PAID", "SHIPPING", "COMPLETED", "CANCELLED"];

function OrderCardSkeleton() {
  return (
    <div className="card card-body space-y-4">
      <div className="flex justify-between">
        <div className="skeleton h-5 w-48" />
        <div className="skeleton h-5 w-24" />
      </div>
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton h-14 w-14 rounded-xl" />
        ))}
      </div>
      <div className="skeleton h-9 w-full" />
    </div>
  );
}

export default function OrderHistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("ALL");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login?next=/user/history");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    let alive = true;
    setError("");
    api("/api/orders/history")
      .then((d) => alive && setOrders(d.orders || []))
      .catch((err) => {
        if (!alive) return;
        setError(err.message);
        setOrders([]);
      });
    return () => {
      alive = false;
    };
  }, [user, reloadKey]);

  const counts = useMemo(() => {
    const c = { ALL: orders?.length || 0 };
    for (const o of orders || []) {
      const s = displayStatus(o);
      c[s] = (c[s] || 0) + 1;
    }
    return c;
  }, [orders]);

  const filtered = useMemo(() => (orders || []).filter((o) => tab === "ALL" || displayStatus(o) === tab), [orders, tab]);
  const loading = authLoading || (user && orders === null);

  return (
    <div>
      <PageHeader
        title="ประวัติการสั่งซื้อ"
        subtitle={user ? `บัญชี: ${user.email}` : "รายการคำสั่งซื้อทั้งหมดของคุณ"}
        icon={History}
        breadcrumb={[{ label: "หน้าแรก", href: "/" }, { label: "ประวัติการสั่งซื้อ" }]}
      >
        <div className="flex gap-2">
          <Link href="/user/profile" className="btn btn-secondary btn-sm">
            <UserCog className="h-4 w-4" /> ข้อมูลส่วนตัว
          </Link>
          <button
            type="button"
            onClick={() => {
              setOrders(null);
              setReloadKey((k) => k + 1);
            }}
            className="btn btn-secondary btn-sm"
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4" /> รีเฟรช
          </button>
        </div>
      </PageHeader>

      <div className="container-page space-y-6 py-8">
        <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="กรองตามสถานะ">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition",
                tab === t ? "border-brand-700 bg-brand-700 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-700"
              )}
            >
              {t === "ALL" ? "ทั้งหมด" : ORDER_STATUS[t].label}
              <span className={cn("rounded-full px-1.5 text-xs", tab === t ? "bg-white/20" : "bg-slate-100")}>{counts[t] || 0}</span>
            </button>
          ))}
        </div>

        {error && <Alert tone="error">{error}</Alert>}

        {loading ? (
          <div className="grid gap-4">
            {[0, 1, 2].map((i) => (
              <OrderCardSkeleton key={i} />
            ))}
          </div>
        ) : !filtered.length ? (
          <div className="card">
            <EmptyState
              icon={ShoppingBag}
              title={orders?.length ? "ไม่มีคำสั่งซื้อในสถานะนี้" : "ยังไม่มีประวัติการสั่งซื้อ"}
              description={orders?.length ? "ลองเลือกสถานะอื่น" : "เมื่อคุณสั่งซื้อสินค้า รายการจะแสดงที่นี่"}
              action={
                orders?.length ? (
                  <button type="button" className="btn btn-secondary" onClick={() => setTab("ALL")}>
                    ดูทั้งหมด
                  </button>
                ) : (
                  <Link href="/product" className="btn btn-primary">
                    เลือกซื้อสินค้า <ArrowRight className="h-4 w-4" />
                  </Link>
                )
              }
            />
          </div>
        ) : (
          <ul className="grid gap-4">
            {filtered.map((o) => {
              const qty = o.items.reduce((s, i) => s + Number(i.quantity), 0);
              return (
                <li key={o.order_code} className="card animate-fade-in overflow-hidden transition hover:shadow-[var(--shadow-lift)]">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/60 px-5 py-3">
                    <div>
                      <p className="font-mono font-semibold text-slate-900">{o.order_code}</p>
                      <p className="text-xs text-slate-500">{formatDateTime(o.createdAt)}</p>
                    </div>
                    <StatusBadge order={o} />
                  </div>
                  <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-3">
                        {o.items.slice(0, 4).map((it, i) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={i}
                            src={imgSrc(it.image)}
                            alt={it.name}
                            title={it.name}
                            onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                            className="h-14 w-14 rounded-xl border-2 border-white bg-white object-contain shadow-sm"
                          />
                        ))}
                        {o.items.length > 4 && (
                          <span className="flex h-14 w-14 items-center justify-center rounded-xl border-2 border-white bg-slate-100 text-sm font-medium text-slate-600">
                            +{o.items.length - 4}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 text-sm">
                        <p className="line-clamp-1 font-medium text-slate-800">{o.items[0]?.name}</p>
                        <p className="text-slate-500">
                          {o.items.length} รายการ · {qty} ชิ้น
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
                      <div className="sm:text-right">
                        <p className="text-xs text-slate-500">ยอดรวม</p>
                        <p className="text-lg font-bold text-brand-700">{formatTHB(o.totalPrice)}</p>
                      </div>
                      <div className="flex gap-2">
                        {o.status === "PENDING" && !o.payment_reported && (
                          <Link
                            href={`/payment-notice?order=${encodeURIComponent(o.order_code)}&amount=${o.totalPrice}`}
                            className="btn btn-primary btn-sm"
                          >
                            <CreditCard className="h-4 w-4" /> แจ้งชำระเงิน
                          </Link>
                        )}
                        <Link href={`/order-status/${encodeURIComponent(o.order_code)}`} className="btn btn-secondary btn-sm">
                          <Eye className="h-4 w-4" /> ดูรายละเอียด
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
