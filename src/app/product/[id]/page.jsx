"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Copy,
  MessageCircle,
  PackageX,
  Phone,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Store,
  Truck,
  X,
  ZoomIn,
} from "lucide-react";
import ProductCard, { ProductCardSkeleton } from "@/app/components/ProductCard";
import { Alert, Badge, Breadcrumb, EmptyState, QuantityInput } from "@/app/components/ui";
import { useCart, useToast } from "@/app/components/Providers";
import { api, cn, formatTHB, imgSrc, priceLabel } from "@/app/lib/format";

const LINE_URL = "https://line.me/ti/p/bestmedical";
const TEL = "074606389";
const TEL_LABEL = "074-606-389";

/** Turn the plain-text description into headings / list items / paragraphs (keeps every line). */
function parseDescription(text) {
  const lines = String(text || "")
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const blocks = [];
  lines.forEach((line, i) => {
    const m = line.match(/^(?:(\d+)\s*[.)]|[-•*●▪✓✔])\s*(.*)$/);
    if (m) {
      const last = blocks[blocks.length - 1];
      const item = { num: m[1] || null, text: m[2] || line };
      if (last?.type === "list") last.items.push(item);
      else blocks.push({ type: "list", items: [item] });
      return;
    }
    const next = lines[i + 1] || "";
    const isHeading = line.length <= 40 && !/[.。]$/.test(line) && /^(?:\d+\s*[.)]|[-•*●▪✓✔])/.test(next);
    blocks.push({ type: isHeading || /:$/.test(line) ? "heading" : "paragraph", text: line.replace(/:$/, "") });
  });
  return blocks;
}

function stockInfo(stock) {
  if (stock <= 0) return { label: "สินค้าหมด", tone: "red", icon: PackageX };
  if (stock <= 5) return { label: `เหลือน้อย (${stock} ชิ้น)`, tone: "amber", icon: Clock };
  return { label: "มีสินค้า", tone: "emerald", icon: CheckCircle2 };
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const cart = useCart();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | notfound | error
  const [error, setError] = useState("");
  const [related, setRelated] = useState(null);
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState(false);
  const [tab, setTab] = useState("detail");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setProduct(null);
    setRelated(null);
    setQty(1);
    setTab("detail");
    api(`/api/product/${encodeURIComponent(id)}`)
      .then((p) => {
        if (cancelled) return;
        setProduct(p);
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
        setStatus(err.status === 404 ? "notfound" : "error");
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!product) return;
    document.title = `${product.pro_name} | Best Medical`;
    if (!product.categoryId) {
      setRelated([]);
      return;
    }
    api(`/api/product?category=${product.categoryId}&exclude=${product.id}&limit=8`)
      .then((d) => setRelated(Array.isArray(d) ? d : []))
      .catch(() => setRelated([]));
  }, [product]);

  useEffect(() => {
    if (status === "notfound") document.title = "ไม่พบสินค้า | Best Medical";
  }, [status]);

  const closeZoom = useCallback(() => setZoom(false), []);
  useEffect(() => {
    if (!zoom) return;
    const onKey = (e) => e.key === "Escape" && closeZoom();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [zoom, closeZoom]);

  const blocks = useMemo(() => parseDescription(product?.description), [product]);

  if (status === "loading") return <DetailSkeleton />;

  if (status === "notfound" || status === "error") {
    return (
      <div className="container-page py-12">
        <div className="card">
          <EmptyState
            icon={PackageX}
            title={status === "notfound" ? "ไม่พบสินค้าที่คุณต้องการ" : "โหลดข้อมูลสินค้าไม่สำเร็จ"}
            description={
              status === "notfound"
                ? "สินค้านี้อาจถูกนำออกจากหน้าร้านแล้ว หรือลิงก์ไม่ถูกต้อง ลองค้นหาสินค้าอื่นจากหน้ารวมสินค้า"
                : error
            }
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <Link href="/product" className="btn btn-primary">
                  ดูสินค้าทั้งหมด <ArrowRight className="h-4 w-4" />
                </Link>
                {status === "error" ? (
                  <button type="button" className="btn btn-secondary" onClick={() => window.location.reload()}>
                    ลองอีกครั้ง
                  </button>
                ) : (
                  <Link href="/contact" className="btn btn-secondary">
                    ติดต่อสอบถาม
                  </Link>
                )}
              </div>
            }
          />
        </div>
      </div>
    );
  }

  const price = Number(product.price);
  const stock = Number(product.stock) || 0;
  const delivery = Number(product.delivery) || 0;
  const warranty = Number(product.warranty) || 0;
  const askPrice = price <= 0;
  const inCart = cart.items.find((i) => i.id === Number(product.id))?.quantity || 0;
  const remaining = Math.max(0, stock - inCart);
  const canAdd = !askPrice && remaining > 0;
  const sInfo = stockInfo(stock);
  const SIcon = sInfo.icon;
  const size = String(product.pro_size || "").trim();
  const image = imgSrc(product.imageUrl);

  const addToCart = () => {
    if (!canAdd) return false;
    const n = Math.min(qty, remaining);
    cart.add(product, n);
    setQty(1);
    return n;
  };

  const onAdd = () => {
    const n = addToCart();
    if (!n) return;
    toast.success(`เพิ่ม "${product.pro_name}" จำนวน ${n} ชิ้นลงตะกร้าแล้ว`, {
      action: { label: "ดูตะกร้าสินค้า →", onClick: () => router.push("/cart") },
    });
  };

  const onBuyNow = () => {
    if (addToCart()) router.push("/cart");
  };

  const onShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
        await navigator.share({ title: product.pro_name, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      toast.success("คัดลอกลิงก์สินค้าแล้ว");
    } catch (err) {
      if (err?.name !== "AbortError") toast.error("ไม่สามารถคัดลอกลิงก์ได้");
    }
  };

  const tabs = [
    { key: "detail", label: "รายละเอียดสินค้า" },
    ...(size ? [{ key: "size", label: "ขนาด/รุ่น" }] : []),
  ];

  return (
    <div className="pb-24 lg:pb-0">
      <div className="container-page py-6 sm:py-8">
        <Breadcrumb
          items={[
            { label: "หน้าหลัก", href: "/" },
            product.categoryId
              ? { label: product.cate_name || "หมวดหมู่สินค้า", href: `/category/${product.categoryId}` }
              : { label: "สินค้าทั้งหมด", href: "/product" },
            { label: product.pro_name },
          ]}
        />

        <div className="mt-5 grid gap-6 lg:grid-cols-2 lg:gap-10">
          {/* Image */}
          <div>
            <button
              type="button"
              onClick={() => setZoom(true)}
              className="group card relative block aspect-square w-full cursor-zoom-in overflow-hidden bg-white"
              aria-label="ขยายรูปสินค้า"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt={product.pro_name}
                onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                className="h-full w-full object-contain p-6 transition-transform duration-300 group-hover:scale-105 sm:p-10"
              />
              <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-700 shadow ring-1 ring-slate-200 backdrop-blur">
                <ZoomIn className="h-4 w-4" /> คลิกเพื่อขยาย
              </span>
              {stock <= 0 && !askPrice && (
                <span className="absolute top-4 left-4 rounded-full bg-slate-900/80 px-3 py-1 text-sm font-medium text-white">สินค้าหมด</span>
              )}
            </button>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2">
              {product.cate_name && (
                <Link href={product.categoryId ? `/category/${product.categoryId}` : "/product"}>
                  <Badge tone="sky" className="hover:opacity-80">
                    {product.cate_name}
                  </Badge>
                </Link>
              )}
              {!askPrice && (
                <Badge tone={sInfo.tone}>
                  <SIcon className="h-3.5 w-3.5" /> {sInfo.label}
                </Badge>
              )}
            </div>
            <h1 className="mt-3 text-2xl leading-snug font-bold text-slate-900 sm:text-3xl">{product.pro_name}</h1>
            {product.codename && (
              <p className="mt-2 text-sm text-slate-500">
                รหัสสินค้า: <span className="font-medium text-slate-700">{product.codename}</span>
              </p>
            )}

            <div className="mt-5 rounded-2xl bg-gradient-to-br from-brand-50 to-accent-50 p-5 ring-1 ring-brand-100">
              {askPrice ? (
                <>
                  <p className="text-2xl font-bold text-brand-800">สอบถามราคา</p>
                  <p className="mt-1 text-sm text-slate-600">ราคาขึ้นอยู่กับรุ่นและจำนวนสั่งซื้อ กรุณาติดต่อฝ่ายขายเพื่อรับใบเสนอราคา</p>
                </>
              ) : (
                <>
                  <p className="text-3xl font-bold text-brand-800">{formatTHB(price)}</p>
                  <p className="mt-1 text-xs text-slate-500">ราคาต่อชิ้น · ชำระผ่านการโอนเงินเข้าบัญชีบริษัท</p>
                </>
              )}
            </div>

            <dl className="mt-5 grid gap-3 sm:grid-cols-2">
              <InfoRow icon={Truck} label="ค่าจัดส่ง (EMS)">
                {delivery > 0 ? `${formatTHB(delivery)} / ชิ้น` : askPrice ? "สอบถามเพิ่มเติม" : "ฟรีค่าจัดส่ง"}
              </InfoRow>
              <InfoRow icon={Store} label="รับเองที่ร้าน">
                ไม่มีค่าใช้จ่าย
              </InfoRow>
              {warranty > 0 && (
                <InfoRow icon={ShieldCheck} label="การรับประกัน">
                  {warranty >= 12 && warranty % 12 === 0 ? `${warranty / 12} ปี` : `${warranty} เดือน`}
                </InfoRow>
              )}
              {size && (
                <InfoRow icon={Ruler} label="ขนาด/รุ่น">
                  <span className="line-clamp-1">{size.split("\n")[0]}</span>
                </InfoRow>
              )}
            </dl>

            {askPrice ? (
              <div className="mt-6">
                <p className="mb-3 text-sm font-medium text-slate-700">ติดต่อสอบถามราคาได้ทุกช่องทาง</p>
                <div className="grid gap-2 sm:grid-cols-3">
                  <a href={LINE_URL} target="_blank" rel="noopener noreferrer" className="btn btn-lg bg-[#06C755] text-white hover:bg-[#05b14c]">
                    <MessageCircle className="h-5 w-5" /> LINE
                  </a>
                  <a href={`tel:${TEL}`} className="btn btn-lg btn-accent">
                    <Phone className="h-5 w-5" /> {TEL_LABEL}
                  </a>
                  <Link href="/contact" className="btn btn-lg btn-secondary">
                    ส่งข้อความ
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {stock > 0 ? (
                  <>
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="text-sm font-medium text-slate-700" id="qty-label">
                        จำนวน
                      </span>
                      <div aria-labelledby="qty-label">
                        <QuantityInput value={Math.min(qty, Math.max(1, remaining))} onChange={setQty} min={1} max={Math.max(1, remaining)} />
                      </div>
                      <span className="text-sm text-slate-500">คงเหลือ {stock.toLocaleString("th-TH")} ชิ้น</span>
                    </div>
                    {inCart > 0 && (
                      <p className="text-sm text-slate-500">
                        มีสินค้านี้ในตะกร้าแล้ว {inCart} ชิ้น
                        {remaining <= 0 && " (ครบตามจำนวนคงเหลือแล้ว)"}
                      </p>
                    )}
                    <div className="grid gap-2 sm:grid-cols-2">
                      <button type="button" className="btn btn-lg btn-secondary" onClick={onAdd} disabled={!canAdd}>
                        <ShoppingCart className="h-5 w-5" /> เพิ่มลงตะกร้า
                      </button>
                      <button type="button" className="btn btn-lg btn-primary" onClick={onBuyNow} disabled={!canAdd}>
                        <ShoppingBag className="h-5 w-5" /> ซื้อทันที
                      </button>
                    </div>
                  </>
                ) : (
                  <Alert tone="warning" title="สินค้าหมดชั่วคราว">
                    กรุณาติดต่อเจ้าหน้าที่เพื่อสอบถามวันที่สินค้าเข้า โทร {TEL_LABEL} หรือ{" "}
                    <a href={LINE_URL} target="_blank" rel="noopener noreferrer" className="link">
                      แชทผ่าน LINE
                    </a>
                  </Alert>
                )}
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5 text-sm">
              <button type="button" onClick={onShare} className="btn btn-ghost btn-sm">
                <Copy className="h-4 w-4" /> คัดลอกลิงก์สินค้า
              </button>
              {!askPrice && (
                <a href={LINE_URL} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                  <MessageCircle className="h-4 w-4" /> สอบถามผ่าน LINE
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <section className="card mt-10 overflow-hidden">
          <div role="tablist" aria-label="ข้อมูลสินค้า" className="scrollbar-none flex overflow-x-auto border-b border-slate-100 px-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                id={`tab-${t.key}`}
                aria-selected={tab === t.key}
                aria-controls={`panel-${t.key}`}
                onClick={() => setTab(t.key)}
                className={cn(
                  "-mb-px shrink-0 border-b-2 px-4 py-3.5 text-sm font-medium transition-colors",
                  tab === t.key ? "border-brand-700 text-brand-800" : "border-transparent text-slate-500 hover:text-slate-800"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="card-body">
            {tab === "detail" ? (
              blocks.length ? (
                <div className="max-w-3xl space-y-3 leading-relaxed text-slate-700">
                  {blocks.map((b, i) =>
                    b.type === "heading" ? (
                      <h3 key={i} className="pt-2 font-semibold text-slate-900 first:pt-0">
                        {b.text}
                      </h3>
                    ) : b.type === "list" ? (
                      <ul key={i} className="space-y-2">
                        {b.items.map((it, j) => (
                          <li key={j} className="flex gap-3">
                            <span className="mt-0.5 flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-accent-50 px-1.5 text-xs font-semibold text-accent-700">
                              {it.num || <CheckCircle2 className="h-3.5 w-3.5" />}
                            </span>
                            <span>{it.text}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p key={i}>{b.text}</p>
                    )
                  )}
                </div>
              ) : (
                <p className="text-sm text-slate-500">ยังไม่มีรายละเอียดสินค้า สามารถสอบถามข้อมูลเพิ่มเติมได้ที่เจ้าหน้าที่</p>
              )
            ) : (
              <p className="max-w-3xl leading-relaxed whitespace-pre-line text-slate-700">{size}</p>
            )}
          </div>
        </section>

        {/* Related */}
        {(related === null || related.length > 0) && (
          <section className="mt-12">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h2 className="section-title">สินค้าในหมวดเดียวกัน</h2>
                {product.cate_name && <p className="mt-1 text-sm text-slate-500">{product.cate_name}</p>}
              </div>
              {product.categoryId && (
                <Link href={`/category/${product.categoryId}`} className="link inline-flex items-center gap-1 text-sm">
                  ดูทั้งหมด <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
            <div className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:px-0 lg:grid-cols-4">
              {(related === null ? Array.from({ length: 4 }) : related).map((p, i) => (
                <div key={p?.id ?? i} className="w-[46%] shrink-0 snap-start sm:w-auto">
                  {p ? <ProductCard product={p} compact /> : <ProductCardSkeleton />}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile sticky bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 py-3 pr-24 pl-4 shadow-[0_-4px_20px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="line-clamp-1 text-xs text-slate-500">{product.pro_name}</p>
            <p className={cn("font-bold", askPrice ? "text-base text-slate-700" : "text-lg text-brand-800")}>{priceLabel(price)}</p>
          </div>
          {askPrice ? (
            <a href={LINE_URL} target="_blank" rel="noopener noreferrer" className="btn bg-[#06C755] text-white hover:bg-[#05b14c]">
              <MessageCircle className="h-4 w-4" /> สอบถาม
            </a>
          ) : (
            <button type="button" className="btn btn-primary" onClick={onAdd} disabled={!canAdd}>
              <ShoppingCart className="h-4 w-4" /> {stock <= 0 ? "สินค้าหมด" : "เพิ่มลงตะกร้า"}
            </button>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {zoom && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={product.pro_name}
          className="fixed inset-0 z-[95] flex animate-fade-in items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm"
          onClick={closeZoom}
        >
          <button
            type="button"
            onClick={closeZoom}
            autoFocus
            className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="ปิด (Esc)"
          >
            <X className="h-6 w-6" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={product.pro_name}
            onClick={(e) => e.stopPropagation()}
            onError={(e) => (e.currentTarget.src = "/placeholder.png")}
            className="max-h-[85vh] max-w-full rounded-2xl bg-white object-contain p-4"
          />
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/60">คลิกด้านนอกหรือกด Esc เพื่อปิด</p>
        </div>
      )}
    </div>
  );
}

function InfoRow({ icon: Icon, label, children }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <dt className="text-xs text-slate-500">{label}</dt>
        <dd className="text-sm font-medium text-slate-800">{children}</dd>
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="container-page py-6 sm:py-8" aria-busy="true" aria-label="กำลังโหลดสินค้า">
      <div className="skeleton h-4 w-64" />
      <div className="mt-5 grid gap-6 lg:grid-cols-2 lg:gap-10">
        <div className="skeleton aspect-square rounded-2xl" />
        <div className="space-y-4">
          <div className="skeleton h-5 w-32" />
          <div className="skeleton h-8 w-full" />
          <div className="skeleton h-8 w-3/4" />
          <div className="skeleton h-4 w-40" />
          <div className="skeleton h-24 w-full rounded-2xl" />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="skeleton h-16 rounded-xl" />
            <div className="skeleton h-16 rounded-xl" />
          </div>
          <div className="skeleton h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
