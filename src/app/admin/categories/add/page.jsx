"use client";

import { AdminHeader } from "@/app/components/admin";
import CategoryForm from "@/app/components/admin/CategoryForm";

export default function AddCategoryPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <AdminHeader title="เพิ่มหมวดหมู่" description="สร้างหมวดหมู่ใหม่สำหรับจัดกลุ่มสินค้า" back="/admin/categories" />
      <CategoryForm />
    </div>
  );
}
