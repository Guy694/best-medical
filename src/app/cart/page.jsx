"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Mail, ShieldCheck, ShoppingCart, Store, Trash2, Truck } from "lucide-react";
import { useAuth, useCart, useToast } from "@/app/components/Providers";
import { Alert, EmptyState, PageHeader, PageLoader, QuantityInput, Spinner } from "@/app/components/ui";
import { api, cn, formatTHB, imgSrc } from "@/app/lib/format";

export default function CartPage() {
  const cart = useCart();
  const { user } = useAuth();
  const toast = useToast();
  const router = useRouter();

  const [shipping, setShipping] = useState("ems");
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [problemId, setProblemId] = useState(null);

  useEffect(() => {
    if (user?.email && !emailTouched) setEmail(user.email);
  }, [user, emailTouched]);

  if (!cart.ready) return <PageLoader label="กำลังโหลดตะกร้าสินค้า..." />;

  const shippingCost = shipping === "store" ? 0 : cart.delivery;
  const total = cart.subtotal + shippingCost;

  const removeItem = (item) => {
    cart.remove(item.id);
    if (problemId === item.id) setProblemId(null);
    toast.success(`ลบ "${item.name}" ออกจากตะกร้าแล้ว`, {
      action: { label: "เลิกทำ", onClick: () => cart.add(item, item.quantity) },
      duration: 6000,
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (submitting || !cart.items.length) return;
    setError("");
    setProblemId(null);
    setSubmitting(true);
    try {
      const res = await api("/api/cart/sendOrder", {
        method: "POST",
        body: {
          items: cart.items.map((i) => ({ id: i.id, quantity: i.quantity })),
          shipping,
          email: email.trim(),
        },
      });
      cart.clear();
      toast.success("สั่งซื้อสำเร็จ");
      router.push(`/orderNumber/${encodeURIComponent(res.orderId)}`);
    } catch (err) {
      setError(err.message);
      const pid = Number(err.data?.productId);
      if (pid) {
        setProblemId(pid);
        const stock = err.data?.stock;
        if (stock != null && Number(stock) > 0 && cart.replace) {
          cart.replace(cart.items.map((i) => (i.id === pid ? { ...i, stock: Number(stock), quantity: Math.min(i.quantity, Number(stock)) } : i)));
          toast.info("ปรับจำนวนสินค้าตามที่มีในสต็อกแล้ว กรุณาตรวจสอบและสั่งซื้ออีกครั้ง");
        }
      }
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="ตะกร้าสินค้า"
        subtitle="จัดการสินค้าในตะกร้าของคุณ"
        icon={ShoppingCart}
        breadcrumb={[{ label: "หน้าแรก", href: "/" }, { label: "ตะกร้าสินค้า" }]}
      />

      <div className="container-page py-8">
        {!cart.items.length ? (
          <div className="card">
            <EmptyState
              icon={ShoppingCart}
              title="ตะกร้าสินค้าว่างเปล่า"
              description="ยังไม่มีสินค้าในตะกร้า เลือกชมสินค้าอุปกรณ์การแพทย์คุณภาพของเราได้เลย"
              action={
                <Link href="/product" className="btn btn-primary">
                  เลือกซื้อสินค้า <ArrowRight className="h-4 w-4" />
                </Link>
              }
            />
          </div>
        ) : (
          <form onSubmit={submit} className="grid gap-6 lg:grid-cols-3 lg:items-start">
            {/* Items */}
            <section className="space-y-4 lg:col-span-2" aria-label="รายการสินค้าในตะกร้า">
              <div className="flex items-center justify-between">
                <h2 className="section-title">สินค้าในตะกร้า ({cart.count} ชิ้น)</h2>
              </div>
              <ul className="space-y-3">
                {cart.items.map((item) => {
                  const max = item.stock != null && item.stock > 0 ? item.stock : 999;
                  const problem = problemId === item.id;
                  return (
                    <li
                      key={item.id}
                      className={cn(
                        "card flex animate-fade-in gap-4 p-4 transition",
                        problem && "border-red-300 ring-2 ring-red-200"
                      )}
                    >
                      <Link href={`/product/${item.id}`} className="shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imgSrc(item.image)}
                          alt={item.name}
                          onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                          className="h-20 w-20 rounded-xl border border-slate-100 bg-white object-contain sm:h-24 sm:w-24"
                        />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="min-w-0 flex-1">
                          <Link href={`/product/${item.id}`} className="line-clamp-2 font-medium text-slate-900 hover:text-brand-700">
                            {item.name}
                          </Link>
                          <p className="mt-1 text-sm text-slate-500">ราคาต่อชิ้น {formatTHB(item.price)}</p>
                          {item.delivery > 0 && <p className="text-xs text-slate-400">ค่าจัดส่ง {formatTHB(item.delivery)} / ชิ้น</p>}
                          {item.stock != null && item.stock > 0 && item.stock <= 5 && (
                            <p className="mt-1 text-xs font-medium text-amber-600">เหลือเพียง {item.stock} ชิ้น</p>
                          )}
                          {problem && <p className="mt-1 text-xs font-medium text-red-600">กรุณาตรวจสอบสินค้ารายการนี้</p>}
                        </div>
                        <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                          <QuantityInput size="sm" value={item.quantity} min={1} max={max} onChange={(q) => cart.update(item.id, q)} />
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-brand-700">{formatTHB(item.price * item.quantity)}</p>
                            <button
                              type="button"
                              onClick={() => removeItem(item)}
                              className="btn btn-ghost btn-icon btn-sm text-slate-400 hover:text-red-600"
                              aria-label={`ลบ ${item.name} ออกจากตะกร้า`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <Link href="/product" className="btn btn-ghost">
                <ArrowLeft className="h-4 w-4" /> เลือกซื้อสินค้าต่อ
              </Link>
            </section>

            {/* Summary */}
            <aside className="card card-body space-y-5 lg:sticky lg:top-24" aria-label="สรุปคำสั่งซื้อ">
              <h2 className="text-lg font-semibold text-slate-900">สรุปคำสั่งซื้อ</h2>

              <fieldset className="space-y-2">
                <legend className="label">วิธีการจัดส่ง</legend>
                {[
                  {
                    id: "ems",
                    icon: Truck,
                    label: "จัดส่งพัสดุ",
                    desc: "จัดส่งถึงบ้านทั่วประเทศ",
                    cost: cart.delivery > 0 ? formatTHB(cart.delivery) : "ฟรี",
                  },
                  { id: "store", icon: Store, label: "รับสินค้าที่หน้าร้าน (สาขาพัทลุง)", desc: "ไม่มีค่าจัดส่ง", cost: "ฟรี" },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition",
                      shipping === opt.id ? "border-brand-600 bg-brand-50 ring-1 ring-brand-600" : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      value={opt.id}
                      checked={shipping === opt.id}
                      onChange={() => setShipping(opt.id)}
                      className="h-4 w-4 accent-brand-700"
                    />
                    <opt.icon className={cn("h-5 w-5 shrink-0", shipping === opt.id ? "text-brand-700" : "text-slate-400")} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-slate-900">{opt.label}</span>
                      <span className="block text-xs text-slate-500">{opt.desc}</span>
                    </span>
                    <span className={cn("text-sm font-semibold", opt.cost === "ฟรี" ? "text-accent-700" : "text-slate-900")}>{opt.cost}</span>
                  </label>
                ))}
              </fieldset>

              <dl className="space-y-2 border-t border-slate-100 pt-4 text-sm">
                <div className="flex justify-between text-slate-600">
                  <dt>ยอดรวมสินค้า ({cart.count} ชิ้น)</dt>
                  <dd>{formatTHB(cart.subtotal)}</dd>
                </div>
                <div className="flex justify-between text-slate-600">
                  <dt>ค่าจัดส่ง</dt>
                  <dd>{shippingCost > 0 ? formatTHB(shippingCost) : "ฟรี"}</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-slate-100 pt-3">
                  <dt className="font-semibold text-slate-900">ยอดรวมทั้งหมด</dt>
                  <dd className="text-2xl font-bold text-brand-700">{formatTHB(total)}</dd>
                </div>
              </dl>

              <div>
                <label htmlFor="order-email" className="label">
                  อีเมลสำหรับรับเลขคำสั่งซื้อ <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="order-email"
                    type="email"
                    required
                    autoComplete="email"
                    inputMode="email"
                    className="input pl-9"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmailTouched(true);
                      setEmail(e.target.value);
                    }}
                  />
                </div>
                <p className="help">ระบบจะส่งเลขคำสั่งซื้อและรายละเอียดไปที่อีเมลนี้ ใช้สำหรับแจ้งชำระเงินและติดตามสถานะ</p>
              </div>

              {error && <Alert tone="error">{error}</Alert>}

              <button type="submit" className="btn btn-primary btn-lg w-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <Spinner className="h-5 w-5" /> กำลังดำเนินการ...
                  </>
                ) : (
                  <>
                    ยืนยันการสั่งซื้อ <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
              <p className="flex items-start gap-2 text-xs text-slate-500">
                <ShieldCheck className="h-4 w-4 shrink-0 text-accent-600" />
                ราคาและค่าจัดส่งจะได้รับการยืนยันจากระบบอีกครั้งเมื่อสั่งซื้อ
              </p>
            </aside>
          </form>
        )}
      </div>
    </div>
  );
}
