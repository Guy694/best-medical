"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FolderX, Image as ImageIcon, Save, Tag } from "lucide-react";
import { useToast } from "@/app/components/Providers";
import { Alert, EmptyState, Field, PageLoader, Spinner } from "@/app/components/ui";
import { FormSection, ImagePicker, StickyActions } from "@/app/components/admin/FormParts";
import { api } from "@/app/lib/format";

/** Shared add / edit form for categories. `categoryId` → edit mode. */
export default function CategoryForm({ categoryId }) {
  const isEdit = Boolean(categoryId);
  const router = useRouter();
  const toast = useToast();
  const submitting = useRef(false);

  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [error, setError] = useState("");
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    let alive = true;
    api(`/api/admin/categories/${categoryId}`)
      .then((c) => {
        if (!alive) return;
        setName(c.cate_name || "");
        setCurrentImage(c.cate_img || null);
      })
      .catch((err) => alive && setLoadError(err.message))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [isEdit, categoryId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting.current) return;
    setApiError("");
    if (!name.trim()) {
      setError("กรุณากรอกชื่อหมวดหมู่");
      return;
    }
    submitting.current = true;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("cate_name", name.trim());
      if (file) fd.append("cate_img", file);
      const res = await api(isEdit ? `/api/admin/categories/${categoryId}` : "/api/admin/categories", {
        method: isEdit ? "PUT" : "POST",
        body: fd,
      });
      toast.success(res?.message || "บันทึกหมวดหมู่เรียบร้อย");
      router.push("/admin/categories");
    } catch (err) {
      setApiError(err.message);
      toast.error(err.message);
      submitting.current = false;
      setSaving(false);
    }
  };

  if (loading) return <PageLoader label="กำลังโหลดข้อมูลหมวดหมู่..." />;
  if (loadError)
    return (
      <div className="card">
        <EmptyState
          icon={FolderX}
          title="ไม่สามารถโหลดข้อมูลได้"
          description={loadError}
          action={
            <Link href="/admin/categories" className="btn btn-primary">
              กลับไปหน้ารายการหมวดหมู่
            </Link>
          }
        />
      </div>
    );

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      {apiError && (
        <Alert tone="error" title="บันทึกไม่สำเร็จ">
          {apiError}
        </Alert>
      )}
      <FormSection title="ข้อมูลหมวดหมู่" icon={Tag}>
        <Field label="ชื่อหมวดหมู่" required error={error}>
          <input
            className={`input ${error ? "input-error" : ""}`}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError("");
            }}
            maxLength={100}
            required
            autoFocus={!isEdit}
            placeholder="เช่น เครื่องวัดความดัน"
          />
        </Field>
      </FormSection>

      <FormSection
        title="รูปภาพหมวดหมู่"
        icon={ImageIcon}
        description={isEdit ? "หากไม่เลือกรูปใหม่ ระบบจะใช้รูปเดิม" : "รูปนี้จะแสดงในหน้าแรกและหน้ารวมหมวดหมู่"}
      >
        <div className="max-w-xs">
          <ImagePicker
            file={file}
            currentUrl={currentImage}
            onChange={setFile}
            onRemove={file ? () => setFile(null) : undefined}
            hint="แนะนำรูปสี่เหลี่ยมจัตุรัส ขนาดไม่เกิน 5MB"
          />
        </div>
      </FormSection>

      <StickyActions>
        <Link href="/admin/categories" className={`btn btn-secondary ${saving ? "pointer-events-none opacity-60" : ""}`}>
          ยกเลิก
        </Link>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? <Spinner className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saving ? "กำลังบันทึก..." : isEdit ? "บันทึกการเปลี่ยนแปลง" : "เพิ่มหมวดหมู่"}
        </button>
      </StickyActions>
    </form>
  );
}
