"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, FileText, Pencil, Plus, Trash2, Send, EyeOff } from "lucide-react";
import { AdminHeader, SearchInput, FilterTabs, Pager, paginate } from "@/app/components/admin";
import { Badge, EmptyState, Alert, Modal, Field, Spinner } from "@/app/components/ui";
import { ImagePicker } from "@/app/components/admin/FormParts";
import TiptapEditor from "@/app/components/TiptapEditor";
import { useToast } from "@/app/components/Providers";
import { api, formatDate, imgSrc } from "@/app/lib/format";

const STATUS = {
  published: { label: "เผยแพร่", tone: "emerald" },
  draft: { label: "ฉบับร่าง", tone: "slate" },
  scheduled: { label: "ตั้งเวลา", tone: "amber" },
};

const EMPTY = { title: "", category: "", excerpt: "", banner: "", status: "published", published_at: "", content: "" };

const toLocalInput = (d) => {
  if (!d) return "";
  const x = new Date(d);
  if (isNaN(x)) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}T${pad(x.getHours())}:${pad(x.getMinutes())}`;
};

function ArticleEditor({ open, article, categories, onClose, onSaved }) {
  const toast = useToast();
  const [form, setForm] = useState(EMPTY);
  const [bannerFile, setBannerFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");
    setBannerFile(null);
    if (!article) {
      setForm(EMPTY);
      return;
    }
    setLoading(true);
    api(`/api/articles/${article.id}`)
      .then(({ article: a }) =>
        setForm({
          title: a.title || "",
          category: a.category || "",
          excerpt: a.excerpt || "",
          banner: a.banner || "",
          status: a.status || "draft",
          published_at: toLocalInput(a.published_at),
          content: a.content || "",
        })
      )
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [open, article]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e?.target ? e.target.value : e }));

  const save = async (e) => {
    e?.preventDefault();
    if (saving) return;
    setError("");
    if (!form.title.trim()) return setError("กรุณากรอกหัวข้อบทความ");
    if (!form.content.replace(/<[^>]*>/g, "").trim() && !/<img/i.test(form.content)) return setError("กรุณากรอกเนื้อหาบทความ");
    if (form.status === "scheduled" && !form.published_at) return setError("กรุณาระบุวันเวลาที่ต้องการเผยแพร่");
    setSaving(true);
    try {
      let banner = form.banner || null;
      if (bannerFile) {
        const fd = new FormData();
        fd.append("file", bannerFile);
        fd.append("folder", "articles");
        banner = (await api("/api/upload", { method: "POST", body: fd })).url;
      }
      const body = {
        title: form.title,
        category: form.category || null,
        excerpt: form.excerpt || null,
        banner,
        status: form.status,
        content: form.content,
        ...(form.published_at ? { published_at: new Date(form.published_at).toISOString() } : {}),
      };
      const res = article
        ? await api(`/api/articles/${article.id}`, { method: "PUT", body })
        : await api("/api/articles", { method: "POST", body });
      toast.success(res.message || "บันทึกบทความเรียบร้อย");
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => !saving && onClose()}
      size="lg"
      title={article ? "แก้ไขบทความ" : "เขียนบทความใหม่"}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose} disabled={saving}>ยกเลิก</button>
          <button className="btn btn-primary" onClick={save} disabled={saving || loading}>
            {saving && <Spinner className="h-4 w-4" />} บันทึกบทความ
          </button>
        </>
      }
    >
      {loading ? (
        <div className="space-y-3">
          <div className="skeleton h-10" />
          <div className="skeleton h-40" />
          <div className="skeleton h-64" />
        </div>
      ) : (
        <form onSubmit={save} className="space-y-5">
          {error && <Alert tone="error">{error}</Alert>}
          <Field label="หัวข้อบทความ" required>
            <input className="input" value={form.title} onChange={set("title")} maxLength={255} required />
          </Field>
          <div className="grid gap-5 md:grid-cols-[1fr_260px]">
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="หมวดหมู่">
                  <input className="input" list="article-cats" value={form.category} onChange={set("category")} maxLength={100} placeholder="เช่น ความรู้สุขภาพ" />
                  <datalist id="article-cats">
                    {categories.map((c) => <option key={c} value={c} />)}
                  </datalist>
                </Field>
                <Field label="สถานะ">
                  <select className="input" value={form.status} onChange={set("status")}>
                    <option value="published">เผยแพร่ทันที</option>
                    <option value="draft">ฉบับร่าง</option>
                    <option value="scheduled">ตั้งเวลาเผยแพร่</option>
                  </select>
                </Field>
              </div>
              {(form.status === "scheduled" || form.published_at) && (
                <Field label="วันเวลาเผยแพร่" required={form.status === "scheduled"}>
                  <input type="datetime-local" className="input" value={form.published_at} onChange={set("published_at")} />
                </Field>
              )}
              <Field label="คำโปรย" help="แสดงในหน้ารวมบทความ (เว้นว่างเพื่อสร้างจากเนื้อหาอัตโนมัติ)">
                <textarea className="input" rows={3} value={form.excerpt} onChange={set("excerpt")} maxLength={1000} />
              </Field>
            </div>
            <Field label="รูปปก">
              <ImagePicker
                file={bannerFile}
                currentUrl={form.banner}
                onChange={setBannerFile}
                onRemove={() => {
                  setBannerFile(null);
                  setForm((f) => ({ ...f, banner: "" }));
                }}
                aspect="aspect-video"
              />
            </Field>
          </div>
          <Field label="เนื้อหา" required>
            <TiptapEditor content={form.content} onUpdate={set("content")} />
          </Field>
        </form>
      )}
    </Modal>
  );
}

export default function AdminArticlesPage() {
  const toast = useToast();
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [editor, setEditor] = useState({ open: false, article: null });

  const load = useCallback(async () => {
    try {
      setError("");
      const data = await api("/api/articles?status=all&limit=100");
      setRows(data.articles || []);
    } catch (e) {
      setError(e.message);
      setRows([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => setPage(1), [tab, q]);

  const categories = useMemo(() => [...new Set((rows || []).map((r) => r.category).filter(Boolean))].sort(), [rows]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (rows || []).filter(
      (r) => (tab === "all" || r.status === tab) && (!s || r.title?.toLowerCase().includes(s) || r.category?.toLowerCase().includes(s))
    );
  }, [rows, tab, q]);
  const { rows: pageRows, pageCount } = paginate(filtered, page, 15);

  const count = (s) => (rows || []).filter((r) => r.status === s).length;

  const togglePublish = async (a) => {
    const next = a.status === "published" ? "draft" : "published";
    try {
      await api(`/api/articles/${a.id}`, { method: "PUT", body: { status: next } });
      toast.success(next === "published" ? "เผยแพร่บทความแล้ว" : "ย้ายเป็นฉบับร่างแล้ว");
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const remove = async (a) => {
    const ok = await toast.confirm({ title: "ลบบทความ", message: `ต้องการลบ "${a.title}" ใช่หรือไม่? ไม่สามารถกู้คืนได้`, confirmText: "ลบ", tone: "danger" });
    if (!ok) return;
    try {
      await api(`/api/articles/${a.id}`, { method: "DELETE" });
      toast.success("ลบบทความเรียบร้อย");
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div>
      <AdminHeader
        title="บทความและข่าวสาร"
        description="เขียน แก้ไข และเผยแพร่บทความบนหน้าเว็บไซต์"
        actions={
          <button className="btn btn-primary" onClick={() => setEditor({ open: true, article: null })}>
            <Plus className="h-4 w-4" /> เขียนบทความ
          </button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <FilterTabs
          value={tab}
          onChange={setTab}
          tabs={[
            { value: "all", label: "ทั้งหมด", count: rows?.length ?? 0 },
            { value: "published", label: "เผยแพร่", count: count("published") },
            { value: "draft", label: "ฉบับร่าง", count: count("draft") },
            { value: "scheduled", label: "ตั้งเวลา", count: count("scheduled") },
          ]}
        />
        <SearchInput value={q} onChange={setQ} placeholder="ค้นหาหัวข้อหรือหมวดหมู่" className="lg:w-72" />
      </div>

      {error && <Alert tone="error" className="mb-4">{error}</Alert>}

      <div className="card overflow-hidden">
        {rows === null ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-16" />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="ไม่พบบทความ"
            description={q || tab !== "all" ? "ลองเปลี่ยนตัวกรองหรือคำค้นหา" : "เริ่มเขียนบทความแรกของคุณ"}
            action={<button className="btn btn-primary" onClick={() => setEditor({ open: true, article: null })}><Plus className="h-4 w-4" /> เขียนบทความ</button>}
          />
        ) : (
          <>
            <ul className="divide-y divide-slate-100">
              {pageRows.map((a) => {
                const st = STATUS[a.status] || { label: a.status, tone: "slate" };
                return (
                  <li key={a.id} className="flex flex-col gap-3 p-4 transition-colors hover:bg-slate-50/70 sm:flex-row sm:items-center">
                    <div className="h-16 w-28 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      {a.banner ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imgSrc(a.banner)} alt="" className="h-full w-full object-cover" onError={(e) => (e.currentTarget.src = "/placeholder.png")} />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-300"><FileText className="h-6 w-6" /></div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone={st.tone}>{st.label}</Badge>
                        {a.category && <span className="text-xs font-medium text-accent-700">{a.category}</span>}
                      </div>
                      <p className="mt-1 line-clamp-1 font-medium text-slate-900">{a.title}</p>
                      <p className="text-xs text-slate-500">
                        {formatDate(a.published_at || a.created_at)} · {a.author_name || "-"} · เข้าชม {Number(a.views || 0).toLocaleString("th-TH")} ครั้ง
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-1">
                      <button className="btn btn-ghost btn-sm" onClick={() => togglePublish(a)} title={a.status === "published" ? "ย้ายเป็นฉบับร่าง" : "เผยแพร่"}>
                        {a.status === "published" ? <EyeOff className="h-4 w-4" /> : <Send className="h-4 w-4" />}
                        {a.status === "published" ? "ซ่อน" : "เผยแพร่"}
                      </button>
                      {a.status === "published" && (
                        <Link href={`/article/${a.id}`} target="_blank" className="btn btn-ghost btn-sm" title="ดูหน้าเว็บ">
                          <Eye className="h-4 w-4" />
                        </Link>
                      )}
                      <button className="btn btn-ghost btn-sm" onClick={() => setEditor({ open: true, article: a })} title="แก้ไข">
                        <Pencil className="h-4 w-4" /> แก้ไข
                      </button>
                      <button className="btn btn-ghost btn-sm text-red-600 hover:bg-red-50" onClick={() => remove(a)} title="ลบ">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
            <Pager page={page} pageCount={pageCount} onChange={setPage} total={filtered.length} />
          </>
        )}
      </div>

      <ArticleEditor
        open={editor.open}
        article={editor.article}
        categories={categories}
        onClose={() => setEditor({ open: false, article: null })}
        onSaved={() => {
          setEditor({ open: false, article: null });
          load();
        }}
      />
    </div>
  );
}
