"use client";

import Link from "next/link";
import { ShoppingCart, Check, MessageCircle } from "lucide-react";
import { useState } from "react";
import { useCart, useToast } from "./Providers";
import { imgSrc, priceLabel, cn } from "@/app/lib/format";

export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-square rounded-none" />
      <div className="space-y-2 p-4">
        <div className="skeleton h-3 w-1/3" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-2/3" />
        <div className="skeleton mt-3 h-6 w-1/2" />
      </div>
    </div>
  );
}

export default function ProductCard({ product, compact = false }) {
  const cart = useCart();
  const toast = useToast();
  const [added, setAdded] = useState(false);
  const price = Number(product.price);
  const stock = Number(product.stock);
  const canBuy = price > 0 && stock > 0;

  const onAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    cart.add(product, 1);
    setAdded(true);
    toast.success(`เพิ่ม "${product.pro_name}" ลงตะกร้าแล้ว`, {
      action: { label: "ดูตะกร้าสินค้า →", onClick: () => (window.location.href = "/cart") },
    });
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className="group card flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[var(--shadow-lift)]"
    >
      <div className="relative aspect-square overflow-hidden bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc(product.imageUrl)}
          alt={product.pro_name}
          loading="lazy"
          onError={(e) => (e.currentTarget.src = "/placeholder.png")}
          className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
        />
        {stock <= 0 && (
          <span className="absolute top-3 left-3 rounded-full bg-slate-900/80 px-2.5 py-1 text-xs font-medium text-white">
            สินค้าหมด
          </span>
        )}
        {stock > 0 && stock <= 5 && (
          <span className="absolute top-3 left-3 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-medium text-white">
            เหลือ {stock} ชิ้น
          </span>
        )}
      </div>
      <div className={cn("flex flex-1 flex-col border-t border-slate-100", compact ? "p-3" : "p-4")}>
        {product.cate_name && <p className="mb-1 line-clamp-1 text-xs font-medium text-accent-700">{product.cate_name}</p>}
        <h3 className={cn("line-clamp-2 font-medium text-slate-800 group-hover:text-brand-700", compact ? "text-sm" : "text-[15px]")}>
          {product.pro_name}
        </h3>
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <p className={cn("font-semibold", price > 0 ? "text-brand-800 text-lg" : "text-sm text-slate-500")}>
            {priceLabel(price)}
          </p>
          {canBuy ? (
            <button
              onClick={onAdd}
              className={cn(
                "btn btn-icon shrink-0 transition-colors",
                added ? "bg-emerald-500 text-white" : "bg-brand-50 text-brand-700 hover:bg-brand-700 hover:text-white"
              )}
              aria-label="เพิ่มลงตะกร้า"
              title="เพิ่มลงตะกร้า"
            >
              {added ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
            </button>
          ) : (
            price <= 0 && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-accent-50 px-2 py-1 text-xs font-medium text-accent-700">
                <MessageCircle className="h-3.5 w-3.5" /> สอบถาม
              </span>
            )
          )}
        </div>
      </div>
    </Link>
  );
}
