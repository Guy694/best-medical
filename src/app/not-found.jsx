import Link from "next/link";
import { SearchX } from "lucide-react";

export const metadata = { title: "ไม่พบหน้าที่ต้องการ" };

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <SearchX className="h-8 w-8" />
      </div>
      <p className="text-sm font-semibold text-brand-600">404</p>
      <h1 className="mt-1 text-2xl font-bold text-slate-900">ไม่พบหน้าที่คุณค้นหา</h1>
      <p className="mt-2 max-w-md text-slate-500">หน้านี้อาจถูกย้ายหรือลบไปแล้ว ลองค้นหาสินค้าหรือกลับไปหน้าหลัก</p>
      <div className="mt-6 flex gap-3">
        <Link href="/" className="btn btn-primary">กลับหน้าหลัก</Link>
        <Link href="/product" className="btn btn-secondary">ดูสินค้าทั้งหมด</Link>
      </div>
    </div>
  );
}
