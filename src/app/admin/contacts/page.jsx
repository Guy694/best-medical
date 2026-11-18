"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { MessageSquare, RefreshCw, Mail, Phone, Trash2, MailOpen, Inbox, Reply, CalendarClock } from "lucide-react";
import { AdminHeader, FilterTabs, Pager, SearchInput, paginate } from "@/app/components/admin";
import { Alert, Badge, EmptyState, Modal, Spinner } from "@/app/components/ui";
import { useToast } from "@/app/components/Providers";
import { api, cn, formatDateTime } from "@/app/lib/format";

const PAGE_SIZE = 20;
const TOPICS = {
  general: { label: "สอบถามทั่วไป", tone: "blue" },
  support: { label: "ขอความช่วยเหลือ", tone: "sky" },
  business: { label: "ติดต่อเรื่องธุรกิจ", tone: "violet" },
  complaint: { label: "ร้องเรียน", tone: "red" },
  suggestion: { label: "เสนอแนะ", tone: "emerald" },
};
const topic = (a) => TOPICS[a] || { label: a || "ไม่ระบุหัวข้อ", tone: "slate" };
const isUnread = (c) => !Number(c.is_read);

function useIsDesktop() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(min-width: 1024px)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => true
  );
}

function MessageDetail({ msg, deleting, onDelete, onToggleRead }) {
  const t = topic(msg.article);
  const subject = `ตอบกลับ: ${t.label} - Best Medical`;
  const body = `เรียน คุณ${msg.name}\n\n\n\n---- ข้อความของท่าน (${formatDateTime(msg.createdAt)}) ----\n${msg.detail || ""}`;
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 font-semibold text-brand-700">
            {(msg.name || "?").trim().charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900">{msg.name}</p>
            <p className="flex items-center gap-1 text-xs text-slate-500">
              <CalendarClock className="h-3.5 w-3.5" /> {formatDateTime(msg.createdAt)}
            </p>
          </div>
        </div>
        <Badge tone={t.tone}>{t.label}</Badge>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <a href={`mailto:${msg.email}`} className="flex items-center gap-1.5 text-slate-600 hover:text-brand-700">
          <Mail className="h-4 w-4 text-slate-400" /> <span className="break-all">{msg.email}</span>
        </a>
        {msg.phone && (
          <a href={`tel:${msg.phone}`} className="flex items-center gap-1.5 text-slate-600 hover:text-brand-700">
            <Phone className="h-4 w-4 text-slate-400" /> {msg.phone}
          </a>
        )}
      </div>

      <div className="rounded-2xl bg-slate-50 p-5 text-sm leading-relaxed whitespace-pre-line text-slate-800">{msg.detail || "-"}</div>

      <div className="flex flex-wrap gap-2">
        <a
          href={`mailto:${msg.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}
          className="btn btn-primary btn-sm"
        >
          <Reply className="h-4 w-4" /> ตอบกลับทางอีเมล
        </a>
        {msg.phone && (
          <a href={`tel:${msg.phone}`} className="btn btn-accent btn-sm">
            <Phone className="h-4 w-4" /> โทรหาลูกค้า
          </a>
        )}
        <button className="btn btn-secondary btn-sm" onClick={() => onToggleRead(msg, !isUnread(msg) ? 0 : 1)}>
          <Mail className="h-4 w-4" /> {isUnread(msg) ? "ทำเครื่องหมายว่าอ่านแล้ว" : "ทำเครื่องหมายว่ายังไม่อ่าน"}
        </button>
        <button className="btn btn-danger-soft btn-sm sm:ml-auto" onClick={() => onDelete(msg)} disabled={deleting}>
          {deleting ? <Spinner className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />} ลบข้อความ
        </button>
      </div>
    </div>
  );
}

export default function AdminContactsPage() {
  const toast = useToast();
  const isDesktop = useIsDesktop();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await api("/api/admin/contacts");
      setContacts(Array.isArray(data?.contacts) ? data.contacts : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const searched = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter((c) =>
      [c.name, c.email, c.phone, c.detail, topic(c.article).label].some((v) => String(v || "").toLowerCase().includes(q))
    );
  }, [contacts, search]);
  const unreadCount = useMemo(() => searched.filter(isUnread).length, [searched]);
  const list = filter === "unread" ? searched.filter(isUnread) : searched;
  const pageCount = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const { rows } = paginate(list, safePage, PAGE_SIZE);
  const selected = contacts.find((c) => c.id === selectedId) || null;

  const setRead = async (msg, value) => {
    setContacts((cs) => cs.map((c) => (c.id === msg.id ? { ...c, is_read: value } : c)));
    try {
      await api("/api/admin/contacts", { method: "PATCH", body: { id: msg.id, is_read: !!value } });
    } catch (err) {
      setContacts((cs) => cs.map((c) => (c.id === msg.id ? { ...c, is_read: msg.is_read } : c)));
      toast.error(err.message);
    }
  };

  const open = (msg) => {
    setSelectedId(msg.id);
    if (isUnread(msg)) setRead(msg, 1);
  };

  const remove = async (msg) => {
    const ok = await toast.confirm({
      title: "ลบข้อความ",
      message: `ต้องการลบข้อความจาก "${msg.name}" ใช่หรือไม่? การลบไม่สามารถกู้คืนได้`,
      confirmText: "ลบข้อความ",
      tone: "danger",
    });
    if (!ok) return;
    setDeletingId(msg.id);
    try {
      const res = await api(`/api/admin/contacts?id=${msg.id}`, { method: "DELETE" });
      setContacts((cs) => cs.filter((c) => c.id !== msg.id));
      setSelectedId(null);
      toast.success(res?.message || "ลบข้อความสำเร็จ");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const detail = selected && (
    <MessageDetail msg={selected} deleting={deletingId === selected.id} onDelete={remove} onToggleRead={setRead} />
  );

  return (
    <div>
      <AdminHeader
        title="ข้อความจากลูกค้า"
        description="ข้อความที่ส่งมาจากแบบฟอร์มติดต่อเรา"
        actions={
          <button className="btn btn-secondary" onClick={load} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} /> รีเฟรช
          </button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterTabs
          tabs={[
            { value: "all", label: "ทั้งหมด", count: searched.length },
            { value: "unread", label: "ยังไม่อ่าน", count: unreadCount },
          ]}
          value={filter}
          onChange={(v) => {
            setFilter(v);
            setPage(1);
          }}
        />
        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="ค้นหาชื่อ, อีเมล, หรือข้อความ..."
          className="sm:w-80"
        />
      </div>

      {error && (
        <Alert tone="error" title="โหลดข้อมูลไม่สำเร็จ" className="mb-4">
          {error}
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <div className="card overflow-hidden">
          {loading && !contacts.length ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton h-16 w-full" />
              ))}
            </div>
          ) : !list.length ? (
            <EmptyState
              icon={Inbox}
              title={filter === "unread" ? "ไม่มีข้อความที่ยังไม่อ่าน" : "ไม่มีข้อความ"}
              description={!contacts.length ? "ยังไม่มีข้อความจากลูกค้าในระบบ" : search ? "ลองเปลี่ยนคำค้นหา" : undefined}
            />
          ) : (
            <>
              <ul className="divide-y divide-slate-100 lg:max-h-[70vh] lg:overflow-y-auto">
                {rows.map((c) => {
                  const unread = isUnread(c);
                  const t = topic(c.article);
                  return (
                    <li key={c.id}>
                      <button
                        onClick={() => open(c)}
                        aria-current={selectedId === c.id}
                        className={cn(
                          "relative flex w-full gap-3 px-4 py-3.5 text-left transition-colors",
                          selectedId === c.id ? "bg-brand-50" : unread ? "bg-sky-50/40 hover:bg-slate-50" : "hover:bg-slate-50"
                        )}
                      >
                        {selectedId === c.id && <span className="absolute inset-y-0 left-0 w-1 bg-brand-700" />}
                        <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", unread ? "bg-brand-600" : "bg-transparent")} aria-hidden />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className={cn("truncate text-sm", unread ? "font-semibold text-slate-900" : "font-medium text-slate-700")}>{c.name}</p>
                            <span className="shrink-0 text-[11px] text-slate-400">{formatDateTime(c.createdAt)}</span>
                          </div>
                          <p className={cn("text-xs", unread ? "font-medium text-brand-700" : "text-slate-500")}>{t.label}</p>
                          <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{c.detail}</p>
                        </div>
                        {unread && <span className="sr-only">ยังไม่อ่าน</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>
              <Pager page={safePage} pageCount={pageCount} onChange={setPage} total={list.length} />
            </>
          )}
        </div>

        <div className="hidden lg:block">
          <div className="card card-body sticky top-24 min-h-[320px]">
            {selected ? (
              <div className="animate-fade-in">{detail}</div>
            ) : (
              <EmptyState icon={MailOpen} title="เลือกข้อความเพื่ออ่าน" description="คลิกที่ข้อความทางซ้ายเพื่อดูรายละเอียดและตอบกลับลูกค้า" />
            )}
          </div>
        </div>
      </div>

      <Modal open={!isDesktop && !!selected} onClose={() => setSelectedId(null)} title="รายละเอียดข้อความ">
        {!isDesktop && detail}
      </Modal>

      {!loading && !contacts.length && !error && (
        <p className="mt-4 flex items-center gap-2 text-xs text-slate-400">
          <MessageSquare className="h-4 w-4" /> ข้อความใหม่จะแสดงที่นี่เมื่อลูกค้าส่งแบบฟอร์มจากหน้า &quot;ติดต่อเรา&quot;
        </p>
      )}
    </div>
  );
}
