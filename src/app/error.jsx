"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900">เกิดข้อผิดพลาดบางอย่าง</h1>
      <p className="mt-2 max-w-md text-slate-500">ขออภัยในความไม่สะดวก กรุณาลองใหม่อีกครั้ง หากยังพบปัญหาโปรดติดต่อเจ้าหน้าที่</p>
      <div className="mt-6 flex gap-3">
        <button onClick={() => reset()} className="btn btn-primary">
          <RotateCcw className="h-4 w-4" /> ลองใหม่
        </button>
        <Link href="/" className="btn btn-secondary">กลับหน้าหลัก</Link>
      </div>
    </div>
  );
}
