"use client";

import { useParams } from "next/navigation";
import { AdminHeader } from "@/app/components/admin";
import ProductForm from "@/app/components/admin/ProductForm";

export default function EditProductPage() {
  const { id } = useParams();
  return (
    <div className="mx-auto max-w-6xl">
      <AdminHeader
        title="แก้ไขสินค้า"
        description={`รหัสสินค้าในระบบ #${id}`}
        back="/admin/product"
        actions={
          <a href={`/product/${id}`} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
            ดูหน้าสินค้า
          </a>
        }
      />
      <ProductForm key={id} productId={id} />
    </div>
  );
}
