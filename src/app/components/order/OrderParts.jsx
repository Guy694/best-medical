"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, Check, Copy, CreditCard, MapPin, Package, QrCode, Truck, User } from "lucide-react";
import { StatusBadge } from "@/app/components/ui";
import { useToast } from "@/app/components/Providers";
import OrderTimeline from "@/app/components/OrderTimeline";
import { formatDate, formatDateTime, formatTHB, imgSrc, cn } from "@/app/lib/format";

export const BANK = {
  name: "ธนาคารกรุงไทย",
  branch: "สาขาเซ็นทรัลพลาซา เวสต์เกต",
  accountName: "บริษัท เบสท เมดิคอล จำกัด",
  logo: "/bank.png",
  qr: "/qrcode.jpg",
};

export const SHIPPING_LABEL = {
  ems: "จัดส่งพัสดุ",
  store: "รับสินค้าที่หน้าร้าน (สาขาพัทลุง)",
};

export function CopyButton({ text, label = "คัดลอก", className }) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("คัดลอกแล้ว");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("ไม่สามารถคัดลอกได้ กรุณาคัดลอกด้วยตนเอง");
    }
  };
  return (
    <button type="button" onClick={copy} className={cn("btn btn-secondary btn-sm no-print", className)} aria-label={`${label} ${text}`}>
      {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
      {copied ? "คัดลอกแล้ว" : label}
    </button>
  );
}

/** Bank transfer details with QR code. */
export function BankCard({ amount, compact = false }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-brand-50 to-accent-50 px-5 py-4">
        <Building2 className="h-5 w-5 text-brand-700" />
        <h3 className="font-semibold text-slate-900">ข้อมูลบัญชีสำหรับโอนเงิน</h3>
      </div>
      <div className="card-body space-y-4">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BANK.logo} alt={BANK.name} className="h-12 w-12 shrink-0 rounded-xl border border-slate-100 bg-white object-contain p-1" />
          <div className="min-w-0 text-sm">
            <p className="font-semibold text-slate-900">
              {BANK.name} <span className="font-normal text-slate-500">{BANK.branch}</span>
            </p>
            <p className="text-slate-600">
              ชื่อบัญชี: <span className="font-medium text-slate-800">{BANK.accountName}</span>
            </p>
          </div>
        </div>
        {amount != null && Number(amount) > 0 && (
          <div className="flex items-center justify-between rounded-xl bg-brand-700 px-4 py-3 text-white">
            <span className="text-sm text-brand-100">ยอดที่ต้องชำระ</span>
            <span className="text-xl font-bold">{formatTHB(amount)}</span>
          </div>
        )}
        <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center">
          <p className="mb-3 flex items-center justify-center gap-1.5 text-sm font-medium text-slate-700">
            <QrCode className="h-4 w-4 text-accent-600" /> สแกน QR Code เพื่อโอนเงิน
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={BANK.qr}
            alt="QR Code สำหรับโอนเงิน"
            className={cn("mx-auto rounded-lg border border-slate-100 bg-white object-contain", compact ? "w-40" : "w-52")}
          />
          <p className="mt-2 text-xs text-slate-500">สแกนด้วยแอปธนาคารของคุณเพื่อโอนเงิน</p>
        </div>
      </div>
    </div>
  );
}

export function OrderItems({ items = [] }) {
  return (
    <ul className="divide-y divide-slate-100">
      {items.map((it, i) => (
        <li key={`${it.product_id}-${i}`} className="flex items-center gap-3 py-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgSrc(it.image)}
            alt={it.name}
            onError={(e) => (e.currentTarget.src = "/placeholder.png")}
            className="h-14 w-14 shrink-0 rounded-xl border border-slate-100 bg-white object-contain"
          />
          <div className="min-w-0 flex-1">
            {it.product_id ? (
              <Link href={`/product/${it.product_id}`} className="line-clamp-2 text-sm font-medium text-slate-900 hover:text-brand-700">
                {it.name}
              </Link>
            ) : (
              <p className="line-clamp-2 text-sm font-medium text-slate-900">{it.name}</p>
            )}
            <p className="text-xs text-slate-500">
              {formatTHB(it.price)} × {it.quantity} ชิ้น
            </p>
          </div>
          <p className="shrink-0 text-sm font-semibold text-slate-900">{formatTHB(Number(it.price) * Number(it.quantity))}</p>
        </li>
      ))}
    </ul>
  );
}

export function OrderTotals({ order }) {
  const subtotal = (order.items || []).reduce((s, i) => s + Number(i.price) * Number(i.quantity), 0);
  const shippingCost = Number(order.shipping_cost) || 0;
  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between text-slate-600">
        <dt>ยอดรวมสินค้า</dt>
        <dd>{formatTHB(subtotal)}</dd>
      </div>
      <div className="flex justify-between text-slate-600">
        <dt>ค่าจัดส่ง ({SHIPPING_LABEL[order.shipping] || "จัดส่งพัสดุ"})</dt>
        <dd>{shippingCost > 0 ? formatTHB(shippingCost) : "ฟรี"}</dd>
      </div>
      <div className="flex items-baseline justify-between border-t border-slate-100 pt-3">
        <dt className="font-semibold text-slate-900">ยอดชำระทั้งหมด</dt>
        <dd className="text-xl font-bold text-brand-700">{formatTHB(order.totalPrice)}</dd>
      </div>
    </dl>
  );
}

function InfoRow({ label, children }) {
  return (
    <div className="flex gap-3 text-sm">
      <dt className="w-28 shrink-0 text-slate-500">{label}</dt>
      <dd className="min-w-0 flex-1 break-words text-slate-800">{children || "-"}</dd>
    </div>
  );
}

/** Full order detail used by /paidstatus and /order-status/[orderId]. */
export function OrderDetail({ order, actions }) {
  const isFull = "order_email" in order;
  const canPay = order.status === "PENDING" && !order.payment_reported;
  return (
    <div className="space-y-6">
      <div className="card card-body">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-medium tracking-wide text-slate-500 uppercase">เลขที่ใบสั่งซื้อ</p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <h2 className="font-mono text-xl font-bold text-slate-900 sm:text-2xl">{order.order_code}</h2>
              <CopyButton text={order.order_code} />
            </div>
            <p className="mt-1 text-sm text-slate-500">สั่งซื้อเมื่อ {formatDateTime(order.createdAt)}</p>
          </div>
          <div className="sm:text-right">
            <StatusBadge order={order} className="text-sm" />
            <p className="mt-2 font-semibold text-slate-900">{order.statusInfo?.text}</p>
            {order.statusInfo?.description && <p className="text-sm text-slate-500">{order.statusInfo.description}</p>}
          </div>
        </div>
        <div className="mt-6 border-t border-slate-100 pt-6">
          <OrderTimeline order={order} />
        </div>
        {(canPay || actions) && (
          <div className="no-print mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-5">
            {canPay && (
              <Link href={`/payment-notice?order=${encodeURIComponent(order.order_code)}&amount=${order.totalPrice}`} className="btn btn-primary">
                <CreditCard className="h-4 w-4" /> แจ้งชำระเงิน
              </Link>
            )}
            {actions}
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="card card-body lg:col-span-3">
          <h3 className="mb-2 flex items-center gap-2 font-semibold text-slate-900">
            <Package className="h-5 w-5 text-brand-600" /> สินค้าที่สั่งซื้อ ({order.items?.length || 0} รายการ)
          </h3>
          <OrderItems items={order.items} />
          <div className="mt-3 border-t border-slate-100 pt-4">
            <OrderTotals order={order} />
          </div>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="card card-body">
            <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-900">
              <Truck className="h-5 w-5 text-brand-600" /> การจัดส่ง
            </h3>
            <dl className="space-y-2">
              <InfoRow label="วิธีจัดส่ง">{SHIPPING_LABEL[order.shipping] || "จัดส่งพัสดุ"}</InfoRow>
              {order.shipping_company && <InfoRow label="บริษัทขนส่ง">{order.shipping_company}</InfoRow>}
              {order.tracking_number ? (
                <div className="flex items-center gap-3 text-sm">
                  <dt className="w-28 shrink-0 text-slate-500">เลขพัสดุ</dt>
                  <dd className="flex flex-1 flex-wrap items-center gap-2">
                    <span className="font-mono font-semibold text-slate-900">{order.tracking_number}</span>
                    <CopyButton text={order.tracking_number} />
                  </dd>
                </div>
              ) : (
                order.shipping !== "store" && <InfoRow label="เลขพัสดุ">ยังไม่มีเลขพัสดุ</InfoRow>
              )}
            </dl>
          </div>

          {isFull && (
            <div className="card card-body">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-slate-900">
                <User className="h-5 w-5 text-brand-600" /> ข้อมูลผู้รับ
              </h3>
              <dl className="space-y-2">
                <InfoRow label="ชื่อ-นามสกุล">{order.fullName}</InfoRow>
                <InfoRow label="อีเมล">{order.order_email}</InfoRow>
                <InfoRow label="เบอร์โทร">{order.order_phone}</InfoRow>
                <InfoRow label="ที่อยู่จัดส่ง">
                  {order.shippingAddress ? (
                    <span className="flex gap-1.5 whitespace-pre-line">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                      {order.shippingAddress}
                    </span>
                  ) : null}
                </InfoRow>
                {order.paidAtdate && (
                  <InfoRow label="วันเวลาที่โอน">
                    {formatDate(order.paidAtdate)} {order.paidAttime ? String(order.paidAttime).slice(0, 5) + " น." : ""}
                  </InfoRow>
                )}
              </dl>
              <p className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
                หมายเหตุ: หากต้องการแจ้งเปลี่ยนที่อยู่จัดส่ง กรุณา
                <Link href="/contact" className="link mx-1">
                  ติดต่อแอดมิน
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
