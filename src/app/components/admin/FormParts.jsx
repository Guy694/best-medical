"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ImagePlus, RefreshCw, Trash2, UploadCloud } from "lucide-react";
import { useToast } from "@/app/components/Providers";
import { Spinner } from "@/app/components/ui";
import { cn, imgSrc } from "@/app/lib/format";

export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Returns a Thai error message when the file is not an acceptable image, otherwise null. */
export function validateImage(file) {
  if (!file) return "ไม่พบไฟล์";
  if (!IMAGE_TYPES.includes(file.type)) return "รองรับเฉพาะไฟล์รูปภาพ JPG, PNG, WEBP หรือ GIF";
  if (file.size > MAX_IMAGE_BYTES) return "ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 5MB)";
  return null;
}

/** White card section with a title used by admin forms. */
export function FormSection({ title, description, icon: Icon, children, className }) {
  return (
    <section className={cn("card", className)}>
      <div className="flex items-start gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
        {Icon && (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <Icon className="h-[18px] w-[18px]" />
          </span>
        )}
        <div>
          <h2 className="font-semibold text-slate-900">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
        </div>
      </div>
      <div className="space-y-5 p-5 sm:p-6">{children}</div>
    </section>
  );
}

/** Accessible on/off switch. */
export function Switch({ checked, onChange, disabled, label, className }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-accent-500" : "bg-slate-300",
        className
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

/**
 * Drag & drop / file-picker image field with preview.
 * - `file`: newly selected File (or null) · `currentUrl`: existing image URL (or null)
 * - `onChange(file)` when a valid file is picked · `onRemove()` to clear (omit to hide the remove button)
 */
export function ImagePicker({ file, currentUrl, onChange, onRemove, busy, aspect = "aspect-square", hint }) {
  const toast = useToast();
  const inputId = useId();
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);
  const [objectUrl, setObjectUrl] = useState(null);

  useEffect(() => {
    if (!file) {
      setObjectUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const preview = objectUrl || (currentUrl ? imgSrc(currentUrl) : null);

  const pick = (f) => {
    if (!f) return;
    const err = validateImage(f);
    if (err) {
      toast.error(err);
      return;
    }
    onChange(f);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    if (busy) return;
    pick(e.dataTransfer.files?.[0]);
  };

  return (
    <div>
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={IMAGE_TYPES.join(",")}
        className="sr-only"
        onChange={(e) => {
          pick(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        className={cn(
          "relative overflow-hidden rounded-2xl border-2 border-dashed transition-colors",
          aspect,
          drag ? "border-brand-500 bg-brand-50" : preview ? "border-slate-200 bg-slate-50" : "border-slate-300 bg-slate-50 hover:border-brand-400 hover:bg-brand-50/40"
        )}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="ตัวอย่างรูปภาพ"
            className="h-full w-full object-contain"
            onError={(e) => (e.currentTarget.src = "/placeholder.png")}
          />
        ) : (
          <label
            htmlFor={inputId}
            className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 p-6 text-center"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-sm">
              <UploadCloud className="h-6 w-6" />
            </span>
            <span className="text-sm font-medium text-slate-700">ลากรูปมาวาง หรือคลิกเพื่อเลือกไฟล์</span>
            <span className="text-xs text-slate-500">JPG, PNG, WEBP, GIF ขนาดไม่เกิน 5MB</span>
          </label>
        )}
        {busy && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <Spinner className="h-7 w-7 text-brand-600" />
          </div>
        )}
      </div>

      {preview && (
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" className="btn btn-secondary btn-sm" disabled={busy} onClick={() => inputRef.current?.click()}>
            <RefreshCw className="h-4 w-4" /> เปลี่ยนรูป
          </button>
          {onRemove && (
            <button type="button" className="btn btn-danger-soft btn-sm" disabled={busy} onClick={onRemove}>
              <Trash2 className="h-4 w-4" /> ลบรูป
            </button>
          )}
        </div>
      )}
      {!preview && (
        <button type="button" className="btn btn-ghost btn-sm mt-2" disabled={busy} onClick={() => inputRef.current?.click()}>
          <ImagePlus className="h-4 w-4" /> เลือกรูปภาพ
        </button>
      )}
      {file && <p className="help truncate">ไฟล์ใหม่: {file.name}</p>}
      {hint && <p className="help">{hint}</p>}
    </div>
  );
}

/** Sticky bottom action bar for long admin forms. */
export function StickyActions({ children }) {
  return (
    <div className="sticky bottom-0 z-10 -mx-4 mt-6 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">{children}</div>
    </div>
  );
}
