"use client";

import { useEffect, useState } from "react";
import { Users, Eye } from "lucide-react";

/** Small public visitor counter shown in the footer. */
export default function VisitorCounter() {
  const [s, setS] = useState(null);
  useEffect(() => {
    fetch("/api/stats/visitors")
      .then((r) => (r.ok ? r.json() : null))
      .then(setS)
      .catch(() => {});
  }, []);
  if (!s) return null;
  const n = (v) => Number(v || 0).toLocaleString("th-TH");
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      <span className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        ออนไลน์ {n(s.online)}
      </span>
      <span className="flex items-center gap-1.5">
        <Users className="h-3.5 w-3.5" /> วันนี้ {n(s.today)}
      </span>
      <span className="flex items-center gap-1.5">
        <Eye className="h-3.5 w-3.5" /> เข้าชมทั้งหมด {n(s.total)} ครั้ง
      </span>
    </div>
  );
}
