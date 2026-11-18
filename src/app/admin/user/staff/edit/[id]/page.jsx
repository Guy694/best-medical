"use client";

import { useParams } from "next/navigation";
import { AdminHeader } from "@/app/components/admin";
import StaffForm from "@/app/components/admin/StaffForm";

export default function EditStaffPage() {
  const { id } = useParams();
  return (
    <div className="mx-auto max-w-3xl">
      <AdminHeader title="แก้ไขข้อมูลพนักงาน" description="ปรับข้อมูลติดต่อ สิทธิ์การใช้งาน หรือรีเซ็ตรหัสผ่าน" back="/admin/user/staff" />
      <StaffForm key={id} staffId={id} />
    </div>
  );
}
