"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2, UserCog, ShieldCheck } from "lucide-react";
import { AdminHeader, SearchInput } from "@/app/components/admin";
import { Badge, EmptyState, Alert } from "@/app/components/ui";
import { useAuth, useToast } from "@/app/components/Providers";
import { api, formatDate } from "@/app/lib/format";

export default function StaffListPage() {
  const toast = useToast();
  const { user } = useAuth();
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");
      setRows(await api("/api/admin/user/staff"));
    } catch (e) {
      setError(e.message);
      setRows([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!rows) return [];
    if (!s) return rows;
    return rows.filter((r) => [r.name, r.email, r.phone].some((v) => v?.toLowerCase().includes(s)));
  }, [rows, q]);

  const remove = async (r) => {
    const ok = await toast.confirm({
      title: "ลบพนักงาน",
      message: `ต้องการลบบัญชี "${r.name}" (${r.email}) ใช่หรือไม่? บัญชีนี้จะไม่สามารถเข้าสู่ระบบได้อีก`,
      confirmText: "ลบบัญชี",
      tone: "danger",
    });
    if (!ok) return;
    try {
      const res = await api(`/api/admin/user/staff/${r.id}`, { method: "DELETE" });
      toast.success(res.message);
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div>
      <AdminHeader
        title="พนักงานและสิทธิ์"
        description="จัดการบัญชีผู้ดูแลระบบและเจ้าหน้าที่ที่เข้าใช้งานหลังบ้าน"
        actions={
          <Link href="/admin/user/staff/add" className="btn btn-primary">
            <Plus className="h-4 w-4" /> เพิ่มพนักงาน
          </Link>
        }
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <Alert tone="info" title="ผู้ดูแลระบบ (ADMIN)">จัดการได้ทุกส่วน รวมถึงบัญชีพนักงาน</Alert>
        <Alert tone="success" title="เจ้าหน้าที่ (STAFF)">จัดการสินค้า คำสั่งซื้อ บทความ และลูกค้าได้ แต่จัดการพนักงานไม่ได้</Alert>
      </div>

      <SearchInput value={q} onChange={setQ} placeholder="ค้นหาชื่อ อีเมล หรือเบอร์โทร" className="mb-4 max-w-sm" />

      {error && <Alert tone="error" className="mb-4">{error}</Alert>}

      <div className="card overflow-hidden">
        {rows === null ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-12" />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={UserCog} title="ไม่พบพนักงาน" description={q ? "ลองค้นหาด้วยคำอื่น" : "ยังไม่มีบัญชีพนักงาน"} />
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>ชื่อ</th>
                  <th>ติดต่อ</th>
                  <th>สิทธิ์</th>
                  <th>สร้างเมื่อ</th>
                  <th className="text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700">
                          {r.name?.trim()?.[0] || "?"}
                        </span>
                        <div>
                          <p className="font-medium text-slate-900">
                            {r.name} {r.id === user?.id && <span className="text-xs text-slate-400">(คุณ)</span>}
                          </p>
                          <p className="text-xs text-slate-500">{r.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-slate-600">{r.phone || "-"}</td>
                    <td>
                      {r.role === "ADMIN" ? (
                        <Badge tone="blue"><ShieldCheck className="h-3 w-3" /> ผู้ดูแลระบบ</Badge>
                      ) : (
                        <Badge tone="emerald">เจ้าหน้าที่</Badge>
                      )}
                    </td>
                    <td className="text-slate-500">{formatDate(r.createdAt)}</td>
                    <td>
                      <div className="flex justify-end gap-1">
                        <Link href={`/admin/user/staff/edit/${r.id}`} className="btn btn-ghost btn-sm" title="แก้ไข">
                          <Pencil className="h-4 w-4" /> แก้ไข
                        </Link>
                        {r.id !== user?.id && (
                          <button onClick={() => remove(r)} className="btn btn-ghost btn-sm text-red-600 hover:bg-red-50" title="ลบ">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
