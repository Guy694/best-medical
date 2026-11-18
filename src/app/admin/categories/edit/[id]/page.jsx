"use client";

import { useParams } from "next/navigation";
import { AdminHeader } from "@/app/components/admin";
import CategoryForm from "@/app/components/admin/CategoryForm";

export default function EditCategoryPage() {
  const { id } = useParams();
  return (
    <div className="mx-auto max-w-3xl">
      <AdminHeader title="แก้ไขหมวดหมู่" description="เปลี่ยนชื่อหรือรูปภาพของหมวดหมู่" back="/admin/categories" />
      <CategoryForm key={id} categoryId={id} />
    </div>
  );
}
