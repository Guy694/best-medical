"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageLoader } from "@/app/components/ui";

export default function PaidStatusRedirect() {
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    router.replace(`/paidstatus?code=${encodeURIComponent(decodeURIComponent(String(id || "")))}`);
  }, [id, router]);

  return <PageLoader label="กำลังเปิดหน้าตรวจสอบสถานะ..." />;
}
