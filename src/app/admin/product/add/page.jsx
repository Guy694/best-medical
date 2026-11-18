"use client";

import { AdminHeader } from "@/app/components/admin";
import ProductForm from "@/app/components/admin/ProductForm";

export default function AddProductPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <AdminHeader title="เพิ่มสินค้าใหม่" description="กรอกข้อมูลสินค้าที่ต้องการแสดงบนหน้าร้าน" back="/admin/product" />
      <ProductForm />
    </div>
  );
}
