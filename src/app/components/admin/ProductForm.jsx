"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, FileText, Image as ImageIcon, Info, PackageX, Save, Tag, Wallet } from "lucide-react";
import { useToast } from "@/app/components/Providers";
import { Alert, EmptyState, Field, PageLoader, Spinner } from "@/app/components/ui";
import { FormSection, ImagePicker, StickyActions, Switch } from "@/app/components/admin/FormParts";
import { api, formatTHB } from "@/app/lib/format";

const EMPTY = {
  pro_name: "",
  codename: "",
  categoryId: "",
  price: "0",
  stock: "0",
  delivery: "0",
  warranty: "0",
  description: "",
  pro_size: "",
  shown: true,
};

const numStr = (v) => (v === null || v === undefined || v === "" ? "0" : String(Number(v)));

/** Shared add / edit form for products. `productId` → edit mode. */
export default function ProductForm({ productId }) {
  const isEdit = Boolean(productId);
  const router = useRouter();
  const toast = useToast();
  const submitting = useRef(false);

  const [form, setForm] = useState(EMPTY);
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [cats, product] = await Promise.all([
          api("/api/admin/categories"),
          isEdit ? api(`/api/admin/product/${productId}`) : Promise.resolve(null),
        ]);
        if (!alive) return;
        setCategories(Array.isArray(cats) ? cats : []);
        if (product) {
          setForm({
            pro_name: product.pro_name || "",
            codename: product.codename || "",
            categoryId: product.categoryId ? String(product.categoryId) : "",
            price: numStr(product.price),
            stock: numStr(product.stock),
            delivery: numStr(product.delivery),
            warranty: numStr(product.warranty),
            description: product.description || "",
            pro_size: product.pro_size || "",
            shown: Number(product.visible) === 0,
          });
          setCurrentImage(product.imageUrl || null);
        }
      } catch (err) {
        if (alive) setLoadError(err.message);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [isEdit, productId]);

  const set = (key) => (e) => {
    const value = e?.target ? e.target.value : e;
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (!form.pro_name.trim()) er.pro_name = "กรุณากรอกชื่อสินค้า";
    if (!form.categoryId) er.categoryId = "กรุณาเลือกหมวดหมู่";
    if (form.price === "" || Number(form.price) < 0) er.price = "ราคาต้องไม่ติดลบ";
    if (!Number.isInteger(Number(form.stock)) || Number(form.stock) < 0) er.stock = "จำนวนสต็อกต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป";
    if (Number(form.delivery) < 0) er.delivery = "ค่าจัดส่งต้องไม่ติดลบ";
    if (!Number.isInteger(Number(form.warranty)) || Number(form.warranty) < 0) er.warranty = "ระยะรับประกันต้องเป็นจำนวนเต็ม (เดือน)";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting.current) return;
    setApiError("");
    if (!validate()) {
      toast.error("กรุณาตรวจสอบข้อมูลที่กรอก");
      return;
    }
    submitting.current = true;
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("pro_name", form.pro_name.trim());
      fd.append("codename", form.codename.trim());
      fd.append("categoryId", form.categoryId);
      fd.append("price", form.price || "0");
      fd.append("stock", form.stock || "0");
      fd.append("delivery", form.delivery || "0");
      fd.append("warranty", form.warranty || "0");
      fd.append("description", form.description);
      fd.append("pro_size", form.pro_size);
      fd.append("visible", form.shown ? "0" : "1");
      if (imageFile) fd.append("image", imageFile);
      else if (isEdit && removeImage) fd.append("removeImage", "1");

      const res = await api(isEdit ? `/api/admin/product/${productId}` : "/api/admin/product", {
        method: isEdit ? "PUT" : "POST",
        body: fd,
      });
      toast.success(res?.message || (isEdit ? "บันทึกสินค้าเรียบร้อย" : "เพิ่มสินค้าเรียบร้อย"));
      router.push("/admin/product");
    } catch (err) {
      setApiError(err.message);
      toast.error(err.message);
      submitting.current = false;
      setSaving(false);
    }
  };

  if (loading) return <PageLoader label="กำลังโหลดข้อมูลสินค้า..." />;
  if (loadError)
    return (
      <div className="card">
        <EmptyState
          icon={PackageX}
          title="ไม่สามารถโหลดข้อมูลได้"
          description={loadError}
          action={
            <Link href="/admin/product" className="btn btn-primary">
              กลับไปหน้ารายการสินค้า
            </Link>
          }
        />
      </div>
    );

  const price = Number(form.price) || 0;

  return (
    <form onSubmit={onSubmit} noValidate>
      {apiError && (
        <Alert tone="error" title="บันทึกไม่สำเร็จ" className="mb-6">
          {apiError}
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <FormSection title="ข้อมูลทั่วไป" icon={Tag}>
            <Field label="ชื่อสินค้า" required error={errors.pro_name}>
              <input
                id="pro_name"
                className={`input ${errors.pro_name ? "input-error" : ""}`}
                value={form.pro_name}
                onChange={set("pro_name")}
                maxLength={200}
                required
                placeholder="เช่น เครื่องวัดความดันโลหิตแบบดิจิทัล"
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="รหัสสินค้า" help="รหัสหรือรุ่นสินค้า (ถ้ามี)">
                <input className="input" value={form.codename} onChange={set("codename")} maxLength={100} placeholder="เช่น BM-1001" />
              </Field>
              <Field label="หมวดหมู่" required error={errors.categoryId}>
                <select
                  className={`input ${errors.categoryId ? "input-error" : ""}`}
                  value={form.categoryId}
                  onChange={set("categoryId")}
                  required
                >
                  <option value="">— เลือกหมวดหมู่ —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.cate_name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            {categories.length === 0 && (
              <Alert tone="warning">
                ยังไม่มีหมวดหมู่สินค้า กรุณา{" "}
                <Link href="/admin/categories/add" className="link">
                  เพิ่มหมวดหมู่
                </Link>{" "}
                ก่อน
              </Alert>
            )}
          </FormSection>

          <FormSection title="ราคาและสต็อก" icon={Wallet}>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="ราคา (บาท)"
                error={errors.price}
                help={price > 0 ? `แสดงบนหน้าร้าน: ${formatTHB(price)}` : "ใส่ 0 เพื่อแสดงเป็น “สอบถามราคา” (ลูกค้าจะสั่งซื้อออนไลน์ไม่ได้)"}
              >
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  className={`input ${errors.price ? "input-error" : ""}`}
                  value={form.price}
                  onChange={set("price")}
                />
              </Field>
              <Field label="จำนวนในสต็อก" error={errors.stock} help="สต็อก 0 = สินค้าหมด">
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  step="1"
                  className={`input ${errors.stock ? "input-error" : ""}`}
                  value={form.stock}
                  onChange={set("stock")}
                />
              </Field>
              <Field label="ค่าจัดส่งต่อชิ้น (บาท)" error={errors.delivery} help="ใช้คำนวณค่าส่ง EMS = ค่าจัดส่ง × จำนวน">
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.01"
                  className={`input ${errors.delivery ? "input-error" : ""}`}
                  value={form.delivery}
                  onChange={set("delivery")}
                />
              </Field>
              <Field label="ระยะรับประกัน (เดือน)" error={errors.warranty} help="ใส่ 0 หากไม่มีการรับประกัน">
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  max="1200"
                  step="1"
                  className={`input ${errors.warranty ? "input-error" : ""}`}
                  value={form.warranty}
                  onChange={set("warranty")}
                />
              </Field>
            </div>
          </FormSection>

          <FormSection title="รายละเอียดสินค้า" icon={FileText}>
            <Field label="คุณสมบัติ / รายละเอียด" help="พิมพ์คุณสมบัติบรรทัดละ 1 ข้อ ระบบจะแสดงเป็นรายการบนหน้าสินค้า">
              <textarea
                className="input min-h-[180px]"
                rows={8}
                value={form.description}
                onChange={set("description")}
                maxLength={20000}
                placeholder={"เช่น\nวัดความดันและชีพจรได้แม่นยำ\nหน้าจอ LCD ขนาดใหญ่ อ่านง่าย\nบันทึกค่าได้ 60 ครั้ง"}
              />
            </Field>
            <Field label="ขนาด / รุ่น" help="ขนาด น้ำหนัก หรือรุ่นที่มีให้เลือก">
              <textarea
                className="input"
                rows={3}
                value={form.pro_size}
                onChange={set("pro_size")}
                maxLength={5000}
                placeholder="เช่น 12 x 10 x 6 ซม. / น้ำหนัก 300 กรัม"
              />
            </Field>
          </FormSection>
        </div>

        <div className="space-y-6">
          <FormSection title="รูปภาพสินค้า" icon={ImageIcon}>
            <ImagePicker
              file={imageFile}
              currentUrl={removeImage ? null : currentImage}
              onChange={(f) => {
                setImageFile(f);
                setRemoveImage(false);
              }}
              onRemove={() => {
                setImageFile(null);
                if (currentImage) setRemoveImage(true);
              }}
              hint="แนะนำรูปสี่เหลี่ยมจัตุรัส พื้นหลังสีขาว"
            />
          </FormSection>

          <FormSection title="การแสดงผล" icon={Eye}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p id="shown-label" className="text-sm font-medium text-slate-800">
                  แสดงสินค้าบนหน้าร้าน
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {form.shown ? "ลูกค้ามองเห็นและค้นหาสินค้านี้ได้" : "สินค้าถูกซ่อน ลูกค้าจะไม่เห็นสินค้านี้"}
                </p>
              </div>
              <Switch checked={form.shown} onChange={set("shown")} label="แสดงสินค้าบนหน้าร้าน" />
            </div>
            {price === 0 && (
              <div className="flex gap-2 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
                <Info className="h-4 w-4 shrink-0" />
                สินค้านี้จะแสดงเป็น “สอบถามราคา” และให้ลูกค้าติดต่อร้านแทนการสั่งซื้อ
              </div>
            )}
          </FormSection>
        </div>
      </div>

      <StickyActions>
        <Link href="/admin/product" className={`btn btn-secondary ${saving ? "pointer-events-none opacity-60" : ""}`}>
          ยกเลิก
        </Link>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? <Spinner className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saving ? "กำลังบันทึก..." : isEdit ? "บันทึกการเปลี่ยนแปลง" : "บันทึกสินค้า"}
        </button>
      </StickyActions>
    </form>
  );
}
