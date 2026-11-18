"use client";

import { AdminHeader } from "@/app/components/admin";
import StaffForm from "@/app/components/admin/StaffForm";

export default function AddStaffPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <AdminHeader title="เพิ่มพนักงาน" description="สร้างบัญชีสำหรับเข้าใช้งานระบบหลังบ้าน" back="/admin/user/staff" />
      <StaffForm />
    </div>
  );
}
